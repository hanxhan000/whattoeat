import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../pages/Order.vue'),
    meta: { title: '点餐' }
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('../pages/Plan.vue'),
    meta: { title: '食谱' }
  }
]

// 创建路由实例
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 今天吃什么`
  }
  next()
})

// 路由后置守卫
router.afterEach(() => {
  // 滚动到顶部
  window.scrollTo(0, 0)
})