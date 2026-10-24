<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Play, RotateCcw, Copy, Check, Zap, ZoomIn, ZoomOut } from 'lucide-vue-next';
import * as monaco from 'monaco-editor';
import { useProblemStore } from '@/stores/problemStore';
import { useTheme } from '@/hooks/useTheme';
import { LANGUAGE_MAP } from '@/constants/languages';

const store = useProblemStore();
const { theme } = useTheme();

const editorContainer = ref<HTMLDivElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

const copied = ref(false);
const fontSize = ref(13);
const useFallbackTextarea = ref(false);

const handleCopy = () => {
  navigator.clipboard.writeText(store.currentCode);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const handleReset = () => {
  if (window.confirm('确定要重置当前代码为初始代码吗？')) {
    store.resetToStarterCode();
    if (editorInstance) {
      editorInstance.setValue(store.currentCode);
    }
  }
};

const handleZoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 1, 20);
  editorInstance?.updateOptions({ fontSize: fontSize.value });
};

const handleZoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 1, 11);
  editorInstance?.updateOptions({ fontSize: fontSize.value });
};

const getMonacoLang = () => {
  const cfg = LANGUAGE_MAP.get(store.currentProblem.language);
  return cfg?.monacoLanguage || 'typescript';
};

const initMonaco = () => {
  if (!editorContainer.value) return;

  try {
    editorInstance = monaco.editor.create(editorContainer.value, {
      value: store.currentCode,
      language: getMonacoLang(),
      theme: theme.value === 'dark' ? 'vs-dark' : 'vs',
      fontSize: fontSize.value,
      fontFamily: "'JetBrains Mono', Consolas, Menlo, Monaco, monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      automaticLayout: true,
      lineNumbers: 'on',
      padding: { top: 8, bottom: 8 },
    });

    editorInstance.onDidChangeModelContent(() => {
      if (editorInstance) {
        const val = editorInstance.getValue();
        store.updateDraftCode(val);
      }
    });
  } catch (err) {
    console.warn('Monaco failed to initialize, using fallback textarea:', err);
    useFallbackTextarea.value = true;
  }
};

onMounted(() => {
  initMonaco();
});

onBeforeUnmount(() => {
  editorInstance?.dispose();
});

// Watch problem change
watch(
  () => store.currentProblemId,
  () => {
    if (editorInstance) {
      const model = editorInstance.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, getMonacoLang());
      }
      if (editorInstance.getValue() !== store.currentCode) {
        editorInstance.setValue(store.currentCode);
      }
    }
  }
);

// Watch theme change
watch(
  () => theme.value,
  (newTheme) => {
    if (editorInstance) {
      monaco.editor.setTheme(newTheme === 'dark' ? 'vs-dark' : 'vs');
    }
  }
);

// Watch code change from external (e.g. apply solution)
watch(
  () => store.currentCode,
  (newCode) => {
    if (editorInstance && editorInstance.getValue() !== newCode) {
      editorInstance.setValue(newCode);
    }
  }
);
</script>

<template>
  <div class="flex flex-col h-full bg-surface border-border overflow-hidden select-none">
    <!-- Top Toolbar -->
    <div class="h-10 px-3 border-b border-border bg-surface flex items-center justify-between shrink-0">
      <!-- File metadata -->
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {{ LANGUAGE_MAP.get(store.currentProblem.language)?.name }}
        </span>
        <span class="text-xs font-mono text-text-muted hidden sm:inline">
          solution.{{ LANGUAGE_MAP.get(store.currentProblem.language)?.fileExtension }}
        </span>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <!-- Font zoom -->
        <div class="hidden sm:flex items-center gap-1 border-r border-border pr-2 mr-1">
          <button
            @click="handleZoomOut"
            class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle"
            title="缩小字号"
          >
            <ZoomOut class="w-3.5 h-3.5" />
          </button>
          <span class="text-[10px] font-mono text-text-muted">{{ fontSize }}px</span>
          <button
            @click="handleZoomIn"
            class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle"
            title="放大字号"
          >
            <ZoomIn class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Copy -->
        <button
          @click="handleCopy"
          class="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
          title="复制代码"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-500" />
          <Copy v-else class="w-3.5 h-3.5" />
        </button>

        <!-- Reset -->
        <button
          @click="handleReset"
          class="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
          title="重置为初始代码"
        >
          <RotateCcw class="w-3.5 h-3.5" />
        </button>

        <!-- Run Code (Direct) -->
        <button
          @click="store.handleRunCode"
          :disabled="store.isRunning"
          class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-surface-subtle hover:bg-surface text-text-primary border border-border transition-colors disabled:opacity-50"
          title="直接运行当前代码 (Piston API)"
        >
          <Play class="w-3 h-3 text-text-muted fill-current" />
          <span class="hidden sm:inline">运行代码</span>
        </button>

        <!-- Submit & Run Tests -->
        <button
          @click="store.handleRunTests"
          :disabled="store.isRunning"
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-xs disabled:opacity-50"
          title="运行测试用例并提交验证"
        >
          <Zap class="w-3 h-3 fill-current" />
          <span>{{ store.isRunning ? '执行中...' : '提交测试' }}</span>
        </button>
      </div>
    </div>

    <!-- Editor Surface -->
    <div class="flex-1 relative overflow-hidden bg-surface">
      <div
        v-show="!useFallbackTextarea"
        ref="editorContainer"
        class="w-full h-full"
      />
      <textarea
        v-if="useFallbackTextarea"
        :value="store.currentCode"
        @input="(e) => store.updateDraftCode((e.target as HTMLTextAreaElement).value)"
        class="w-full h-full p-4 font-mono text-xs bg-surface text-text-primary resize-none outline-none"
        spellcheck="false"
      />
    </div>
  </div>
</template>
