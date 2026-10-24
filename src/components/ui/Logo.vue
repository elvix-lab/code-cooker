<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
    showText?: boolean;
  }>(),
  {
    size: 28,
    showText: true,
  }
);
</script>

<template>
  <div class="flex items-center gap-2.5 select-none shrink-0 group cursor-pointer">
    <!-- Chef Hat + Code Vector Icon with Light Sheen Effect -->
    <div
      :style="{ width: `${size}px`, height: `${size}px` }"
      class="relative flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 group-hover:border-emerald-500/60 group-hover:bg-emerald-500/15 transition-colors shadow-xs overflow-hidden"
    >
      <!-- Chef Hat Silhouette & Code Brackets -->
      <svg
        :width="size * 0.8"
        :height="size * 0.8"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10"
      >
        <!-- Chef Hat Silhouette from user specification -->
        <path
          fill="currentColor"
          d="M236 112a52.06 52.06 0 0 0-52-52a53 53 0 0 0-7.77.59a52 52 0 0 0-96.46 0A53 53 0 0 0 72 60a52 52 0 0 0-20 100v48a12 12 0 0 0 12 12h128a12 12 0 0 0 12-12v-48a52.07 52.07 0 0 0 32-48m-40 96a4 4 0 0 1-4 4H64a4 4 0 0 1-4-4v-45.41A52 52 0 0 0 72 164h112a52 52 0 0 0 12-1.41Zm-12-52h-18.88l6.76-27a4 4 0 0 0-7.76-1.94l-7.24 29H132V128a4 4 0 0 0-8 0v28H99.12l-7.24-29a4 4 0 1 0-7.76 2l6.76 27H72a44 44 0 0 1 0-88a45 45 0 0 1 5.34.33A51.7 51.7 0 0 0 76 80a4 4 0 0 0 8 0a44 44 0 0 1 88 0a4 4 0 0 0 8 0a51.7 51.7 0 0 0-1.34-11.67A45 45 0 0 1 184 68a44 44 0 0 1 0 88"
        />

        <!-- Code Brackets < / > inside Chef Hat Band -->
        <!-- < bracket -->
        <path
          d="M106 177 L93 188 L106 199"
          fill="none"
          stroke="currentColor"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- / slash -->
        <line
          x1="135"
          y1="174"
          x2="121"
          y2="202"
          stroke="currentColor"
          stroke-width="7"
          stroke-linecap="round"
        />
        <!-- > bracket -->
        <path
          d="M150 177 L163 188 L150 199"
          fill="none"
          stroke="currentColor"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <!-- Light Gleam Sheen (Sweeping across from left to right on hover) -->
      <span
        class="absolute inset-0 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-600 ease-in-out pointer-events-none bg-gradient-to-r from-transparent via-white/50 dark:via-emerald-300/45 to-transparent skew-x-[-22deg] z-20"
      />
    </div>

    <!-- Brand Wordmark without subtext -->
    <div v-if="showText" class="flex items-center">
      <span class="font-mono font-bold text-sm tracking-tight text-text-primary leading-none group-hover:text-emerald-500 transition-colors">
        code<span class="text-emerald-500">-</span>cooker
      </span>
    </div>
  </div>
</template>
