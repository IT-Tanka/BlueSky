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
  components: { IconLanguage, IconLogo, IconHome, IconFavorite },
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

<style lang="scss" scoped>
.header__container {
  @include flex-center;
  justify-content: space-between;
  padding: $spacing-md calc($spacing-lg + var(--scrollbar-width, 0px)) $spacing-md $spacing-lg;
  gap: $spacing-xxl;

  h1 {
    display: flex;
    color: $accent-color;
    font-size: $font-size-xxl;
  }

  sub {
    display: block;
    transform: rotate(8deg);
  }

  sup {
    display: block;
    transform: rotate(-8deg);
  }

  nav {
    @include flex-center;
    justify-content: flex-start;
    gap: $spacing-lg;
    font-size: $font-size-xl;
    margin-right: 60px;
  }

  .devider {
    color: $white;
    font-size: calc($font-size-xl + $font-size-xl);
  }

  button {
    width: 60px;
    height: 40px;
    @include flex-center;
    gap: 2px;
    text-transform: uppercase;
    font-size: $font-size-sm;
    color: rgba($primary-color, 0.62);
  }

  .logo-link {
    @include flex-center;
    gap: 1px;
  }

  @media (max-width: 425px) {
    gap: $spacing-md;
    padding-right: calc($spacing-md + var(--scrollbar-width, 0px));

    h1 {
      font-size: 20px;
    }

    nav {
      margin-right: $spacing-xxl;
      gap: $spacing-md;
    }

    .devider {
      font-size: $font-size-xxl;
    }
  }
}
</style>