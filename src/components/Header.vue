<template>
  <header class="header">
    <div class="container header__container">
      <router-link class="logo-link nav-link" to="/">
        <IconLogo />
        <h1>B<sub>lue</sub>S<sup>ky</sup></h1>
      </router-link>
      <nav>
        <router-link class="logo-link nav-link" to="/">
          <IconHome />
        </router-link>
        <span class="devider">|</span>
        <router-link class="nav-link" to="/favorites">
          <IconFavorite />
        </router-link>
      </nav>
      <button @click="switchLanguage">
        <IconLanguage /> {{ languageStore.locale.toUpperCase() }}
      </button>
    </div>
  </header>
</template>

<script>
import { useLanguageStore } from '../stores/language';
import IconLanguage from './icons/IconLanguage.vue';
import IconLogo from './icons/IconLogo.vue';
import IconHome from './icons/IconHome.vue';
import IconFavorite from './icons/IconFavorite.vue';

export default {
  components: {
    IconLanguage,
    IconLogo,
    IconHome,
    IconFavorite,
  },
  setup() {
    const languageStore = useLanguageStore();
    return { languageStore };
  },
  methods: {
    switchLanguage() {
      const newLang = this.languageStore.locale === 'en' ? 'uk' : 'en';
      this.languageStore.setLanguage(newLang);
      this.$i18n.locale = newLang;
    },
  },
};
</script>

<style scoped>
.header {
  background-color: rgba(0, 128, 0, 0.268);
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 30px;
}

.header__container h1 {
  display: flex;
  color: aqua;
}

.header__container sub {
  display: block;
  transform: rotate(8deg);
}

.header__container sup {
  display: block;
  transform: rotate(-8deg);
}

.header__container nav {
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  align-items: center;
  font-size: 18px;
}

.header__container .devider {
  color: white;
  font-size: 40px;
}

.header__container button {
  width: 60px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  text-transform: uppercase;
  font-size: 12px;
  border: none;
}

.header__container .logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1px;
}
</style>