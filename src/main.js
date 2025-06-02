import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia';
import App from './App.vue'
import en from './locales/en.json';
import uk from './locales/uk.json';
import './assets/stylesheets/main.scss';
import router from './router';

const i18n = createI18n({
    locale: 'en', 
    fallbackLocale: 'en',
    messages: {
        en,
        uk
    }
})


const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
