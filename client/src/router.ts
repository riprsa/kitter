import Home from "@/pages/Home.vue"
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/login',
            component: () => import('@/pages/Login.vue'),
        },
        {
            path: '/register',
            component: () => import('@/pages/Register.vue'),
        },
        {
            path: '/profile',
            component: () => import('@/pages/Profile.vue'),
        },
    ],
})
