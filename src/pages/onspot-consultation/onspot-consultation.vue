<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      :backLink="'default'"
      :title="$t('doctorList.instructions')"
    />

    <div class="instruction-card-container py-5">
      <!-- <p>{{ $t('doctorList.instructions') }}</p> -->
      <p class="instruction-text">
        Please take a moment to thoroughly review the following instructions
        before proceeding. We highly encourage you to understand all the
        guidelines to ensure a smooth and seamless experience. By agreeing to
        these terms, you acknowledge that you are fully informed and prepared
        for the next steps. Keep in mind that this process is designed to
        provide you with a personalized, on-spot consultation call with one of
        our medical professionals. This call will offer expert advice and
        guidance tailored to your specific needs.
        <br /><br />
        It is important to note that by agreeing to the terms and conditions,
        you are confirming your commitment to the consultation process and
        agreeing to follow the protocols set forth. Failure to comply with these
        terms may result in delays or interruptions to your consultation. Should
        you have any questions or need further clarification, please feel free
        to contact our support team before proceeding.
        <br /><br />
        Your participation in this consultation call signifies your
        understanding of and agreement to these conditions. The purpose of this
        agreement is to facilitate a productive and beneficial consultation that
        meets your healthcare needs. Thank you for your cooperation and for
        taking the time to carefully review the terms. Please check the box
        below to confirm your agreement and proceed to schedule your
        consultation.
      </p>

      <b-form-checkbox
        id="agree-checkbox"
        v-model="agree"
        class="instruction-checkbox pb-4"
      >
        {{ $t("doctorList.agree") }}
      </b-form-checkbox>

      <button
        class="btn btn-primary make-appointment"
        :disabled="!agree"
        @click="openOnSpotModal()"
      >
        {{ $t("continue") }}
      </button>
    </div>

    <on-spot-modal @cancel="handleCancel" />
  </div>
</template>

<script>
import onSpotModal from "./on-spot-modal.vue";
import io from "socket.io-client";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      agree: false,
      socket: null,
      socketURL: process.env.VUE_APP_SERVER,
    };
  },
  components: {
    "on-spot-modal": onSpotModal,
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("appointment", ["getOnspotConsultation"]),
  },
  mounted() {
    this.initializeSocket();
  },
  beforeDestroy() {
    this.removeSocketListners();
  },
  watch: {},
  methods: {
    ...mapActions("appointment", ["setSelectedOnspotConsultation"]),
    openOnSpotModal() {
      this.requestConsultation();
      this.$bvModal.show("onSpotCustomModal");
    },
    initializeSocket() {
      // Establish the connection with the WebSocket server
      // this.$socket = io(this.socketURL);
      this.$socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      this.$socket.on("connect", (err) => {
        console.log("WebSocket connected", this.socketURL, this.$socket);
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
  font-size: 1rem;
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
