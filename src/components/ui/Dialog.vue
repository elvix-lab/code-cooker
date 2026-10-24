<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { X } from 'lucide-vue-next';

defineProps<{
  open: boolean;
  title?: string;
  maxWidth?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" @close="emit('close')" class="relative z-50">
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
              :class="[
                'w-full transform overflow-hidden rounded-xl bg-surface border border-border shadow-2xl text-left align-middle transition-all',
                maxWidth || 'max-w-xl',
              ]"
            >
              <div
                v-if="title || $slots.header"
                class="flex items-center justify-between px-4 py-3.5 border-b border-border"
              >
                <DialogTitle
                  as="h3"
                  class="text-sm font-semibold text-text-primary"
                >
                  <slot name="header">{{ title }}</slot>
                </DialogTitle>
                <button
                  @click="emit('close')"
                  class="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <div class="p-4 sm:p-5">
                <slot />
              </div>

              <div
                v-if="$slots.footer"
                class="px-4 py-3 bg-surface-subtle border-t border-border flex items-center justify-end gap-2"
              >
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
