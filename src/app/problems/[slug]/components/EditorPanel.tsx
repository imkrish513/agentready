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
            📄 {file.name}
            {file.readOnly && ' 🔒'}
            <button 
              className={styles.closeBtn}
              onClick={(e) => onCloseTab(e, file.path)}
            >
              ×
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
              fontSize: 14,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              lineNumbers: 'on',
              wordWrap: 'on',
              readOnly: activeFile.readOnly,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        ) : (
          <div className={styles.emptyState}>
            Select a file to start editing
          </div>
        )}
      </div>
    </div>
  );
}
