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
      <h2 className={styles.heading}>{phase.name}</h2>
      
      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: phase.guideContent }}
      />

      {phase.tasks && phase.tasks.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Tasks</h3>
          <div className={styles.taskList}>
            {phase.tasks.map((task, i) => (
              <label key={i} className={styles.taskItem}>
                <input 
                  type="checkbox" 
                  checked={!!completedTasks[i]} 
                  onChange={() => toggleTask(i)} 
                />
                <span className={styles.taskText}>{task}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {phase.questions && phase.questions.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Questions</h3>
          <div className={styles.questionList}>
            {phase.questions.map((q) => (
              <div key={q.id} className={styles.questionItem}>
                <div className={styles.questionText}>{q.question}</div>
                
                {q.type === 'mcq' && q.options ? (
                  <div className={styles.options}>
                    {q.options.map((opt, i) => (
                      <label key={i} className={styles.optionLabel}>
                        <input 
                          type="radio" 
                          name={q.id} 
                          value={opt}
                          checked={phaseAnswers[q.id] === opt}
                          onChange={(e) => onAnswerChange(q.id, e.target.value)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea 
                    className={styles.textarea}
                    placeholder="Your answer..."
                    value={phaseAnswers[q.id] || ''}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  />
                )}
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
        Next Phase →
      </button>
    </div>
  );
}
