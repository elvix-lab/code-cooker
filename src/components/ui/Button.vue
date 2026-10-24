<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'icon';
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'secondary',
    size: 'sm',
    disabled: false,
    loading: false,
    type: 'button',
  }
);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs';
    case 'secondary':
      return 'bg-surface-subtle hover:bg-surface text-text-primary border border-border';
    case 'ghost':
      return 'text-text-muted hover:text-text-primary hover:bg-surface-subtle';
    case 'danger':
      return 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20';
    default:
      return '';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2.5 py-1 text-xs rounded-md gap-1.5';
    case 'md':
      return 'px-3.5 py-1.5 text-sm rounded-md gap-2';
    case 'icon':
      return 'p-1.5 rounded-md';
    default:
      return 'px-2.5 py-1 text-xs rounded-md';
  }
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
      variantClasses,
      sizeClasses,
    ]"
  >
    <slot />
  </button>
</template>
