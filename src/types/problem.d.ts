export type LanguageId = 'typescript' | 'go' | 'rust' | 'java' | 'cpp' | 'python';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface ProblemMetadata {
  id: string;
  title: string;
  language: LanguageId;
  difficulty: Difficulty;
  tags: string[];
  topic?: string;
  createdAt?: string;
  author?: string;
  isLanguageSpecific?: boolean;
}

export interface Problem extends ProblemMetadata {
  description: string;
  evaluationPoints: string[];
  requirements: string[];
  examples: string[];
  starterCode: string;
  solutionCode: string;
  solutionAnalysis: {
    overview: string;
    breakdowns: { title: string; content: string }[];
    complexity: { time: string; space: string };
  };
  testHarness?: {
    testCases: TestCase[];
    generateRunner: (code: string) => string;
  };
  rawMarkdown: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timeMs?: number;
  status: 'idle' | 'running' | 'success' | 'error' | 'timeout';
  testResults?: {
    total: number;
    passed: number;
    failed: number;
    details: {
      index: number;
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      error?: string;
    }[];
  };
}

export interface LanguageConfig {
  id: LanguageId;
  name: string;
  shortName: string;
  pistonLanguage: string;
  pistonVersion: string;
  fileExtension: string;
  monacoLanguage: string;
  color: string;
  specialtyName: string;
  specialtyDescription: string;
}
