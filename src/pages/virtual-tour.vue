<template>
  <div class="connect-container full-height-container h-100 d-flex iframe-loading">
    <iframe
      v-if="getRoomUrl"
      @load="iframeIsLoaded"
      :src="getRoomUrl"
      allow="camera;microphone"
      class="full-height-container mt-0 w-100"
      frameborder="0"
    >
    </iframe>
  </div>
</template>
  
  <script>
export default {
  computed: {
    getRoomUrl() {
      return process.env.VUE_APP_VTOUR_BASE_URL;
    },
  },
  methods: {
    iframeIsLoaded() {
      this.setLoadingState(false);
    },
  },
  mounted() {
    this.setLoadingState(true);
  },
};
</script>