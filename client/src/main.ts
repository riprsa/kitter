import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'
import './assets/base.css'
import './assets/new.css'

import VueCookies from 'vue-cookies'

const app = createApp(App);

app.use(router)
    .use(VueCookies)
    .mount('#app')
