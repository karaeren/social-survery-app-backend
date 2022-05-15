import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'results',
      component: () => import('../views/ResultsView.vue'),
    },
  ],
});

export default router;
