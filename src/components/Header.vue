<template>
  <header class="header">
    <div class="container header__container">
      <nav>
      <router-link class="logo-link nav-link" to="/">
        <IconLogo/>
        <h1>{{ $t("weatherApp") }}</h1>
      </router-link>
      <router-link class="nav-link"  to="/favorites">{{ $t("favorites") }}</router-link>
    </nav>
    <button @click="switchLanguage">
      <IconLanguage />{{ currentLanguage }}
    </button>
    </div>
    
  </header>
</template>

<script>
import IconLanguage from './icons/IconLanguage.vue';
import IconLogo from './icons/IconLogo.vue';

export default {
  components: {
    IconLanguage,
    IconLogo
  },
  data() {
    return {
      currentLanguage: 'en'
    };
  },
  methods: {
    switchLanguage() {
      this.currentLanguage = this.currentLanguage === 'en' ? 'uk' : 'en';
      this.$i18n.locale = this.currentLanguage;
    }
  }
};
</script>

<style scoped>
.header{
  background-color: green;
}

.header__container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 30px;
  nav {
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    align-items: center;
    text-transform: capitalize;
    font-size: 18px;

  }

  button {
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
  
  .logo-link{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
}
</style>