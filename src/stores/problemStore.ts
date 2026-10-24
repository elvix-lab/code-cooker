import { defineStore } from 'pinia';
import confetti from 'canvas-confetti';
import { ALL_PROBLEMS, getProblemsByLanguage, getProblemById } from '@/data';
import { executeCode, runTests } from '@/utils/runner';
import type { LanguageId, ExecutionResult, Problem } from '@/types/problem';

export const useProblemStore = defineStore('problem', {
  state: () => {
    // Load persisted state from localStorage
    const savedSolved = localStorage.getItem('code_cooker_solved');
    const savedDrafts = localStorage.getItem('code_cooker_drafts');
    const savedLang = localStorage.getItem('code_cooker_lang') as LanguageId | null;
    const savedProb = localStorage.getItem('code_cooker_prob');

    return {
      currentLanguage: (savedLang || 'typescript') as LanguageId,
      currentProblemId: savedProb || 'ts-001',
      solvedProblemIds: savedSolved ? (JSON.parse(savedSolved) as string[]) : ([] as string[]),
      draftCodes: savedDrafts ? (JSON.parse(savedDrafts) as Record<string, string>) : ({} as Record<string, string>),
      isConsoleExpanded: false,
      isSidebarCollapsed: false,
      executionResult: null as ExecutionResult | null,
      isRunning: false,
      isSearchOpen: false,
      isStatsOpen: false,
    };
  },

  getters: {
    currentProblem(): Problem {
      const p = getProblemById(this.currentProblemId);
      if (p) return p;
      const langProbs = getProblemsByLanguage(this.currentLanguage);
      return langProbs[0] || ALL_PROBLEMS[0];
    },

    languageProblems(): Problem[] {
      return getProblemsByLanguage(this.currentLanguage);
    },

    currentCode(): string {
      const draft = this.draftCodes[this.currentProblemId];
      if (draft !== undefined) return draft;
      return this.currentProblem.starterCode;
    },

    totalCount(): number {
      return ALL_PROBLEMS.length;
    },

    solvedCount(): number {
      return this.solvedProblemIds.length;
    },

    isCurrentSolved(): boolean {
      return this.solvedProblemIds.includes(this.currentProblemId);
    },
  },

  actions: {
    persist() {
      localStorage.setItem('code_cooker_solved', JSON.stringify(this.solvedProblemIds));
      localStorage.setItem('code_cooker_drafts', JSON.stringify(this.draftCodes));
      localStorage.setItem('code_cooker_lang', this.currentLanguage);
      localStorage.setItem('code_cooker_prob', this.currentProblemId);
    },

    setLanguage(lang: LanguageId) {
      this.currentLanguage = lang;
      const problems = getProblemsByLanguage(lang);
      if (problems.length > 0) {
        this.currentProblemId = problems[0].id;
      }
      this.executionResult = null;
      this.persist();
    },

    setProblem(problemId: string, lang?: LanguageId) {
      this.currentProblemId = problemId;
      if (lang && lang !== this.currentLanguage) {
        this.currentLanguage = lang;
      }
      this.executionResult = null;
      this.persist();
    },

    updateDraftCode(code: string) {
      this.draftCodes[this.currentProblemId] = code;
      this.persist();
    },

    resetToStarterCode() {
      this.draftCodes[this.currentProblemId] = this.currentProblem.starterCode;
      this.persist();
    },

    setSolutionCodeToEditor() {
      this.draftCodes[this.currentProblemId] = this.currentProblem.solutionCode;
      this.persist();
    },

    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },

    toggleConsole() {
      this.isConsoleExpanded = !this.isConsoleExpanded;
    },

    clearConsole() {
      this.executionResult = null;
    },

    async handleRunCode() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.executionResult = {
        stdout: '',
        stderr: '',
        exitCode: 0,
        status: 'running',
      };

      try {
        const res = await executeCode(this.currentCode, this.currentProblem.language);
        this.executionResult = res;
      } catch (err: any) {
        this.executionResult = {
          stdout: '',
          stderr: err?.message || '执行过程出现异常',
          exitCode: 1,
          status: 'error',
        };
      } finally {
        this.isRunning = false;
      }
    },

    async handleRunTests() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.executionResult = {
        stdout: '',
        stderr: '',
        exitCode: 0,
        status: 'running',
      };

      try {
        const res = await runTests(this.currentProblem, this.currentCode);
        this.executionResult = res;

        if (
          res.testResults &&
          res.testResults.passed === res.testResults.total &&
          res.testResults.total > 0
        ) {
          if (!this.solvedProblemIds.includes(this.currentProblemId)) {
            this.solvedProblemIds.push(this.currentProblemId);
            this.persist();
          }
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b'],
          });
        }
      } catch (err: any) {
        this.executionResult = {
          stdout: '',
          stderr: err?.message || '测试运行异常',
          exitCode: 1,
          status: 'error',
        };
      } finally {
        this.isRunning = false;
      }
    },

    resetAllProgress() {
      this.solvedProblemIds = [];
      this.draftCodes = {};
      this.persist();
    },
  },
});
