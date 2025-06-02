<template>
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="38" height="40" viewBox="0 0 24 24" id="favorite-icon"
    :class="{ 'is-favorite': isActive }">
    <path d="M19,20.6l-7-2.6l-7,2.6L5,4c0-0.5,0.4-1,1-1h12c0.6,0,1,0.4,1,1V20.6z" :opacity="isActive ? 1 : 0.1"
      fill="#0E0E0E"></path>
    <path d="M4,22L4,4c0-1.1,0.9-2,2-2h12c1.1,0,2,0.9,2,2v18l-8-3L4,22z M12,16.9l6,2.3V4H6l0,15.1L12,16.9z"
      fill="#0E0E0E"></path>
  </svg>
</template>

<script>
export default {
  name: 'IconIsFavorite',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.is-favorite {
  transition: all 0.3s ease-in-out;
}
</style>