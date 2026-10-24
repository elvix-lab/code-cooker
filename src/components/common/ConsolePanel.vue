<script setup lang="ts">
import { ref, computed } from 'vue';
import { Terminal, CheckCircle2, XCircle, Clock, Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { useProblemStore } from '@/stores/problemStore';
import CookingLoader from '@/components/common/CookingLoader.vue';

const store = useProblemStore();
const activeTab = ref<'output' | 'tests'>('output');

const result = computed(() => store.executionResult);
const testResults = computed(() => result.value?.testResults);
const hasTests = computed(() => !!testResults.value && testResults.value.total > 0);
</script>

<template>
  <div
    :class="[
      'border-t border-border bg-surface flex flex-col transition-all duration-200 select-none shrink-0 relative',
      store.isConsoleExpanded ? 'h-72' : 'h-36 sm:h-40',
    ]"
  >
    <!-- Cooking Animation Overlay when running -->
    <CookingLoader
      v-if="store.isRunning"
      message="正在热锅爆炒代码中..."
      subMessage="Piston 沙箱与编译器正在全力翻炒关键词并验证测试断言"
    />

    <!-- Console Toolbar -->
    <div class="h-8.5 px-3 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <!-- Tabs -->
        <button
          @click="activeTab = 'output'"
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
            activeTab === 'output'
              ? 'bg-surface text-text-primary shadow-xs font-semibold'
              : 'text-text-muted hover:text-text-primary',
          ]"
        >
          <Terminal class="w-3.5 h-3.5 text-text-muted" />
          <span>执行输出</span>
        </button>

        <button
          v-if="hasTests"
          @click="activeTab = 'tests'"
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
            activeTab === 'tests'
              ? 'bg-surface text-text-primary shadow-xs font-semibold'
              : 'text-text-muted hover:text-text-primary',
          ]"
        >
          <span>测试用例</span>
          <span
            :class="[
              'text-[10px] font-mono px-1.5 py-0.2 rounded font-bold',
              testResults?.passed === testResults?.total
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-rose-500/20 text-rose-500',
            ]"
          >
            {{ testResults?.passed }}/{{ testResults?.total }}
          </span>
        </button>

        <!-- Status Tag -->
        <div v-if="result" class="flex items-center gap-2 ml-2 pl-2 border-l border-border text-xs">
          <span v-if="result.status === 'running'" class="text-amber-500 font-medium animate-pulse">
            翻炒执行中...
          </span>
          <span v-else-if="result.status === 'success'" class="flex items-center gap-1 text-emerald-500 font-medium">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>执行通过</span>
          </span>
          <span v-else-if="result.status === 'error'" class="flex items-center gap-1 text-rose-500 font-medium">
            <XCircle class="w-3.5 h-3.5" />
            <span>执行报错</span>
          </span>
          <span v-if="result.timeMs !== undefined" class="text-text-muted font-mono tabular-nums text-[11px] flex items-center gap-1">
            <Clock class="w-3 h-3" />
            {{ result.timeMs }}ms
          </span>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-1">
        <button
          @click="store.clearConsole"
          class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          title="清空输出"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
        <button
          @click="store.toggleConsole"
          class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          :title="store.isConsoleExpanded ? '缩小控制台' : '放大控制台'"
        >
          <ChevronDown v-if="store.isConsoleExpanded" class="w-4 h-4" />
          <ChevronUp v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Console Output Content -->
    <div class="flex-1 overflow-y-auto p-3 font-mono text-xs select-text">
      <div v-if="!result && !store.isRunning" class="text-text-muted text-xs flex items-center justify-center h-full">
        点击“运行代码”或“提交测试”查看 Piston 编译翻炒结果...
      </div>

      <div v-else-if="activeTab === 'output'" class="space-y-1.5 whitespace-pre-wrap">
        <div v-if="result?.stdout" class="text-text-primary leading-relaxed">
          {{ result.stdout }}
        </div>
        <div
          v-if="result?.stderr"
          class="text-rose-500 dark:text-rose-400 leading-relaxed bg-rose-500/5 p-2 rounded border border-rose-500/20"
        >
          {{ result.stderr }}
        </div>
        <div v-if="result && !result.stdout && !result.stderr" class="text-text-muted">
          （程序执行完成，无 stdout/stderr 输出）
        </div>
      </div>

      <div v-else-if="activeTab === 'tests'" class="space-y-2">
        <div
          v-for="t in testResults?.details"
          :key="t.index"
          :class="[
            'p-2.5 rounded border text-xs',
            t.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5',
          ]"
        >
          <div class="flex items-center justify-between font-semibold mb-1">
            <div class="flex items-center gap-1.5">
              <CheckCircle2 v-if="t.passed" class="w-3.5 h-3.5 text-emerald-500" />
              <XCircle v-else class="w-3.5 h-3.5 text-rose-500" />
              <span>用例 #{{ t.index + 1 }}</span>
            </div>
            <span :class="['text-[10px] uppercase font-mono font-bold', t.passed ? 'text-emerald-500' : 'text-rose-500']">
              {{ t.passed ? '通过' : '失败' }}
            </span>
          </div>
          <div class="text-[11px] space-y-0.5 text-text-muted font-mono">
            <div>输入: {{ t.input }}</div>
            <div>预期: {{ t.expected }}</div>
            <div v-if="!t.passed" class="text-rose-500">实际: {{ t.actual }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
