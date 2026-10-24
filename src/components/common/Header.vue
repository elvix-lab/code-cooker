<script setup lang="ts">
import {
  Search,
  CheckCircle2,
  Github,
  Menu,
} from 'lucide-vue-next';
import { useProblemStore } from '@/stores/problemStore';
import { LANGUAGE_MAP } from '@/constants/languages';
import Logo from '@/components/ui/Logo.vue';

const store = useProblemStore();
</script>

<template>
  <header
    class="h-13 border-b border-border bg-surface flex items-center justify-between px-3 sm:px-5 gap-3 select-none shrink-0 z-20"
  >
    <!-- Left Zone: Logo & Mobile Toggle -->
    <div class="flex items-center gap-2.5 shrink-0">
      <!-- Mobile hamburger toggle for sidebar -->
      <button
        @click="store.toggleSidebar"
        class="md:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-subtle"
        title="打开题目菜单"
      >
        <Menu class="w-4 h-4" />
      </button>

      <!-- Chef Hat + Code Logo -->
      <Logo :size="28" :show-text="true" />

      <!-- Active Language Tag (Desktop / Tablet) -->
      <div class="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border text-xs">
        <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          {{ LANGUAGE_MAP.get(store.currentLanguage)?.name }}
        </span>
        <span class="text-text-muted text-[11px] hidden lg:inline">
          / {{ LANGUAGE_MAP.get(store.currentLanguage)?.specialtyName }}
        </span>
      </div>
    </div>

    <!-- Center Zone: Wide Centered Search Bar -->
    <div class="flex-1 max-w-md lg:max-w-xl mx-auto">
      <button
        @click="store.isSearchOpen = true"
        class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-text-muted hover:text-text-primary bg-surface-subtle hover:bg-surface border border-border hover:border-emerald-500/40 rounded-lg transition-all shadow-2xs group"
        title="全局搜索题目 (Cmd + K)"
      >
        <div class="flex items-center gap-2 truncate">
          <Search class="w-3.5 h-3.5 text-text-muted group-hover:text-emerald-500 transition-colors shrink-0" />
          <span class="truncate">搜索题目、题号、考察点、语言专项...</span>
        </div>
        <kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-text-muted group-hover:border-emerald-500/30">
          ⌘K
        </kbd>
      </button>
    </div>

    <!-- Right Zone: Progress & Links -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- Progress Pill -->
      <button
        @click="store.isStatsOpen = true"
        class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-text-muted hover:text-text-primary bg-surface-subtle hover:bg-surface border border-border rounded-lg transition-colors"
        title="查看解题统计"
      >
        <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
        <span class="tabular-nums">
          {{ store.solvedCount }}/{{ store.totalCount }}
        </span>
      </button>

      <!-- GitHub -->
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        class="p-1.5 text-text-muted hover:text-text-primary bg-surface-subtle hover:bg-surface border border-border rounded-lg transition-colors hidden sm:flex items-center"
        title="GitHub 源码"
      >
        <Github class="w-4 h-4" />
      </a>
    </div>
  </header>
</template>
