importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");

let pyodide = null;

async function initPyodide() {
  try {
    pyodide = await loadPyodide({
      stdout: (text) => postMessage({ type: 'stdout', text }),
      stderr: (text) => postMessage({ type: 'stderr', text })
    });
    postMessage({ type: 'init-complete' });
  } catch (err) {
    postMessage({ type: 'init-error', error: err.message });
  }
}

async function prepareFileSystem(files) {
  pyodide.runPython(`
import sys
import os

os.makedirs('/home/project/src', exist_ok=True)
os.makedirs('/home/project/tests', exist_ok=True)

if '/home/project/src' not in sys.path:
    sys.path.insert(0, '/home/project/src')
if '/home/project/tests' not in sys.path:
    sys.path.insert(0, '/home/project/tests')
if '/home/project' not in sys.path:
    sys.path.insert(0, '/home/project')
`);

  for (const file of files) {
    const targetPath = file.path.startsWith('/') ? file.path : \`/home/project/\${file.path}\`;
    const dir = targetPath.substring(0, targetPath.lastIndexOf('/'));
    
    try {
      pyodide.FS.mkdirTree(dir);
    } catch (e) {
      // directory might already exist
    }
    
    pyodide.FS.writeFile(targetPath, file.content);
  }
}

onmessage = async (event) => {
  const { type, code, files, testFile } = event.data;

  if (type === 'init') {
    await initPyodide();
  } else if (type === 'run') {
    if (!pyodide) {
      postMessage({ type: 'result', success: false, output: '', error: 'Pyodide not initialized', executionTime: 0 });
      return;
    }

    const startTime = performance.now();
    try {
      if (files) {
        await prepareFileSystem(files);
      }
      
      await pyodide.runPythonAsync(code);
      const executionTime = performance.now() - startTime;
      
      postMessage({ type: 'result', success: true, output: '', executionTime });
    } catch (err) {
      const executionTime = performance.now() - startTime;
      postMessage({ type: 'result', success: false, output: '', error: err.message, executionTime });
    }
  } else if (type === 'runTests') {
    if (!pyodide) {
      postMessage({ type: 'result', success: false, output: '', error: 'Pyodide not initialized', executionTime: 0 });
      return;
    }
    
    const startTime = performance.now();
    try {
      if (files) {
        await prepareFileSystem(files);
      }
      
      const parts = testFile.split('/');
      const filename = parts[parts.length - 1];
      const moduleName = filename.replace('.py', '');
      
      const testCode = \`
import unittest
import io
import sys
import os

stream = io.StringIO()
runner = unittest.TextTestRunner(stream=stream, verbosity=2)

loader = unittest.TestLoader()
try:
    suite = loader.discover('/home/project/tests', pattern='\${filename}')
    if suite.countTestCases() == 0:
        suite = loader.loadTestsFromName('\${moduleName}')
except Exception as e:
    import importlib.util
    spec = importlib.util.spec_from_file_location("\${moduleName}", f"/home/project/\${testFile}")
    module = importlib.util.module_from_spec(spec)
    sys.modules["\${moduleName}"] = module
    spec.loader.exec_module(module)
    suite = loader.loadTestsFromModule(module)

result = runner.run(suite)
print(stream.getvalue())
\`;
      await pyodide.runPythonAsync(testCode);
      const executionTime = performance.now() - startTime;
      postMessage({ type: 'result', success: true, output: '', executionTime });
      
    } catch (err) {
      const executionTime = performance.now() - startTime;
      postMessage({ type: 'result', success: false, output: '', error: err.message, executionTime });
    }
  }
};
