import { createRouter, createWebHistory } from 'vue-router';
import Main from '../pages/HomePage.vue';
import Favorites from '../pages/FavoritesPage.vue';

const routes = [
    { path: '/', name: 'Main', component: Main },
    { path: '/favorites', name: 'Favorites', component: Favorites }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
