<template>
  <div
    class="connect-container full-height-container d-flex iframe-loading"
  ></div>
</template>
  
  <script>
export default {
  beforeMount() {
    this.setLoadingState(true);
  },
  mounted() {
    this.doPayment();
  },
};
</script>