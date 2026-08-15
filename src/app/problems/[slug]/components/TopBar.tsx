import React from 'react';
import Link from 'next/link';
import styles from './TopBar.module.css';
import { Phase } from '@/types/problem';

interface TopBarProps {
  title: string;
  phase: Phase;
  timeRemaining: number;
  isRunning: boolean;
  onRun: () => void;
  helpMode: boolean;
  onToggleHelp: () => void;
  onExit: () => void;
}

export default function TopBar({
  title,
  phase,
  timeRemaining,
  isRunning,
  onRun,
  helpMode,
  onToggleHelp,
  onExit,
}: TopBarProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemaining < 300;

  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo}>
          AgentReady
        </Link>
      </div>

      <div className={styles.center}>
        <span className={styles.title}>{title}</span>
        <span className={styles.phaseBadge}>{phase?.name || 'Phase'}</span>
        <span className={`${styles.timer} ${isWarning ? styles.timerWarning : ''}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>

      <div className={styles.right}>
        <button 
          className={styles.runBtn} 
          onClick={onRun} 
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : '▶ Run Main'}
        </button>

        <label className={styles.helpToggle}>
          <span className={helpMode ? styles.active : ''}>Help Mode</span>
          <div className={styles.switch}>
            <input 
              type="checkbox" 
              checked={helpMode} 
              onChange={onToggleHelp} 
              disabled={helpMode}
            />
            <span className={styles.slider}></span>
          </div>
        </label>

        <button className={styles.exitBtn} onClick={onExit}>
          Exit
        </button>
      </div>
    </div>
  );
}
