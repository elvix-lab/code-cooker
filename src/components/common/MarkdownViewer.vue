<script setup lang="ts">
import { ref } from 'vue';
import { Lightbulb, CheckSquare, BookOpen, Code, Copy, Check, Clock, Database } from 'lucide-vue-next';
import { useProblemStore } from '@/stores/problemStore';
import { renderMarkdown } from '@/utils/mdParser';
import Badge from '@/components/ui/Badge.vue';

const store = useProblemStore();
const activeTab = ref<'desc' | 'solution'>('desc');
const copied = ref(false);

const handleCopySolution = () => {
  navigator.clipboard.writeText(store.currentProblem.solutionCode);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const handleApplySolution = () => {
  store.setSolutionCodeToEditor();
};
</script>

<template>
  <div class="flex flex-col h-full bg-surface border-r border-border overflow-hidden select-text">
    <!-- Header -->
    <div class="p-4 border-b border-border shrink-0 space-y-2 select-none">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-text-muted">{{ store.currentProblem.id }}</span>
          <h1 class="text-sm sm:text-base font-bold text-text-primary tracking-tight">
            {{ store.currentProblem.title }}
          </h1>
        </div>
        <Badge :difficulty="store.currentProblem.difficulty" />
      </div>

      <!-- Clean Metadata (Anti-AI slop: zero pills) -->
      <div class="flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span class="text-text-primary font-medium">{{ store.currentProblem.topic }}</span>
        <span aria-hidden="true">·</span>
        <span class="uppercase font-mono text-[11px]">{{ store.currentProblem.language }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ store.currentProblem.tags.join(', ') }}</span>
      </div>

      <!-- Tab Switch -->
      <div class="flex items-center gap-1 border-t border-border pt-2 mt-2">
        <button
          @click="activeTab = 'desc'"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5',
            activeTab === 'desc'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle',
          ]"
        >
          <BookOpen class="w-3.5 h-3.5" />
          <span>题目描述</span>
        </button>
        <button
          @click="activeTab = 'solution'"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5',
            activeTab === 'solution'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle',
          ]"
        >
          <Code class="w-3.5 h-3.5" />
          <span>示例答案与题解</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm text-text-primary leading-relaxed">
      <!-- Tab 1: Description -->
      <div v-if="activeTab === 'desc'" class="space-y-4">
        <!-- Markdown Description -->
        <div
          class="text-xs sm:text-sm text-text-primary leading-relaxed space-y-2"
          v-html="renderMarkdown(store.currentProblem.description)"
        />

        <!-- Evaluation Points (Subtle, professional styling) -->
        <div
          v-if="store.currentProblem.evaluationPoints && store.currentProblem.evaluationPoints.length > 0"
          class="p-3.5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 space-y-2"
        >
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Lightbulb class="w-3.5 h-3.5 shrink-0" />
            <span>核心考察点 (Evaluation Points)</span>
          </div>
          <ul class="space-y-1 text-xs text-text-primary/90 list-disc list-inside">
            <li
              v-for="(point, idx) in store.currentProblem.evaluationPoints"
              :key="idx"
              v-html="renderMarkdown(point)"
            />
          </ul>
        </div>

        <!-- Requirements -->
        <div
          v-if="store.currentProblem.requirements && store.currentProblem.requirements.length > 0"
          class="p-3.5 rounded-lg border border-border bg-surface-subtle space-y-2"
        >
          <div class="flex items-center gap-2 text-xs font-semibold text-text-primary">
            <CheckSquare class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>编码要求 (Requirements)</span>
          </div>
          <ol class="space-y-1 text-xs text-text-muted list-decimal list-inside">
            <li
              v-for="(req, idx) in store.currentProblem.requirements"
              :key="idx"
              v-html="renderMarkdown(req)"
            />
          </ol>
        </div>

        <!-- Examples -->
        <div v-if="store.currentProblem.examples && store.currentProblem.examples.length > 0" class="space-y-2">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-text-muted">
            示例说明 (Examples)
          </h3>
          <div
            v-for="(ex, idx) in store.currentProblem.examples"
            :key="idx"
            class="p-3 rounded-md bg-surface-subtle border border-border font-mono text-xs whitespace-pre-wrap"
          >
            {{ ex }}
          </div>
        </div>
      </div>

      <!-- Tab 2: Solution & Analysis -->
      <div v-else class="space-y-4">
        <!-- Actions -->
        <div class="flex items-center justify-between pb-2 border-b border-border select-none">
          <h2 class="text-xs font-semibold text-text-primary">
            示例答案代码 (Solution)
          </h2>
          <div class="flex items-center gap-2">
            <button
              @click="handleApplySolution"
              class="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors border border-emerald-500/30"
            >
              填入编辑器
            </button>
            <button
              @click="handleCopySolution"
              class="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-surface-subtle border border-border hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>
        </div>

        <!-- Code Block -->
        <pre class="p-3.5 rounded-lg bg-surface-subtle border border-border font-mono text-xs text-text-primary overflow-x-auto">
          <code>{{ store.currentProblem.solutionCode }}</code>
        </pre>

        <!-- Complexity Cards -->
        <div class="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-subtle border border-border text-xs">
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div class="text-text-muted">时间复杂度</div>
              <div class="font-mono text-text-primary font-semibold">
                {{ store.currentProblem.solutionAnalysis.complexity.time }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Database class="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div class="text-text-muted">空间复杂度</div>
              <div class="font-mono text-text-primary font-semibold">
                {{ store.currentProblem.solutionAnalysis.complexity.space }}
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Breakdown -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-text-muted">
            🔍 答案深入解析 (Detailed Breakdown)
          </h3>
          <div class="text-xs text-text-primary/90 leading-relaxed p-3 rounded bg-surface-subtle/50 border border-border">
            {{ store.currentProblem.solutionAnalysis.overview }}
          </div>

          <div
            v-for="(item, idx) in store.currentProblem.solutionAnalysis.breakdowns"
            :key="idx"
            class="space-y-1 p-3 rounded-lg border border-border bg-surface"
          >
            <h4 class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {{ item.title }}
            </h4>
            <div class="text-xs text-text-muted leading-relaxed">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
