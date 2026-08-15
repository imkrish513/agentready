export interface ProblemFile {
  name: string;
  path: string;
  content: string;
  readOnly: boolean;
  entryPoint?: boolean;
}

export interface PhaseQuestion {
  id: string;
  type: 'mcq' | 'free-form';
  question: string;
  options?: string[];
  correctAnswer?: string;
  rubricHint?: string;
}

export interface Phase {
  id: number;
  name: string;
  durationMinutes: number;
  aiAccessEnabled: boolean;
  guideContent: string;
  tasks: string[];
  questions?: PhaseQuestion[];
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface Problem {
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  totalDurationMinutes: number;
  phases: Phase[];
  files: ProblemFile[];
  testCases: TestCase[];
  aiBugInstructions: string;
}
