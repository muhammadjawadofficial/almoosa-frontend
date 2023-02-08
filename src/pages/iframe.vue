<template>
  <div class="connect-container full-height-container d-flex iframe-loading">
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
  data() {
    return {
      roomId: "almoosa",
    };
  },
  computed: {
    getRoomUrl() {
      console.log(this.$route.params);
      return (
        process.env.VUE_APP_TELE_BASE_URL +
        "room/" +
        this.$route.params.connectId +
        "?name=" +
        this.$route.params.name
      );
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