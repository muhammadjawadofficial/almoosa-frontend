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
    <div
      class="appointment-participant-details p-3"
      v-if="
        getSelectedAppointment &&
        this.getTeleConsultation &&
        this.getTeleConsultation.role == 1
      "
    >
      <div class="host" v-if="getUserInfo">
        {{ $t("host") }}
        <div class="name">
          {{ getFullName(getUserInfo) }}
        </div>
      </div>
      <div class="participant mt-3" v-if="getSelectedAppointment.patient">
        {{ $t("participant") }}
        <div class="participant-name">
          <div class="name">
            {{ getFullName(getSelectedAppointment.patient) }}
          </div>
          -
          <div
            class="icon"
            :class="{ clickable: timer <= 0 && !ringing }"
            @click="ringPatient"
          >
            {{
              timer > 0 ? getCounterValue : ringing ? $t("ringing") : $t("ring")
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { appointmentService } from "../services";
export default {
  data() {
    return {
      roomId: "",
      userName: "",
      timer: 0,
      ringing: false,
      timerInterval: null,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getTeleConsultation",
      "getSelectedAppointment",
    ]),
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
    getCounterValue() {
      if (this.timer <= 0) return;

      let minutes = Math.floor(this.timer / 60);
      if (minutes < 10) minutes = `0${minutes}`;

      let seconds = this.timer % 60;
      if (seconds < 10) seconds = `0${seconds}`;

      return `${minutes}:${seconds}`;
    },
  },
  methods: {
    iframeIsLoaded() {
      this.setLoadingState(false);
    },
    async ringPatient() {
      if (this.timer > 0 || this.ringing) return;

      try {
        this.ringing = true;
        let response = await appointmentService.ringPatient({
          session_name: this.getTeleConsultation.sessionName,
        });

        this.timer = 20;

        this.timerInterval = setInterval(() => {
          this.timer--;
          if (this.timer <= 0) {
            clearInterval(this.timerInterval);
          }
        }, 1000);

        this.ringing = false;
      } catch (error) {
        this.ringing = false;
        this.failureToast(
          error.message ||
            (error.response &&
              error.response.data &&
              error.response.data.message)
        );
      }
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

<style lang="scss">
.appointment-participant-details {
  position: absolute;
  z-index: 1;
  color: #fff;
}
.participant-name {
  display: flex;
  gap: 0.5rem;
  .clickable {
    cursor: pointer;
    &:hover {
      color: var(--theme-default);
    }
  }
}
</style>