<script setup lang="ts">
import {
  Sun,
  Moon,
  BarChart2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next';
import { LANGUAGES } from '@/constants/languages';
import { useProblemStore } from '@/stores/problemStore';
import { useTheme } from '@/hooks/useTheme';
import type { LanguageId } from '@/types/problem';

const store = useProblemStore();
const { theme, toggleTheme } = useTheme();

const selectLang = (id: LanguageId) => {
  store.setLanguage(id);
  // If sidebar is collapsed, clicking a language opens it
  if (store.isSidebarCollapsed) {
    store.isSidebarCollapsed = false;
  }
};
</script>

<template>
  <aside
    class="w-13 border-r border-border bg-surface-subtle flex flex-col items-center justify-between py-3 select-none shrink-0 z-30"
  >
    <!-- Top Section: Language switcher vertical stack -->
    <div class="flex flex-col items-center gap-2 w-full">
      <div
        v-for="lang in LANGUAGES"
        :key="lang.id"
        class="relative group w-full flex justify-center"
      >
        <button
          @click="selectLang(lang.id)"
          :class="[
            'w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all relative',
            store.currentLanguage === lang.id
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-border',
          ]"
          :title="`${lang.name} (${lang.specialtyName})`"
        >
          <!-- Short language label -->
          <span>{{ lang.shortName }}</span>

          <!-- Left active indicator marker -->
          <span
            v-if="store.currentLanguage === lang.id"
            class="absolute -left-2 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r"
          />
        </button>

        <!-- Tooltip on hover -->
        <div
          class="absolute left-13 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-surface border border-border shadow-lg rounded-md text-xs font-sans text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5"
        >
          <span class="font-bold font-mono">{{ lang.name }}</span>
          <span class="text-text-muted text-[11px]">· {{ lang.specialtyName }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Tools & Toggles -->
    <div class="flex flex-col items-center gap-2.5 w-full pt-2 border-t border-border/60">
      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
        :title="theme === 'dark' ? '切换为浅色模式' : '切换为深色模式'"
        aria-label="Toggle Theme"
      >
        <Sun v-if="theme === 'dark'" class="w-4 h-4 text-amber-400" />
        <Moon v-else class="w-4 h-4 text-slate-700" />
      </button>

      <!-- Stats Progress -->
      <button
        @click="store.isStatsOpen = true"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors relative"
        title="查看解题统计与成长"
      >
        <BarChart2 class="w-4 h-4" />
        <span
          class="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center"
        >
          {{ store.solvedCount }}
        </span>
      </button>

      <!-- Sidebar Toggle Collapse -->
      <button
        @click="store.toggleSidebar"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
        :title="store.isSidebarCollapsed ? '展开题目大纲列表' : '收起题目大纲列表'"
      >
        <PanelLeftOpen v-if="store.isSidebarCollapsed" class="w-4 h-4" />
        <PanelLeftClose v-else class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>
