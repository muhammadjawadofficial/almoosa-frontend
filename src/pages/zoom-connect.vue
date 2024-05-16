<template>
  <div class="connect-container full-height-container d-flex iframe-loading">
    <iframe
      v-if="getRoomUrl"
      @load="iframeIsLoaded"
      :src="getRoomUrl"
      allow="camera; microphone; display-capture;"
      class="full-height-container mt-0 w-100"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      roomId: "",
      userName: "",
    };
  },
  computed: {
    ...mapGetters("appointment", ["getTeleConsultation"]),
    ...mapGetters("user", ["getUserInfo"]),
    getRoomUrl() {
      return (
        process.env.VUE_APP_TELE_BASE_URL +
        "?sessionName=" +
        this.getTeleConsultation.sessionName +
        "&role=" +
        this.getTeleConsultation.role +
        "&signature=" +
        this.getTeleConsultation.signature +
        "&password=" +
        this.getTeleConsultation.password +
        "&name=" +
        this.getFullName(this.getUserInfo)
      );
    },
  },
  methods: {
    iframeIsLoaded() {
      this.setLoadingState(false);
    },
  },
  mounted() {
    if (!this.getTeleConsultation || !this.getTeleConsultation.signature) {
      this.navigateTo("default");
    }

    this.setLoadingState(true);
  },
};
</script>