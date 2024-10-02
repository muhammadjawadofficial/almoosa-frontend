<template>
  <div
    class="onspot-lobby-container page-body-container standard-width"
    :class="{ 'py-0': isWebView }"
  >
    <back-navigation :backLink="'default'" v-if="!isWebView" class="mb-2 heading w600"
    :title="onSpotConsultationCMS[getLocaleKey('page_title')]"
    />

    <div v-if="isWebView" class="heading w600">
      {{ onSpotConsultationCMS[getLocaleKey("page_title")] }}
    </div>
    <div class="sub-heading w200">
      {{ onSpotConsultationCMS[getLocaleKey("long_title")] }}
    </div>
    <div
      class="cmsText"
      v-html="onSpotConsultationCMS[getLocaleKey('long_text')]"
    ></div>

    <div v-if="isWebView" class="instruction-text">
      {{ $t("onspotConsultation.instructions") }}
    </div>
    <div class="instruction-card-container">
      <p class="cmsText" v-html="localizedText"></p>
      <div class="checkbox-container mt-5" v-if="!isWebView">
        <b-form-checkbox
          id="agree-checkbox"
          v-model="agree"
          class="mt-3 custom-checkbox"
        >
          {{ $t("termsAndConditions.iAgree") }}
        </b-form-checkbox>
        <div class="row">
          <div class="col-md-12 button-group mt-5">
            <button
              class="btn btn-primary make-appointment"
              @click="openOnSpotModal()"
            >
              {{ $t("continue") }}
            </button>
          </div>
        </div>
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
.heading {
  text-transform: uppercase;
  font-size: 2.938rem;
  color: var(--theme-default);
  margin-bottom: 1rem;
  font-family: "DiodrumArabicSemiBold";
}
.sub-heading {
  font-size: 1.625rem;
  font-family: "DiodrumArabicSemiBold";
  color: black;
}
@media (max-width: 991px) {
  .login-card {
    padding-top: 1.25rem;
  }
  .heading {
    font-size: 1.5rem;
  }
  .sub-heading {
    font-size: 1rem;
  }
}
@media (max-width: 525px) {
  .heading {
    font-size: 2rem;
  }
  .sub-heading {
    font-size: 1.25rem;
  }
  .button-group {
    button {
      max-width: 100%;
      border-radius: 9px;
    }
  }
}
.button-group {
  margin-top: 3rem;
}
.custom-checkbox {
  :deep {
    input:checked {
      ~ label {
        &::before {
          border-color: var(--theme-default);
          background-color: var(--theme-default);
          border-radius: 3px;
        }
      }
    }
    label {
      font-size: 1rem;
      color: var(--theme-default);
      margin-inline-start: 0.5rem;
      cursor: pointer;
      &::after,
      &::before {
        width: 1.563rem;
        height: 1.563rem;
        top: 0;
        bottom: 0;
        left: -2rem;
        margin: auto;
        border-color: var(--theme-default) !important;
      }
    }
  }
}
</style>
