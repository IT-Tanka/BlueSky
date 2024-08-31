import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import en from './locales/en.json';
import uk from './locales/uk.json';
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import FavoritesPage from './pages/FavoritesPage.vue'
import './assets/main.css';


const i18n = createI18n({
    locale: 'en', 
    fallbackLocale: 'en',
    messages: {
        en,
        uk
    }
})


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/favorites', component: FavoritesPage }
    ]
})

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
