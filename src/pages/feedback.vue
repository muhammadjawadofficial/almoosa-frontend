<template>
  <div class="connect-container full-height-container d-flex iframe-loading">
    <iframe
      v-if="getUrl"
      @load="iframeIsLoaded"
      :src="getUrl"
      class="full-height-container mt-0 w-100"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { systemConfigService } from "../services";
export default {
  data() {
    return {
      feedbackUrl: "",
      token: "",
      query: "token=",
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    getUrl() {
      if (this.feedbackUrl && this.token)
        return `${this.feedbackUrl}?${this.query}${this.token}`;
      return "";
    },
  },
  methods: {
    iframeIsLoaded() {
      this.setLoadingState(false);
    },
    fetchMetadata() {
      Promise.all([
        systemConfigService.fetchConfig("?title=CONFIG_URL"),
        systemConfigService.encryptMrn(this.getUserInfo.mrn_number),
      ]).then(
        (response) => {
          let feedbackResponse = response[0];
          if (feedbackResponse.data.status) {
            let data = feedbackResponse.data.data.items;
            let config = JSON.parse(data[0].value);
            this.feedbackUrl = config.feedback_link;
          } else {
            this.failureToast(response.data.messsage);
          }

          let encryptResponse = response[1];
          if (encryptResponse.data.status) {
            this.token = encryptResponse.data.data;
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
  },
  mounted() {
    this.fetchMetadata();
    this.setLoadingState(true);
  },
};
</script>