import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  }),
  actions: {
    addFavorite(city) {
      if (this.favorites.length >= 5) {
        return false;  
      }
      if (!this.favorites.includes(city)) {
        this.favorites.unshift(city);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        return true;
      }
      return true;
    },
    removeFavorite(city) {
      this.favorites = this.favorites.filter(favCity => favCity !== city);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    isFavorite(city) {
      return this.favorites.includes(city);
    },
    syncFavorites() {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    },
  },
});