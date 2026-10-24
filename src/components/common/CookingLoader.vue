<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
    subMessage?: string;
    inline?: boolean;
  }>(),
  {
    message: '代码正在锅里热油爆炒中...',
    subMessage: 'Piston 编译器与沙箱环境正在全力翻炒关键词与验证断言',
    inline: false,
  }
);

const codeIngredients = [
  'const',
  'func',
  'async',
  'impl',
  'return',
  '0x2A',
  'struct',
  '{}',
  'mutex',
  'yield',
];
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center select-none text-center',
      inline ? 'py-4' : 'absolute inset-0 bg-surface/90 backdrop-blur-xs z-40 p-6',
    ]"
  >
    <!-- Cooking Animation Stage -->
    <div class="relative w-48 h-36 flex items-center justify-center overflow-visible">
      <!-- Rising Steam Waves -->
      <div class="absolute -top-3 flex gap-3 text-text-muted/30">
        <span class="animate-steam text-xs font-mono select-none" style="animation-delay: 0s">~</span>
        <span class="animate-steam text-xs font-mono select-none" style="animation-delay: 0.4s">~</span>
        <span class="animate-steam text-xs font-mono select-none" style="animation-delay: 0.8s">~</span>
      </div>

      <!-- Stir-fried Code Ingredients (Bouncing Keywords) -->
      <div class="absolute inset-0 pointer-events-none">
        <span
          class="ingredient ingredient-1 font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30"
        >
          {{ codeIngredients[0] }}
        </span>
        <span
          class="ingredient ingredient-2 font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30"
        >
          {{ codeIngredients[1] }}
        </span>
        <span
          class="ingredient ingredient-3 font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30"
        >
          {{ codeIngredients[2] }}
        </span>
        <span
          class="ingredient ingredient-4 font-mono text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30"
        >
          {{ codeIngredients[3] }}
        </span>
        <span
          class="ingredient ingredient-5 font-mono text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30"
        >
          {{ codeIngredients[4] }}
        </span>
      </div>

      <!-- The Wok (炒锅) -->
      <div class="relative w-28 h-14 mt-12 animate-wok">
        <!-- Pan Body -->
        <svg viewBox="0 0 100 45" class="w-full h-full text-text-primary drop-shadow-md">
          <!-- Pan Bottom & Curve -->
          <path
            d="M5 5 C5 35 95 35 95 5 Z"
            fill="currentColor"
            fill-opacity="0.15"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <!-- Hot Pan Oil Glow -->
          <path
            d="M18 20 C25 32 75 32 82 20 Z"
            fill="#10b981"
            fill-opacity="0.3"
            class="animate-pulse"
          />
          <!-- Pan Handle (Left) -->
          <path
            d="M5 10 L-18 6"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
          />
        </svg>

        <!-- Golden Sparkles under Pan -->
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-14 h-2 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent blur-xs animate-pulse" />
      </div>

      <!-- Animated Spatula (炒菜铲子) -->
      <div class="absolute right-6 top-8 w-16 h-16 origin-bottom-left animate-spatula pointer-events-none">
        <svg viewBox="0 0 50 50" class="w-full h-full text-emerald-500">
          <!-- Spatula Handle -->
          <line
            x1="38"
            y1="5"
            x2="18"
            y2="32"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <!-- Spatula Blade (铲头) -->
          <path
            d="M10 30 L22 36 L16 46 L4 40 Z"
            fill="currentColor"
            fill-opacity="0.8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <!-- Slits on Spatula Blade -->
          <line x1="12" y1="36" x2="16" y2="42" stroke="white" stroke-width="1" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Description Text -->
    <div class="space-y-1 mt-3">
      <div class="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
        <span>{{ message }}</span>
      </div>
      <div v-if="subMessage" class="text-[11px] text-text-muted font-sans max-w-xs">
        {{ subMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Wok subtle tilt and sizzle */
@keyframes wokSizzle {
  0%, 100% {
    transform: rotate(0deg) translateY(0);
  }
  25% {
    transform: rotate(-3deg) translateY(-2px);
  }
  75% {
    transform: rotate(3deg) translateY(1px);
  }
}

.animate-wok {
  animation: wokSizzle 1.2s ease-in-out infinite;
}

/* Spatula flipping and stirring */
@keyframes spatulaStir {
  0% {
    transform: rotate(0deg) translate(0, 0);
  }
  30% {
    transform: rotate(-25deg) translate(-8px, -12px);
  }
  60% {
    transform: rotate(15deg) translate(4px, 4px);
  }
  100% {
    transform: rotate(0deg) translate(0, 0);
  }
}

.animate-spatula {
  animation: spatulaStir 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Steam waves rising */
@keyframes steamRise {
  0% {
    opacity: 0;
    transform: translateY(6px) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-8px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(1.3);
  }
}

.animate-steam {
  animation: steamRise 1.4s ease-out infinite;
}

/* Stir-fried ingredients tossing upwards */
.ingredient {
  position: absolute;
  opacity: 0;
}

@keyframes toss1 {
  0% { opacity: 0; transform: translate(45px, 75px) rotate(0deg) scale(0.6); }
  35% { opacity: 1; transform: translate(30px, 15px) rotate(-25deg) scale(1.05); }
  70% { opacity: 1; transform: translate(48px, 65px) rotate(10deg) scale(0.9); }
  100% { opacity: 0; transform: translate(45px, 75px) rotate(0deg) scale(0.6); }
}

@keyframes toss2 {
  0% { opacity: 0; transform: translate(75px, 80px) rotate(0deg) scale(0.6); }
  40% { opacity: 1; transform: translate(90px, 8px) rotate(35deg) scale(1.1); }
  75% { opacity: 1; transform: translate(80px, 65px) rotate(-15deg) scale(0.9); }
  100% { opacity: 0; transform: translate(75px, 80px) rotate(0deg) scale(0.6); }
}

@keyframes toss3 {
  0% { opacity: 0; transform: translate(60px, 85px) rotate(0deg) scale(0.6); }
  30% { opacity: 1; transform: translate(55px, -5px) rotate(-40deg) scale(1.1); }
  65% { opacity: 1; transform: translate(65px, 70px) rotate(20deg) scale(0.9); }
  100% { opacity: 0; transform: translate(60px, 85px) rotate(0deg) scale(0.6); }
}

@keyframes toss4 {
  0% { opacity: 0; transform: translate(35px, 78px) rotate(0deg) scale(0.6); }
  45% { opacity: 1; transform: translate(15px, 25px) rotate(15deg) scale(1); }
  80% { opacity: 1; transform: translate(40px, 68px) rotate(-10deg) scale(0.85); }
  100% { opacity: 0; transform: translate(35px, 78px) rotate(0deg) scale(0.6); }
}

@keyframes toss5 {
  0% { opacity: 0; transform: translate(85px, 75px) rotate(0deg) scale(0.6); }
  38% { opacity: 1; transform: translate(105px, 20px) rotate(-30deg) scale(1); }
  72% { opacity: 1; transform: translate(82px, 68px) rotate(5deg) scale(0.85); }
  100% { opacity: 0; transform: translate(85px, 75px) rotate(0deg) scale(0.6); }
}

.ingredient-1 { animation: toss1 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; animation-delay: 0.1s; }
.ingredient-2 { animation: toss2 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; animation-delay: 0.25s; }
.ingredient-3 { animation: toss3 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; animation-delay: 0.4s; }
.ingredient-4 { animation: toss4 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; animation-delay: 0.55s; }
.ingredient-5 { animation: toss5 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; animation-delay: 0.7s; }
</style>
