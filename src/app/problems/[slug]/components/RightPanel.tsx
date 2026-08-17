import React from 'react';
import styles from './RightPanel.module.css';
import GuideTab from './GuideTab';
import OutputTab from './OutputTab';
import AiTab from './AiTab';
import { Phase } from '@/types/problem';
import { TestResult } from '@/types/execution';

interface RightPanelProps {
  activeTab: 'guide' | 'output' | 'ai';
  onTabChange: (tab: 'guide' | 'output' | 'ai') => void;
  phase: Phase;
  phaseAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onNextPhase: () => void;
  output: string;
  testResults: TestResult[];
  isRunning: boolean;
  onClearOutput: () => void;
}

export default function RightPanel({
  activeTab,
  onTabChange,
  phase,
  phaseAnswers,
  onAnswerChange,
  onNextPhase,
  output,
  testResults,
  isRunning,
  onClearOutput
}: RightPanelProps) {

  return (
    <div className={styles.panel}>
      <div className={styles.tabList}>
        <button 
          className={`${styles.tab} ${activeTab === 'guide' ? styles.active : ''}`}
          onClick={() => onTabChange('guide')}
        >
          Guide
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'output' ? styles.active : ''}`}
          onClick={() => onTabChange('output')}
        >
          Output
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'ai' ? styles.active : ''}`}
          onClick={() => onTabChange('ai')}
          disabled={!phase?.aiAccessEnabled}
          title={!phase?.aiAccessEnabled ? "AI Assistant is not available in this phase" : ""}
        >
          AI Assist {!phase?.aiAccessEnabled && (
            <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" style={{ opacity: 0.5 }}>
              <path d="M11 5V4a3 3 0 0 0-6 0v1H4v7h8V5h-1zM6 4a2 2 0 1 1 4 0v1H6V4z"/>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'guide' && (
          <GuideTab 
            phase={phase} 
            phaseAnswers={phaseAnswers} 
            onAnswerChange={onAnswerChange}
            onNextPhase={onNextPhase}
          />
        )}
        {activeTab === 'output' && (
          <OutputTab 
            output={output} 
            testResults={testResults} 
            isRunning={isRunning} 
            onClearOutput={onClearOutput}
          />
        )}
        {activeTab === 'ai' && (
          <AiTab aiEnabled={!!phase?.aiAccessEnabled} />
        )}
      </div>
    </div>
  );
}
