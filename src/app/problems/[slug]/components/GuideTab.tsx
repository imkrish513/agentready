import React, { useState } from 'react';
import styles from './GuideTab.module.css';
import { Phase } from '@/types/problem';

interface GuideTabProps {
  phase: Phase;
  phaseAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onNextPhase: () => void;
}

export default function GuideTab({ phase, phaseAnswers, onAnswerChange, onNextPhase }: GuideTabProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});

  if (!phase) return null;

  const toggleTask = (index: number) => {
    setCompletedTasks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const allTasksDone = phase.tasks?.length ? phase.tasks.every((_, i) => completedTasks[i]) : true;
  const allQuestionsAnswered = phase.questions?.length ? phase.questions.every(q => !!phaseAnswers[q.id]) : true;
  
  const canProceed = allTasksDone && allQuestionsAnswered;

  return (
    <div className={styles.container}>
      <div className={styles.phaseHeader}>
        <div className={styles.phaseBadge}>Phase {phase.id + 1}</div>
        <h2 className={styles.phaseTitle}>{phase.name}</h2>
        <div className={styles.phaseMeta}>
          <span>{phase.durationMinutes} min</span>
          <span className={styles.dot}>·</span>
          <span>{phase.aiAccessEnabled ? 'AI available' : 'No AI'}</span>
        </div>
      </div>
      
      <div 
        className={styles.guideContent}
        dangerouslySetInnerHTML={{ __html: phase.guideContent }}
      />

      {phase.tasks && phase.tasks.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Objectives</h3>
            <span className={styles.sectionCount}>
              {Object.values(completedTasks).filter(Boolean).length}/{phase.tasks.length}
            </span>
          </div>
          <div className={styles.taskList}>
            {phase.tasks.map((task, i) => (
              <label key={i} className={`${styles.taskItem} ${completedTasks[i] ? styles.taskDone : ''}`}>
                <span className={styles.checkbox}>
                  <input 
                    type="checkbox" 
                    checked={!!completedTasks[i]} 
                    onChange={() => toggleTask(i)} 
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkmark}>
                    {completedTasks[i] && (
                      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                        <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </span>
                <span className={styles.taskText}>{task}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {phase.questions && phase.questions.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Questions</h3>
            <span className={styles.sectionCount}>
              {phase.questions.filter(q => !!phaseAnswers[q.id]).length}/{phase.questions.length}
            </span>
          </div>
          <div className={styles.questionList}>
            {phase.questions.map((q, qIdx) => (
              <div key={q.id} className={styles.questionItem}>
                <div className={styles.questionNumber}>Q{qIdx + 1}</div>
                <div className={styles.questionBody}>
                  <div className={styles.questionText}>{q.question}</div>
                  
                  {q.type === 'mcq' && q.options ? (
                    <div className={styles.optionGroup}>
                      {q.options.map((opt, i) => (
                        <label 
                          key={i} 
                          className={`${styles.optionLabel} ${phaseAnswers[q.id] === opt ? styles.optionSelected : ''}`}
                        >
                          <span className={styles.radio}>
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt}
                              checked={phaseAnswers[q.id] === opt}
                              onChange={(e) => onAnswerChange(q.id, e.target.value)}
                              className={styles.radioInput}
                            />
                            <span className={styles.radioMark} />
                          </span>
                          <span className={styles.optionText}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea 
                      className={styles.textarea}
                      placeholder="Type your answer..."
                      value={phaseAnswers[q.id] || ''}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                      rows={3}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        className={styles.nextBtn}
        disabled={!canProceed}
        onClick={onNextPhase}
      >
        <span>Next Phase</span>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
