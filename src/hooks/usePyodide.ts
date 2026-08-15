import { useState, useEffect, useRef, useCallback } from 'react';
import { TestResult } from '../types/execution';
import { parseTestOutput } from '../lib/testRunner';

export interface PyodideResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export interface UsePyodideReturn {
  isLoading: boolean;
  isReady: boolean;
  isRunning: boolean;
  runCode: (files: { path: string; content: string }[], entryPoint: string) => Promise<PyodideResult>;
  runTests: (files: { path: string; content: string }[], testFile: string) => Promise<TestResult[]>;
  output: string;
  error: string | null;
  clearOutput: () => void;
}

export function usePyodide(): UsePyodideReturn {
  const workerRef = useRef<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const initWorker = useCallback(() => {
    setIsLoading(true);
    setIsReady(false);
    
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    
    const worker = new Worker('/pyodide-worker.js');
    workerRef.current = worker;
    
    worker.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'init-complete') {
        setIsLoading(false);
        setIsReady(true);
      } else if (type === 'init-error') {
        setIsLoading(false);
        setError(event.data.error);
      }
    };
    
    worker.postMessage({ type: 'init' });
  }, []);

  useEffect(() => {
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [initWorker]);

  const clearOutput = useCallback(() => {
    setOutput('');
    setError(null);
  }, []);

  const runCode = useCallback((files: { path: string; content: string }[], entryPoint: string): Promise<PyodideResult> => {
    return new Promise((resolve) => {
      if (!workerRef.current || !isReady) {
        resolve({ success: false, output: '', error: 'Pyodide not ready', executionTime: 0 });
        return;
      }
      
      setIsRunning(true);
      setOutput('');
      setError(null);
      
      const entryFile = files.find(f => f.path === entryPoint);
      const code = entryFile ? entryFile.content : '';
      
      const timeoutId = setTimeout(() => {
        if (workerRef.current) {
          workerRef.current.terminate();
          initWorker();
        }
        setIsRunning(false);
        const timeoutError = 'Execution timed out (> 30s)';
        setError(timeoutError);
        resolve({ success: false, output: '', error: timeoutError, executionTime: 30000 });
      }, 30000);
      
      let localOutput = '';
      
      const messageHandler = (event: MessageEvent) => {
        const { type, text, success, error: execError, executionTime } = event.data;
        
        if (type === 'stdout' || type === 'stderr') {
          localOutput += text + '\n';
          setOutput(prev => prev + text + '\n');
        } else if (type === 'result') {
          clearTimeout(timeoutId);
          workerRef.current?.removeEventListener('message', messageHandler);
          setIsRunning(false);
          
          if (execError) {
            setError(execError);
          }
          
          resolve({
            success,
            output: localOutput,
            error: execError,
            executionTime
          });
        }
      };
      
      workerRef.current.addEventListener('message', messageHandler);
      workerRef.current.postMessage({ type: 'run', code, files });
    });
  }, [isReady, initWorker]);

  const runTests = useCallback((files: { path: string; content: string }[], testFile: string): Promise<TestResult[]> => {
    return new Promise((resolve) => {
      if (!workerRef.current || !isReady) {
        resolve([{ name: 'Init', passed: false, expected: '', actual: '', error: 'Pyodide not ready' }]);
        return;
      }
      
      setIsRunning(true);
      setOutput('');
      setError(null);
      
      const timeoutId = setTimeout(() => {
        if (workerRef.current) {
          workerRef.current.terminate();
          initWorker();
        }
        setIsRunning(false);
        const timeoutError = 'Execution timed out (> 30s)';
        setError(timeoutError);
        resolve([{ name: 'Timeout', passed: false, expected: '', actual: '', error: timeoutError }]);
      }, 30000);
      
      let localOutput = '';
      
      const messageHandler = (event: MessageEvent) => {
        const { type, text, error: execError } = event.data;
        
        if (type === 'stdout' || type === 'stderr') {
          localOutput += text + '\n';
          setOutput(prev => prev + text + '\n');
        } else if (type === 'result') {
          clearTimeout(timeoutId);
          workerRef.current?.removeEventListener('message', messageHandler);
          setIsRunning(false);
          
          if (execError) {
            setError(execError);
            resolve([{ name: 'Runtime Error', passed: false, expected: '', actual: '', error: execError }]);
          } else {
            const parsedResults = parseTestOutput(localOutput);
            resolve(parsedResults);
          }
        }
      };
      
      workerRef.current.addEventListener('message', messageHandler);
      workerRef.current.postMessage({ type: 'runTests', files, testFile });
    });
  }, [isReady, initWorker]);

  return {
    isLoading,
    isReady,
    isRunning,
    runCode,
    runTests,
    output,
    error,
    clearOutput
  };
}
