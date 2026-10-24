<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, CheckCircle2, Circle, X, Filter, PanelLeftClose } from 'lucide-vue-next';
import { useProblemStore } from '@/stores/problemStore';
import { LANGUAGE_MAP } from '@/constants/languages';
import Badge from '@/components/ui/Badge.vue';
import type { Difficulty } from '@/types/problem';

const store = useProblemStore();

const searchQuery = ref('');
const selectedDifficulty = ref<Difficulty | 'All'>('All');
const selectedTag = ref<string | null>(null);
const statusFilter = ref<'All' | 'Solved' | 'Unsolved'>('All');

// Extract tags for current language problem pool
const allTags = computed(() => {
  const set = new Set<string>();
  store.languageProblems.forEach(p => p.tags.forEach(t => set.add(t)));
  return Array.from(set);
});

// Filter problems
const filteredProblems = computed(() => {
  return store.languageProblems.filter(p => {
    // Search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
      const matchTopic = (p.topic || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchTag && !matchTopic) return false;
    }

    // Difficulty
    if (selectedDifficulty.value !== 'All' && p.difficulty !== selectedDifficulty.value) {
      return false;
    }

    // Tag
    if (selectedTag.value && !p.tags.includes(selectedTag.value)) {
      return false;
    }

    // Solved status
    const isSolved = store.solvedProblemIds.includes(p.id);
    if (statusFilter.value === 'Solved' && !isSolved) return false;
    if (statusFilter.value === 'Unsolved' && isSolved) return false;

    return true;
  });
});
</script>

<template>
  <div
    v-show="!store.isSidebarCollapsed"
    class="w-72 lg:w-80 border-r border-border bg-surface flex flex-col h-full select-none shrink-0 transition-all duration-200"
  >
    <!-- Header: Title & Language Info -->
    <div class="p-3 border-b border-border flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-xs tracking-wider uppercase text-text-muted">
          {{ LANGUAGE_MAP.get(store.currentLanguage)?.name }} 题单
        </span>
        <span class="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded font-semibold">
          {{ filteredProblems.length }}/{{ store.languageProblems.length }}
        </span>
      </div>
      <button
        @click="store.toggleSidebar"
        class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
        title="收起题单"
      >
        <PanelLeftClose class="w-4 h-4" />
      </button>
    </div>

    <!-- Filter & Search Controls -->
    <div class="p-3 pb-2 border-b border-border space-y-2 shrink-0">
      <!-- Search Input -->
      <div class="relative">
        <Search class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-muted" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索题号、标题、标签..."
          class="w-full text-xs pl-8 pr-7 py-1.5 rounded-md bg-surface-subtle border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-2 text-text-muted hover:text-text-primary"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Difficulty Tabs -->
      <div class="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-md border border-border">
        <button
          v-for="diff in (['All', 'Easy', 'Medium', 'Hard'] as const)"
          :key="diff"
          @click="selectedDifficulty = diff"
          :class="[
            'flex-1 py-1 text-[11px] font-medium rounded transition-colors',
            selectedDifficulty === diff
              ? 'bg-surface text-text-primary shadow-xs font-semibold'
              : 'text-text-muted hover:text-text-primary',
          ]"
        >
          {{ diff === 'All' ? '全部' : diff }}
        </button>
      </div>

      <!-- Solved Status Tabs -->
      <div class="flex items-center justify-between text-[11px] pt-1">
        <div class="flex items-center gap-1.5 text-text-muted">
          <Filter class="w-3 h-3" />
          <span>状态:</span>
        </div>
        <div class="flex items-center gap-1">
          <button
            v-for="status in (['All', 'Unsolved', 'Solved'] as const)"
            :key="status"
            @click="statusFilter = status"
            :class="[
              'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
              statusFilter === status
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-text-muted hover:text-text-primary',
            ]"
          >
            {{ status === 'All' ? '不限' : status === 'Solved' ? '已完成' : '未完成' }}
          </button>
        </div>
      </div>

      <!-- Tag Filters -->
      <div v-if="allTags.length > 0" class="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        <button
          @click="selectedTag = null"
          :class="[
            'px-2 py-0.5 text-[10px] rounded transition-colors whitespace-nowrap',
            selectedTag === null
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30'
              : 'text-text-muted hover:text-text-primary bg-surface-subtle border border-border',
          ]"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="selectedTag = selectedTag === tag ? null : tag"
          :class="[
            'px-2 py-0.5 text-[10px] rounded transition-colors whitespace-nowrap',
            selectedTag === tag
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30'
              : 'text-text-muted hover:text-text-primary bg-surface-subtle border border-border',
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Problems List -->
    <div class="flex-1 overflow-y-auto divide-y divide-border">
      <div v-if="filteredProblems.length === 0" class="p-6 text-center text-xs text-text-muted">
        未找到符合筛选条件的题目
      </div>
      <div
        v-for="p in filteredProblems"
        :key="p.id"
        @click="store.setProblem(p.id)"
        :class="[
          'p-3 cursor-pointer transition-colors flex items-start gap-2.5',
          p.id === store.currentProblemId
            ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-l-2 border-emerald-500'
            : 'hover:bg-surface-subtle',
        ]"
      >
        <div class="mt-0.5 shrink-0">
          <CheckCircle2
            v-if="store.solvedProblemIds.includes(p.id)"
            class="w-3.5 h-3.5 text-emerald-500"
          />
          <Circle v-else class="w-3.5 h-3.5 text-text-muted/30" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[11px] font-mono text-text-muted">{{ p.id }}</span>
            <Badge :difficulty="p.difficulty" />
          </div>

          <div class="text-xs font-medium text-text-primary truncate">
            {{ p.title }}
          </div>

          <div class="flex items-center gap-1.5 mt-1 text-[11px] text-text-muted truncate">
            <span
              v-if="p.isLanguageSpecific"
              class="text-[10px] px-1 py-0.2 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-medium shrink-0"
            >
              专精
            </span>
            <span class="truncate">{{ p.tags.join(' · ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
