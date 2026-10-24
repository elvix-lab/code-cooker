<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { BookOpen, Code2, X } from 'lucide-vue-next';
import Header from '@/components/common/Header.vue';
import ActivityBar from '@/components/common/ActivityBar.vue';
import ProblemList from '@/components/common/ProblemList.vue';
import MarkdownViewer from '@/components/common/MarkdownViewer.vue';
import CodeEditor from '@/components/common/CodeEditor.vue';
import ConsolePanel from '@/components/common/ConsolePanel.vue';
import SearchModal from '@/components/common/SearchModal.vue';
import StatsModal from '@/components/common/StatsModal.vue';
import { useProblemStore } from '@/stores/problemStore';

const store = useProblemStore();

// Screen size detection
const windowWidth = ref(window.innerWidth);
const isMobile = ref(window.innerWidth < 768);
const isTablet = ref(window.innerWidth >= 768 && window.innerWidth < 1024);

// Mobile active workspace tab
const mobileTab = ref<'desc' | 'editor'>('desc');

// Draggable split ratio (default 45% for Markdown, remainder for Editor)
const splitPercent = ref(45);
const isDragging = ref(false);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  isMobile.value = window.innerWidth < 768;
  isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024;
};

const handleMouseDown = () => {
  if (isMobile.value) return;
  isDragging.value = true;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || isMobile.value) return;
  // Calculate offset based on activity bar (52px) and sidebar width if open
  const activityBarWidth = 52;
  const sidebarWidth = store.isSidebarCollapsed ? 0 : (isTablet.value ? 240 : 280);
  const containerWidth = window.innerWidth - activityBarWidth - sidebarWidth;
  const mouseOffset = e.clientX - activityBarWidth - sidebarWidth;
  const newPercent = Math.max(20, Math.min(80, (mouseOffset / containerWidth) * 100));
  splitPercent.value = newPercent;
};

const handleMouseUp = () => {
  isDragging.value = false;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-main text-text-primary select-none">
    <!-- Top Header (Wide centered search, logo with chef hat, stats) -->
    <Header />

    <!-- Main Workspace Container -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- 1. Leftmost Activity Bar (Vertical Language Switcher & Controls) -->
      <ActivityBar class="hidden md:flex" />

      <!-- Mobile Drawer for Activity Bar + Problem List -->
      <div
        v-if="isMobile && !store.isSidebarCollapsed"
        class="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs md:hidden"
      >
        <div class="w-80 h-full bg-surface border-r border-border flex">
          <ActivityBar />
          <ProblemList class="flex-1" />
        </div>
        <div class="flex-1" @click="store.isSidebarCollapsed = true">
          <button
            class="m-4 p-2 bg-surface rounded-full border border-border text-text-muted hover:text-text-primary"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 2. Problem Outline / List Panel (Desktop & Tablet collapsible) -->
      <ProblemList class="hidden md:flex" />

      <!-- 3. Central Working Area -->
      <div class="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <!-- Mobile Segmented Viewport Switcher -->
        <div
          v-if="isMobile"
          class="h-9 px-3 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0"
        >
          <div class="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border">
            <button
              @click="mobileTab = 'desc'"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1',
                mobileTab === 'desc'
                  ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                  : 'text-text-muted',
              ]"
            >
              <BookOpen class="w-3.5 h-3.5" />
              <span>题目描述</span>
            </button>
            <button
              @click="mobileTab = 'editor'"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1',
                mobileTab === 'editor'
                  ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                  : 'text-text-muted',
              ]"
            >
              <Code2 class="w-3.5 h-3.5" />
              <span>代码与运行</span>
            </button>
          </div>
          <span class="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
            {{ store.currentProblem.id }}
          </span>
        </div>

        <!-- Desktop & Tablet: Split Layout / Mobile: Tabbed View -->
        <div class="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
          <!-- Left Split: Markdown Viewer -->
          <div
            v-show="!isMobile || mobileTab === 'desc'"
            :style="{
              width: isMobile ? '100%' : `${splitPercent}%`,
            }"
            class="h-full overflow-hidden shrink-0 border-r border-border"
          >
            <MarkdownViewer />
          </div>

          <!-- Draggable Divider (Desktop / Tablet only) -->
          <div
            v-if="!isMobile"
            @mousedown="handleMouseDown"
            :class="[
              'w-1 hover:w-1.5 bg-border hover:bg-emerald-500 cursor-col-resize transition-colors items-center justify-center shrink-0 z-10 select-none',
              isDragging ? 'bg-emerald-500 w-1.5' : '',
            ]"
          />

          <!-- Right Split: Code Editor & Console Output -->
          <div
            v-show="!isMobile || mobileTab === 'editor'"
            class="flex-1 flex flex-col h-full overflow-hidden min-w-0"
          >
            <div class="flex-1 overflow-hidden">
              <CodeEditor />
            </div>
            <ConsolePanel />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SearchModal />
    <StatsModal />
  </div>
</template>
