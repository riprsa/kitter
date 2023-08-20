import Home from "@/views/Home.vue"
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        // {
        //     path: '/about',
        //     component: () => import('@/views/About.vue'),
        // },
        {
            path: '/register',
            component: () => import('@/views/Register.vue'),
        },
    ],
})
