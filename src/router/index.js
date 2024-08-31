import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '../pages/HomePage.vue';
import Favorites from '../pages/FavoritesPage.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'Main', component: Main },
    { path: '/favorites', name: 'Favorites', component: Favorites }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;
