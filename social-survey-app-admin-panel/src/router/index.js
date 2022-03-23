import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/list-surveys',
      name: 'list-surveys',
      component: () => import('../views/surveys/ListSurveys.vue'),
    },
    {
      path: '/create-survey',
      name: 'create-survey',
      component: () => import('../views/surveys/CreateSurvey.vue'),
    },
    {
      path: '/list-categories',
      name: 'list-categories',
      component: () => import('../views/surveys/ListCategories.vue'),
    },
    {
      path: '/create-category',
      name: 'create-category',
      component: () => import('../views/surveys/CreateCategory.vue'),
    },
    {
      path: '/list-users',
      name: 'list-users',
      component: () => import('../views/users/ListUsers.vue'),
    },
  ],
});

export default router;
