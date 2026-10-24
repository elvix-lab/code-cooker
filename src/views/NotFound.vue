<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center bg-main text-text-primary p-6 text-center select-none">
    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-mono font-bold text-lg mb-4">
      404
    </div>
    <h1 class="text-xl font-bold mb-2">未找到对应页面</h1>
    <p class="text-xs text-text-muted mb-6 max-w-sm">
      你所请求的题目或页面不存在，请返回主工作台继续刷题学习。
    </p>
    <Button variant="primary" @click="router.push('/')">
      返回工作台
    </Button>
  </div>
</template>
