import React from 'react';
import styles from './ExitModal.module.css';

interface ExitModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitModal({ 
  title = "End Session?", 
  message = "Your progress will be scored and this session will end. Are you sure you want to exit?", 
  confirmText = "End Session",
  onConfirm, 
  onCancel 
}: ExitModalProps) {
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.exitBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
