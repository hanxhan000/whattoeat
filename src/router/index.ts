import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../pages/Home.vue') },
  { path: '/login', name: 'login', component: () => import('../pages/Login.vue') },
  { path: '/order', name: 'order', component: () => import('../pages/Order.vue') },
  { path: '/plan', name: 'plan', component: () => import('../pages/Plan.vue') },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});