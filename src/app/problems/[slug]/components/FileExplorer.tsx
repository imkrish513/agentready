import React, { useState, useMemo } from 'react';
import styles from './FileExplorer.module.css';
import { ProblemFile } from '@/types/problem';

interface FileExplorerProps {
  files: ProblemFile[];
  activeFile: ProblemFile | null;
  onFileSelect: (file: ProblemFile) => void;
  onNewFile?: (name: string) => void;
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

  // Group files by top-level directory
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
      <span className={styles.icon}>📄</span>
      <span>{file.name}</span>
      {file.readOnly && <span className={styles.lockIcon}>🔒</span>}
    </div>
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span>Explorer</span>
        <button className={styles.addBtn} onClick={() => setIsCreating(true)}>+</button>
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
                <span>{expandedFolders[folder] ? '▾' : '▸'}</span>
                <span>{folder}</span>
              </div>
              {expandedFolders[folder] && (
                <div>
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
