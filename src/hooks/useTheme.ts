import { ref, watchEffect } from 'vue';

export type Theme = 'dark' | 'light';

const savedTheme = (localStorage.getItem('code_cooker_theme') as Theme) || 'dark';
const currentTheme = ref<Theme>(savedTheme);

watchEffect(() => {
  const root = document.documentElement;
  if (currentTheme.value === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('code_cooker_theme', currentTheme.value);
});

export function useTheme() {
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
  };

  return {
    theme: currentTheme,
    toggleTheme,
  };
}
