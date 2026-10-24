<script setup lang="ts">
import { computed } from 'vue';
import { Trophy, RefreshCw } from 'lucide-vue-next';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue';
import { ALL_PROBLEMS } from '@/data';
import { LANGUAGES } from '@/constants/languages';
import { useProblemStore } from '@/stores/problemStore';

const store = useProblemStore();

const total = computed(() => ALL_PROBLEMS.length);
const solved = computed(() => store.solvedProblemIds.length);
const percent = computed(() => (total.value > 0 ? Math.round((solved.value / total.value) * 100) : 0));

const diffStats = computed(() => {
  return (['Easy', 'Medium', 'Hard'] as const).map((diff) => {
    const totalDiff = ALL_PROBLEMS.filter((p) => p.difficulty === diff).length;
    const solvedDiff = ALL_PROBLEMS.filter(
      (p) => p.difficulty === diff && store.solvedProblemIds.includes(p.id)
    ).length;
    return {
      difficulty: diff,
      total: totalDiff,
      solved: solvedDiff,
      percent: totalDiff > 0 ? Math.round((solvedDiff / totalDiff) * 100) : 0,
    };
  });
});

const langStats = computed(() => {
  return LANGUAGES.map((lang) => {
    const totalLang = ALL_PROBLEMS.filter((p) => p.language === lang.id).length;
    const solvedLang = ALL_PROBLEMS.filter(
      (p) => p.language === lang.id && store.solvedProblemIds.includes(p.id)
    ).length;
    return {
      lang,
      total: totalLang,
      solved: solvedLang,
      percent: totalLang > 0 ? Math.round((solvedLang / totalLang) * 100) : 0,
    };
  });
});

const handleReset = () => {
  if (window.confirm('确定要清空当前的刷题进度和记录吗？此操作无法撤销。')) {
    store.resetAllProgress();
    store.isStatsOpen = false;
  }
};
</script>

<template>
  <TransitionRoot appear :show="store.isStatsOpen" as="template">
    <Dialog as="div" @close="store.isStatsOpen = false" class="relative z-50">
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
        <div class="flex min-h-full items-center justify-center p-4">
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
              class="w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <!-- Header -->
              <div class="p-4 border-b border-border flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Trophy class="w-5 h-5 text-emerald-500" />
                  <h2 class="text-sm font-bold text-text-primary">解题统计与成长进度</h2>
                </div>
                <button
                  @click="store.isStatsOpen = false"
                  class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle"
                >
                  ✕
                </button>
              </div>

              <!-- Body -->
              <div class="p-5 space-y-6 overflow-y-auto max-h-[70vh]">
                <!-- Summary Card -->
                <div class="p-4 rounded-xl bg-surface-subtle border border-border flex items-center justify-between">
                  <div>
                    <div class="text-xs font-medium text-text-muted mb-1">已解决题目总量</div>
                    <div class="text-2xl font-mono font-bold text-text-primary">
                      {{ solved }} <span class="text-sm text-text-muted font-normal">/ {{ total }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-medium text-text-muted mb-1">完成率</div>
                    <div class="text-2xl font-mono font-bold text-emerald-500">{{ percent }}%</div>
                  </div>
                </div>

                <!-- Difficulty -->
                <div class="space-y-3">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    难度层级分布
                  </h3>
                  <div class="grid grid-cols-3 gap-2.5">
                    <div
                      v-for="item in diffStats"
                      :key="item.difficulty"
                      class="p-3 rounded-lg border border-border bg-surface text-center"
                    >
                      <div class="text-xs font-semibold text-text-primary mb-1">
                        {{ item.difficulty }}
                      </div>
                      <div class="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {{ item.solved }} / {{ item.total }}
                      </div>
                      <div class="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          class="bg-emerald-500 h-full rounded-full transition-all"
                          :style="{ width: `${item.percent}%` }"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Languages -->
                <div class="space-y-3">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    语言模块统计
                  </h3>
                  <div class="space-y-2">
                    <div
                      v-for="item in langStats"
                      :key="item.lang.id"
                      class="p-2.5 rounded-lg border border-border bg-surface flex items-center justify-between"
                    >
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-text-primary w-24">
                          {{ item.lang.name }}
                        </span>
                        <span class="text-[11px] text-text-muted hidden sm:inline">
                          {{ item.lang.specialtyName }}
                        </span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-xs font-mono tabular-nums text-text-primary">
                          {{ item.solved }} / {{ item.total }}
                        </span>
                        <span class="text-xs font-mono text-emerald-500 w-10 text-right">
                          {{ item.percent }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="p-3.5 bg-surface-subtle border-t border-border flex items-center justify-between">
                <button
                  @click="handleReset"
                  class="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 transition-colors"
                >
                  <RefreshCw class="w-3.5 h-3.5" />
                  <span>重置刷题进度</span>
                </button>
                <button
                  @click="store.isStatsOpen = false"
                  class="px-4 py-1.5 text-xs font-medium rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                >
                  确定
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
