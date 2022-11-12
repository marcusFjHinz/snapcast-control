import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import main_view from '@/views/main_view.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: main_view,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
