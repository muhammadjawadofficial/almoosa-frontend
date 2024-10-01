<template>
  <div
    class="doctor-list-container page-body-container standard-width"
    :class="{ 'py-0': isWebView }"
  >
    <back-navigation
      :backLink="'default'"
      :title="$t('onspotConsultation.instructions')"
      v-if="!isWebView"
    />
    <div v-if="isWebView" class="instruction-text">
      {{ $t("onspotConsultation.instructions") }}
    </div>
    <div class="instruction-card-container">
      <p class="cmsText" v-html="localizedText"></p>
      <div class="checkbox-container" v-if="!isWebView">
        <b-form-checkbox
          id="agree-checkbox"
          v-model="agree"
          class="instruction-checkbox pb-4"
        >
          {{ $t("onspotConsultation.iAgree") }}
        </b-form-checkbox>

        <button
          class="btn btn-primary make-appointment"
          @click="openOnSpotModal()"
        >
          {{ $t("continue") }}
        </button>
      </div>
    </div>

    <on-spot-modal @cancel="handleCancel" />
  </div>
</template>

<script>
import onSpotModal from "./on-spot-modal.vue";
import { mapGetters, mapActions } from "vuex";
import { cmsPagesService } from "../../services";
export default {
  data() {
    return {
      agree: false,
      onSpotConsultationCMS: null,
    };
  },
  components: {
    "on-spot-modal": onSpotModal,
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("appointment", ["getOnspotConsultation"]),
    localizedText() {
      if (this.onSpotConsultationCMS) {
        return this.$i18n.locale === "ar"
          ? this.onSpotConsultationCMS.long_text_ar
          : this.onSpotConsultationCMS.long_text;
      }
      return "";
    },
  },
  mounted() {
    this.initializeSocket();
    this.setAppLanguageFromRoute();
    this.getCmsPage("onspot_policy");
    console.log("Language is:", this.$i18n.locale);
  },
  beforeDestroy() {
    this.removeSocketListners();
  },
  watch: {},
  methods: {
    ...mapActions("user", ["updateUserInfo", "setUserInfo"]),
    getCmsPage(type) {
      cmsPagesService.fetchCmsPages("?type=" + type).then(
        (res) => {
          if (res.data.status) {
            this.onSpotConsultationCMS = res.data.data.items[0];
            console.log(this.onSpotConsultationCMS);
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },

    ...mapActions("appointment", ["setSelectedOnspotConsultation"]),
    openOnSpotModal() {
      if (this.agree == false) {
        this.failureToast(this.$t("onspotConsultation.policyAcceptance"));
      } else {
        this.requestConsultation();
        this.$bvModal.show("onSpotCustomModal");
      }
    },
    initializeSocket() {
      // Establish the connection with the WebSocket server
      this.$socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      this.$socket.on("connect", (err) => {
        console.log("WebSocket connected", this.$socket);
      });
      this.$socket.on(
        "admins-availability-updated",
        this.handleAdminsAvailability
      );
      this.$socket.on("error-connecting", this.handleErrorConnecting);
      this.$socket.on("call-connect", this.handleCallConnect);
    },
    withdrawRequest() {
      if (this.$socket) {
        this.$socket.emit("remove-request-consultation");
      }
      this.removeSocketListners();
    },
    removeSocketListners() {
      if (this.$socket) {
        this.$socket.off("connect");
        this.$socket.off("connect_error");
        this.$socket.off("admins-availability-updated");
        this.$socket.off("call-connect");
        this.$socket.off("error-connecting");
      }
    },
    requestConsultation() {
      // Send a consultation request through the WebSocket
      const user_id = this.getUserInfo.id;
      const role_id = this.getUserInfo.role_id;
      if (this.$socket) {
        this.$socket.emit("request-consultation", {
          request_id: this.$socket.id,
          user_id: user_id,
          role_id: role_id,
        });
      }
      console.log({
        request_id: this.$socket.id,
        user_id: user_id,
        role_id: role_id,
      });
    },
    handleCancel() {
      this.withdrawRequest();
    },
    handleAdminsAvailability(data) {
      // Handle the data received from the server (admin availability updates)
      console.log("Admin availability:", data);
    },
    handleErrorConnecting(data) {
      console.log("Error connecting data is", data);
    },
    async handleCallConnect(data) {
      try {
        let response = await data;
        console.log("Call connect data is", response);

        // Similarly, set and log on-spot consultation data
        this.setSelectedOnspotConsultation(response);
        // console.log("On Spot Consultation Data is", this.getOnspotConsultation);
        this.navigateTo("Connect Native Zoom");
      } catch (error) {
        console.error("Error in handleCallConnect:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.instruction-text {
  font-size: 2rem;
  font-weight: 400 !important;
}
::v-deep .instruction-checkbox > .custom-control-label {
  font-size: 1rem !important;
  font-weight: 400 !important;
}
::v-deep .custom-control-label {
  cursor: pointer !important;
}
</style>
