import { createRouter, createWebHistory } from 'vue-router';
import Workspace from '@/views/Workspace.vue';
import NotFound from '@/views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Workspace',
      component: Workspace,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});

export default router;
