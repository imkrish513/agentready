import React from 'react';
import styles from './OutputTab.module.css';
import { TestResult } from '@/types/execution';

interface OutputTabProps {
  output: string;
  testResults: TestResult[];
  isRunning: boolean;
  onClearOutput: () => void;
}

export default function OutputTab({ output, testResults, isRunning, onClearOutput }: OutputTabProps) {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Terminal Output</span>
        <button className={styles.clearBtn} onClick={onClearOutput}>Clear</button>
      </div>

      {isRunning && (
        <div className={styles.loading}>
          <span className={styles.spinner}>⟳</span> Executing code...
        </div>
      )}

      {!isRunning && !output && testResults.length === 0 && (
        <div className={styles.empty}>
          Run your code to see output here.
        </div>
      )}

      {output && (
        <div className={styles.outputArea}>
          {output}
        </div>
      )}

      {testResults.length > 0 && (
        <div className={styles.testResults}>
          <span className={styles.title}>Test Results</span>
          {testResults.map((test, i) => (
            <div key={i} className={styles.testItem}>
              <div className={styles.testHeader}>
                <span className={test.passed ? styles.pass : styles.fail}>
                  {test.passed ? '✓' : '✗'}
                </span>
                <span>{test.name}</span>
              </div>
              
              {!test.passed && (
                <div className={styles.testDetails}>
                  <div>Expected: <span>{test.expected}</span></div>
                  <div>Actual: <span>{test.actual}</span></div>
                  {test.error && <div className={styles.errorMsg}>{test.error}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
