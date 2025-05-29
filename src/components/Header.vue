<!-- src/components/Header.vue -->
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
  background-color: #008000cc;
  background: linear-gradient(90deg,rgba(0, 128, 0, 1) 0%, rgba(0, 128, 0, 0.9) 50%, rgba(255, 255, 255, 0.2) 100%);
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: calc(100% - var(--scrollbar-width, 16px)); 
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px calc(15px + var(--scrollbar-width, 16px)) 10px 15px;
  gap: 30px;
}

.header__container h1 {
  display: flex;
  color: aqua;
  font-size: 25px;
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
  margin-right: 60px;
}

.header__container .devider {
  color: white;
  font-size: 16px;
}

.header__container button {
  width: 60px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  text-transform: uppercase;
  font-size: 12px;
  border: none;
  color: #0080009e;
}

.header__container .logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1px;
}

@media (max-width: 425px) {
  .header__container {
    gap: 10px;
    padding-right: calc(10px + var(--scrollbar-width, 0px));
  }

  .header__container h1 {
    font-size: 20px;
  }

  .header__container nav {
    margin-right: 30px;
  }
}
</style>