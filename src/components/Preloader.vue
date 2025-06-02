<template>
  <div v-if="visible" class="preloader">
    <div class="drop-container">
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
