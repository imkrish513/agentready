import { TestResult } from '../types/execution';

export function parseTestOutput(output: string): TestResult[] {
  const results: TestResult[] = [];
  
  // Format typically: test_name (__main__.TestClass) ... ok
  // test_name (__main__.TestClass) ... FAIL
  const testLineRegex = /^(test_[a-zA-Z0-9_]+) \([^)]+\) \.\.\. (ok|FAIL|ERROR)$/gm;
  
  let match;
  const tests: { name: string; status: string }[] = [];
  while ((match = testLineRegex.exec(output)) !== null) {
    tests.push({ name: match[1], status: match[2] });
  }

  // Parse failures
  const failureSection = output.split(/FAILURES:|ERRORS:/)[1] || '';
  
  tests.forEach(test => {
    if (test.status === 'ok') {
      results.push({
        name: test.name,
        passed: true,
        expected: '',
        actual: ''
      });
    } else {
      // Find the specific error for this test
      const testErrorRegex = new RegExp(`${test.name}: (.*?)(?=\\n======================================================================|\\n----------------------------------------------------------------------|$)`, 'gs');
      const errMatch = testErrorRegex.exec(failureSection);
      let errorStr = errMatch ? errMatch[1].trim() : 'Unknown error';
      
      results.push({
        name: test.name,
        passed: false,
        expected: '',
        actual: '',
        error: errorStr
      });
    }
  });

  return results;
}
