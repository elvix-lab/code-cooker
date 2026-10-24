<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Search, X, CheckCircle2, ChevronRight } from 'lucide-vue-next';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue';
import { ALL_PROBLEMS } from '@/data';
import { LANGUAGE_MAP } from '@/constants/languages';
import { useProblemStore } from '@/stores/problemStore';
import Badge from '@/components/ui/Badge.vue';
import type { LanguageId } from '@/types/problem';

const store = useProblemStore();
const searchQuery = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

watch(
  () => store.isSearchOpen,
  (open) => {
    if (open) {
      searchQuery.value = '';
      selectedIndex.value = 0;
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  }
);

const filtered = computed(() => {
  if (!searchQuery.value.trim()) return ALL_PROBLEMS;
  const q = searchQuery.value.toLowerCase();
  return ALL_PROBLEMS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.topic || '').toLowerCase().includes(q) ||
      p.language.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (selectedIndex.value + 1 < filtered.value.length) {
      selectedIndex.value++;
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (selectedIndex.value > 0) {
      selectedIndex.value--;
    }
  } else if (e.key === 'Enter' && filtered.value[selectedIndex.value]) {
    e.preventDefault();
    selectItem(filtered.value[selectedIndex.value].id, filtered.value[selectedIndex.value].language);
  }
};

const selectItem = (id: string, lang: LanguageId) => {
  store.setProblem(id, lang);
  store.isSearchOpen = false;
};
</script>

<template>
  <TransitionRoot appear :show="store.isSearchOpen" as="template">
    <Dialog as="div" @close="store.isSearchOpen = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-150 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/65 backdrop-blur-xs" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center pt-20 px-4">
          <TransitionChild
            as="template"
            enter="duration-150 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              @keydown="handleKeyDown"
              class="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            >
              <!-- Input -->
              <div class="p-3.5 border-b border-border flex items-center gap-3">
                <Search class="w-4 h-4 text-emerald-500 shrink-0" />
                <input
                  ref="searchInput"
                  type="text"
                  v-model="searchQuery"
                  placeholder="搜索全题库 (支持按题号、标题、标签、语言如 ts/go/rust)..."
                  class="flex-1 bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="p-1 rounded text-text-muted hover:text-text-primary"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
                <kbd class="px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface-subtle border border-border rounded">
                  ESC
                </kbd>
              </div>

              <!-- Results -->
              <div class="flex-1 overflow-y-auto divide-y divide-border p-1">
                <div v-if="filtered.length === 0" class="p-8 text-center text-xs text-text-muted">
                  未找到匹配的题目，尝试换个关键词
                </div>
                <div
                  v-for="(item, index) in filtered"
                  :key="item.id"
                  @click="selectItem(item.id, item.language)"
                  @mouseenter="selectedIndex = index"
                  :class="[
                    'p-2.5 sm:p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors',
                    index === selectedIndex
                      ? 'bg-surface-subtle text-text-primary'
                      : 'text-text-muted hover:bg-surface-subtle/50',
                  ]"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <CheckCircle2
                      v-if="store.solvedProblemIds.includes(item.id)"
                      class="w-4 h-4 text-emerald-500 shrink-0"
                    />
                    <div v-else class="w-4 h-4 rounded-full border border-border shrink-0" />

                    <div class="min-w-0">
                      <div class="flex items-center gap-2 mb-0.5">
                        <span class="font-mono text-xs text-text-muted">{{ item.id }}</span>
                        <span class="text-xs font-semibold text-text-primary truncate">
                          {{ item.title }}
                        </span>
                        <Badge :difficulty="item.difficulty" />
                      </div>
                      <div class="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                          {{ LANGUAGE_MAP.get(item.language)?.name }}
                        </span>
                        <span>·</span>
                        <span>{{ item.topic }}</span>
                        <span>·</span>
                        <span class="truncate">{{ item.tags.join(', ') }}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight class="w-4 h-4 text-text-muted shrink-0" />
                </div>
              </div>

              <!-- Footer -->
              <div class="p-2.5 bg-surface-subtle border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                <span>
                  共计找到 <strong class="font-mono text-text-primary">{{ filtered.length }}</strong> 道题目
                </span>
                <div class="flex items-center gap-3">
                  <span>↑ ↓ 导航</span>
                  <span>↵ 快速进入</span>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
