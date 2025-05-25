import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: localStorage.getItem('appLanguage') || 'en',
  }),
  actions: {
    setLanguage(lang) {
      this.locale = lang;
      localStorage.setItem('appLanguage', lang);
    },
  },
});