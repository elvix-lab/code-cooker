<script setup lang="ts">
import { computed } from 'vue';
import type { Difficulty } from '@/types/problem';

const props = withDefaults(
  defineProps<{
    difficulty?: Difficulty;
    variant?: 'difficulty' | 'tag' | 'neutral';
    label?: string;
    active?: boolean;
  }>(),
  {
    variant: 'difficulty',
    active: false,
  }
);

const classes = computed(() => {
  if (props.variant === 'difficulty') {
    switch (props.difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  }

  if (props.variant === 'tag') {
    return props.active
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle border-transparent';
  }

  return 'bg-surface-subtle text-text-muted border-border';
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono font-medium rounded border transition-colors whitespace-nowrap',
      classes,
    ]"
  >
    <slot>{{ label || difficulty }}</slot>
  </span>
</template>
