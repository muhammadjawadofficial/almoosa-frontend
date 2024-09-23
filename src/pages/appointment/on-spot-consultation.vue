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

    <on-spot-modal @close="hideOnSpotModal" />
  </div>
</template>

<script>
import onSpotModal from "./on-spot-modal.vue";
import io from "socket.io-client";
import { mapGetters } from "vuex";

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
  },
  mounted() {
    this.initializeSocket();
  },
  beforeDestroy() {
    this.destroySocket();
  },
  watch: {},
  methods: {
    openOnSpotModal() {
      this.requestConsultation();
      this.$bvModal.show("onSpotCustomModal");
    },
    hideOnSpotModal() {
      this.$bvModal.hide("onSpotCustomModal");
    },
    initializeSocket() {
      // Establish the connection with the WebSocket server
      this.socket = io(this.socketURL);
      this.socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      this.socket.on("connect", (err) => {
        console.log("WebSocket connected", this.socketURL);
      });
      this.socket.on("adminsAvailability", this.handleAdminsAvailability);
      this.socket.on("initial-admins", this.handleAdminsAvailability);
      this.socket.on("call-connect", this.handleCallConnect);
    },
    destroySocket() {
      if (this.socket) {
        // Disconnect the socket and clean up event listeners
        this.socket.disconnect();
        console.log("WebSocket disconnected");
      }
    },
    requestConsultation() {
      // Send a consultation request through the WebSocket
      if (this.socket) {
        this.socket.emit("requestConsultation", {
          request_id: this.socket.id,
          user_id: this.getUserInfo.id,
          role_id: this.getUserInfo.role_id,
        });
      }
    },
    handleAdminsAvailability(data) {
      // Handle the data received from the server (admin availability updates)
      console.log("Admin availability:", data);
    },
    handleCallConnect(data) {
      console.log(data);
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
</style>
