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
      roomId: "",
      userName: "",
    };
  },
  computed: {
    getRoomUrl() {
      return (
        process.env.VUE_APP_TELE_BASE_URL +
        "room/" +
        this.roomId +
        "?name=" +
        this.userName +
        "&lng=" +
        this.currentAppLang
      );
    },
  },
  methods: {
    iframeIsLoaded() {
      this.setLoadingState(false);
    },
  },
  mounted() {
    let routeParms = this.$route.params;
    if (routeParms && routeParms.connectId) {
      this.roomId = routeParms.connectId;
    }
    if (routeParms && routeParms.name) {
      this.userName = routeParms.name;
    }

    if (!this.roomId || !this.userName) {
      this.navigateTo("default");
      return;
    }
    this.setLoadingState(true);
  },
};
</script>