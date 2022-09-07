<template>
  <div class="connect-container full-height-container d-flex iframe-loading">
    <iframe
      @load="iframeIsLoaded"
      :src="`https://devbatch-telemedicine.loca.lt/room/almoosa`"
      allow="camera;microphone"
      class="full-height-container mt-0 w-100"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<script>
export default {
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