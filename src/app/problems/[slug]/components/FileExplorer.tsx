import React, { useState, useMemo } from 'react';
import styles from './FileExplorer.module.css';
import { ProblemFile } from '@/types/problem';

interface FileExplorerProps {
  files: ProblemFile[];
  activeFile: ProblemFile | null;
  onFileSelect: (file: ProblemFile) => void;
  onNewFile?: (name: string) => void;
}

function PythonIcon() {
  return (
    <svg className={styles.fileIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.94 1C4.57 1 4.87 2.41 4.87 2.41L4.87 3.87H8.02V4.37H3.38S1 4.08 1 7.47C1 10.86 3.06 10.73 3.06 10.73H4.27V9.2S4.21 7.14 6.3 7.14H9.42S11.38 7.18 11.38 5.27V2.53S11.67 1 7.94 1ZM6.09 2.03C6.42 2.03 6.68 2.29 6.68 2.62S6.42 3.21 6.09 3.21S5.5 2.95 5.5 2.62S5.76 2.03 6.09 2.03Z" fill="#3572A5"/>
      <path d="M8.06 15C11.43 15 11.13 13.59 11.13 13.59V12.13H7.98V11.63H12.62S15 11.92 15 8.53C15 5.14 12.94 5.27 12.94 5.27H11.73V6.8S11.79 8.86 9.7 8.86H6.58S4.62 8.82 4.62 10.73V13.47S4.33 15 8.06 15ZM9.91 13.97C9.58 13.97 9.32 13.71 9.32 13.38C9.32 13.05 9.58 12.79 9.91 12.79C10.24 12.79 10.5 13.05 10.5 13.38C10.5 13.71 10.24 13.97 9.91 13.97Z" fill="#FFD43B"/>
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg 
      className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`} 
      viewBox="0 0 16 16" 
      fill="currentColor"
    >
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg className={styles.folderIcon} viewBox="0 0 16 16" fill="currentColor">
      {open ? (
        <path d="M1.5 14h13l1-7H6.5L5 5H1.5v9z" fill="#dcb67a" opacity="0.9"/>
      ) : (
        <path d="M1.5 13V3h3.75l1.25 1.5H14.5V13h-13z" fill="#dcb67a" opacity="0.9"/>
      )}
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className={styles.lockIcon} viewBox="0 0 16 16" fill="currentColor">
      <path d="M11 5V4a3 3 0 0 0-6 0v1H4v7h8V5h-1zM6 4a2 2 0 1 1 4 0v1H6V4z" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

export default function FileExplorer({ files, activeFile, onFileSelect, onNewFile }: FileExplorerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'tests': true,
    'root': true
  });

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleNewFileSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newFileName.trim()) {
      onNewFile?.(newFileName.trim());
      setIsCreating(false);
      setNewFileName('');
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFileName('');
    }
  };

  const groupedFiles = useMemo(() => {
    const groups: Record<string, ProblemFile[]> = {
      'src': [],
      'tests': [],
      'root': []
    };

    files.forEach(file => {
      if (file.path.startsWith('src/')) {
        groups['src'].push(file);
      } else if (file.path.startsWith('tests/')) {
        groups['tests'].push(file);
      } else {
        groups['root'].push(file);
      }
    });

    return groups;
  }, [files]);

  const renderFile = (file: ProblemFile) => (
    <div
      key={file.path}
      className={`${styles.fileItem} ${activeFile?.path === file.path ? styles.active : ''}`}
      onClick={() => onFileSelect(file)}
    >
      <PythonIcon />
      <span className={styles.fileName}>{file.name}</span>
      {file.readOnly && <LockIcon />}
    </div>
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span>EXPLORER</span>
        <button className={styles.addBtn} onClick={() => setIsCreating(true)} title="New File">
          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.fileList}>
        {isCreating && (
          <input
            autoFocus
            className={styles.newFileInput}
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleNewFileSubmit}
            onBlur={() => setIsCreating(false)}
            placeholder="filename.py"
          />
        )}

        {Object.entries(groupedFiles).map(([folder, folderFiles]) => {
          if (folderFiles.length === 0 && folder !== 'root') return null;
          
          if (folder === 'root') {
            return folderFiles.map(renderFile);
          }

          return (
            <div key={folder} className={styles.folder}>
              <div 
                className={styles.folderName}
                onClick={() => toggleFolder(folder)}
              >
                <ChevronIcon expanded={!!expandedFolders[folder]} />
                <FolderIcon open={!!expandedFolders[folder]} />
                <span>{folder}</span>
              </div>
              {expandedFolders[folder] && (
                <div className={styles.folderChildren}>
                  {folderFiles.map(renderFile)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.bugBtn}>Report a Bug</button>
      </div>
    </div>
  );
}
