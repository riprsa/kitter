import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'
import './assets/base.css'
import './assets/new.css'

createApp(App).use(router).mount('#app')
