import React from 'react';
import dynamic from 'next/dynamic';
import styles from './EditorPanel.module.css';
import { ProblemFile } from '@/types/problem';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface EditorPanelProps {
  openFiles: ProblemFile[];
  activeFile: ProblemFile | null;
  fileContents: Record<string, string>;
  onTabClick: (file: ProblemFile) => void;
  onCloseTab: (e: React.MouseEvent, path: string) => void;
  onChange: (content: string | undefined) => void;
}

export default function EditorPanel({
  openFiles,
  activeFile,
  fileContents,
  onTabClick,
  onCloseTab,
  onChange
}: EditorPanelProps) {

  return (
    <div className={styles.editorContainer}>
      <div className={styles.tabBar}>
        {openFiles.map(file => (
          <div
            key={file.path}
            className={`${styles.tab} ${activeFile?.path === file.path ? styles.active : ''}`}
            onClick={() => onTabClick(file)}
          >
            <svg className={styles.tabIcon} viewBox="0 0 16 16" fill="none">
              <path d="M7.94 1C4.57 1 4.87 2.41 4.87 2.41L4.87 3.87H8.02V4.37H3.38S1 4.08 1 7.47C1 10.86 3.06 10.73 3.06 10.73H4.27V9.2S4.21 7.14 6.3 7.14H9.42S11.38 7.18 11.38 5.27V2.53S11.67 1 7.94 1ZM6.09 2.03C6.42 2.03 6.68 2.29 6.68 2.62S6.42 3.21 6.09 3.21S5.5 2.95 5.5 2.62S5.76 2.03 6.09 2.03Z" fill="#3572A5"/>
              <path d="M8.06 15C11.43 15 11.13 13.59 11.13 13.59V12.13H7.98V11.63H12.62S15 11.92 15 8.53C15 5.14 12.94 5.27 12.94 5.27H11.73V6.8S11.79 8.86 9.7 8.86H6.58S4.62 8.82 4.62 10.73V13.47S4.33 15 8.06 15ZM9.91 13.97C9.58 13.97 9.32 13.71 9.32 13.38C9.32 13.05 9.58 12.79 9.91 12.79C10.24 12.79 10.5 13.05 10.5 13.38C10.5 13.71 10.24 13.97 9.91 13.97Z" fill="#FFD43B"/>
            </svg>
            <span className={styles.tabName}>{file.name}</span>
            {file.readOnly && <span className={styles.readOnlyBadge}>R</span>}
            <button 
              className={styles.closeBtn}
              onClick={(e) => onCloseTab(e, file.path)}
            >
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className={styles.editorWrapper}>
        {activeFile ? (
          <MonacoEditor
            height="100%"
            language={activeFile.name.endsWith('.py') ? 'python' : 'plaintext'}
            theme="vs-dark"
            value={fileContents[activeFile.path] ?? activeFile.content}
            onChange={onChange}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
              fontLigatures: true,
              lineNumbers: 'on',
              wordWrap: 'on',
              readOnly: activeFile.readOnly,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12 },
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
              guides: {
                indentation: true,
                bracketPairs: true,
              },
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>{'{ }'}</span>
            <span>Select a file to start editing</span>
          </div>
        )}
      </div>
    </div>
  );
}
