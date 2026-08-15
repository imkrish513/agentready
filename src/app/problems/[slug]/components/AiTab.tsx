import React from 'react';
import styles from './AiTab.module.css';

interface AiTabProps {
  aiEnabled: boolean;
}

export default function AiTab({ aiEnabled }: AiTabProps) {

  if (!aiEnabled) {
    return (
      <div className={styles.container}>
        <div className={styles.lockedState}>
          <div className={styles.lockIcon}>🔒</div>
          <h3>AI Assistant Locked</h3>
          <p>The AI assistant is disabled for this phase of the interview. It will become available in a later phase to help you debug or optimize.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatArea}>
        <div className={styles.placeholderMsg}>
          Hello! I'm your AI pairing partner for this phase. How can I help you with your code?
          <br /><br />
          <em>(AI integration coming in Phase 3)</em>
        </div>
      </div>
      
      <div className={styles.inputArea}>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="Ask a question..." 
          disabled
        />
        <button className={styles.sendBtn} disabled>↑</button>
      </div>
    </div>
  );
}
