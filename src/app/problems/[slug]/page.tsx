'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

import TopBar from './components/TopBar';
import FileExplorer from './components/FileExplorer';
import EditorPanel from './components/EditorPanel';
import RightPanel from './components/RightPanel';
import ExitModal from './components/ExitModal';

import { Problem, ProblemFile, Phase } from '@/types/problem';
import { TestResult } from '@/types/execution';
import { getProblem } from '@/data/problems';
import { usePyodide } from '@/hooks/usePyodide';

export default function IDEPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  // IDE State
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [openFiles, setOpenFiles] = useState<ProblemFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProblemFile | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  
  // Right Panel State
  const [activeTab, setActiveTab] = useState<'guide' | 'output' | 'ai'>('guide');
  const [phaseAnswers, setPhaseAnswers] = useState<Record<string, string>>({});
  
  // Execution State
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Session State
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [helpMode, setHelpMode] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showHelpConfirmModal, setShowHelpConfirmModal] = useState(false);

  const pyodide = usePyodide();

  // Load Problem
  useEffect(() => {
    const prob = getProblem(slug);
    if (prob) {
      setProblem(prob);
      setTimeRemaining(prob.totalDurationMinutes * 60);
      
      // Open entry point file
      const mainFile = prob.files.find(f => f.entryPoint) || prob.files[0];
      if (mainFile) {
        setOpenFiles([mainFile]);
        setActiveFile(mainFile);
      }
    }
    setLoading(false);
  }, [slug]);

  // Timer
  useEffect(() => {
    if (!problem || showExitModal) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleExitSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [problem, showExitModal]);

  const handleFileSelect = useCallback((file: ProblemFile) => {
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFile(file);
  }, [openFiles]);

  const handleFileChange = useCallback((content: string | undefined) => {
    if (activeFile && content !== undefined) {
      setFileContents(prev => ({ ...prev, [activeFile.path]: content }));
    }
  }, [activeFile]);

  const handleCloseTab = useCallback((e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newOpen = openFiles.filter(f => f.path !== path);
    setOpenFiles(newOpen);
    if (activeFile?.path === path) {
      setActiveFile(newOpen.length > 0 ? newOpen[newOpen.length - 1] : null);
    }
  }, [activeFile, openFiles]);

  const handleNewFile = useCallback((name: string) => {
    if (!problem) return;
    const newFile: ProblemFile = {
      name,
      path: `src/${name}`,
      content: '',
      readOnly: false
    };
    
    // In a real app we'd update problem.files too, but here we just update local state
    // We'll mimic adding it by creating a new reference to problem
    setProblem(prev => prev ? {
      ...prev,
      files: [...prev.files, newFile]
    } : prev);
    
    setOpenFiles(prev => [...prev, newFile]);
    setActiveFile(newFile);
  }, [problem]);

  const handleRun = async () => {
    if (!problem) return;
    
    setIsRunning(true);
    setActiveTab('output');
    
    try {
      // Build file list with current editor contents
      const files = problem.files.map(f => ({
        path: f.path,
        content: fileContents[f.path] ?? f.content
      }));
      
      // Find entry point
      const entryFile = problem.files.find(f => f.entryPoint);
      const entryPoint = entryFile ? entryFile.path : problem.files[0]?.path ?? '';
      
      const result = await pyodide.runCode(files, entryPoint);
      setOutput(result.output || (result.error ? `Error: ${result.error}` : 'No output'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setOutput(`Error: ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleNextPhase = () => {
    if (problem && currentPhaseIdx < problem.phases.length - 1) {
      setCurrentPhaseIdx(prev => prev + 1);
      setActiveTab('guide');
    } else {
      setShowExitModal(true);
    }
  };

  const handleToggleHelp = () => {
    if (!helpMode) {
      setShowHelpConfirmModal(true);
    }
  };

  const confirmHelpMode = () => {
    setHelpMode(true);
    setShowHelpConfirmModal(false);
  };

  const handleExitSession = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading IDE...</div>;
  }

  if (!problem) {
    return (
      <div className={styles.errorState}>
        <h2>Problem Not Found</h2>
        <p>Could not load the requested problem.</p>
        <Link href="/dashboard">Return to Dashboard</Link>
      </div>
    );
  }

  const currentPhase = problem.phases[currentPhaseIdx];

  return (
    <div className={styles.container}>
      <TopBar 
        title={problem.title}
        phase={currentPhase}
        timeRemaining={timeRemaining}
        isRunning={isRunning}
        onRun={handleRun}
        helpMode={helpMode}
        onToggleHelp={handleToggleHelp}
        onExit={() => setShowExitModal(true)}
      />
      
      <div className={styles.workspace}>
        <FileExplorer 
          files={problem.files}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          onNewFile={handleNewFile}
        />
        
        <EditorPanel 
          openFiles={openFiles}
          activeFile={activeFile}
          fileContents={fileContents}
          onTabClick={handleFileSelect}
          onCloseTab={handleCloseTab}
          onChange={handleFileChange}
        />
        
        <RightPanel 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          phase={currentPhase}
          phaseAnswers={phaseAnswers}
          onAnswerChange={(id, ans) => setPhaseAnswers(prev => ({ ...prev, [id]: ans }))}
          onNextPhase={handleNextPhase}
          output={output}
          testResults={testResults}
          isRunning={isRunning}
          onClearOutput={() => { setOutput(''); setTestResults([]); }}
        />
      </div>

      {showExitModal && (
        <ExitModal 
          onCancel={() => setShowExitModal(false)}
          onConfirm={handleExitSession}
        />
      )}

      {showHelpConfirmModal && (
        <ExitModal 
          title="Enable Help Mode?"
          message="Are you sure you want to enable Help Mode? Once enabled, it cannot be turned off. This will affect your final score."
          confirmText="Enable Help"
          onCancel={() => setShowHelpConfirmModal(false)}
          onConfirm={confirmHelpMode}
        />
      )}
    </div>
  );
}
