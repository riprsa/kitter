import Home from "@/views/Home.vue"
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: Home,
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue'),
        },
        {
            path: '/register',
            component: () => import('@/views/Register.vue'),
        },
    ],
})
