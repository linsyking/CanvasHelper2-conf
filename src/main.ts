import { createApp } from 'vue'
import App from './App.vue'
import Antd from "ant-design-vue"
import './main.css'
import "ant-design-vue/dist/antd.css"
import {createRouter, createWebHashHistory} from 'vue-router'

import Settings from './components/Settings.vue'
import Courses from './components/Courses.vue'
import Config from './components/Config.vue'
import Stats from './components/Stats.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/settings' },
        { path: '/settings', component: Settings, children:[
            {
                path: 'general',
                component: Config
            },
            {
                path: 'courses',
                component: Courses
            },
            {
                path: 'stats',
                component: Stats
            }
        ],
        redirect: '/settings/courses'
    },
    ],
})

createApp(App)
.use(Antd)
.use(router)
.mount('#app')
