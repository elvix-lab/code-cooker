<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout.vue';
import { useProblemStore } from '@/stores/problemStore';

const store = useProblemStore();

// Keyboard shortcuts for Cmd+K (Search) and Cmd+Enter (Submit/Test)
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    store.isSearchOpen = !store.isSearchOpen;
  } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    store.handleRunTests();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <WorkspaceLayout />
</template>
