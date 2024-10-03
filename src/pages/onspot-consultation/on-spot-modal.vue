<template>
  <b-modal
    ref="onSpotConsultationModal"
    id="onSpotCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
    @show="startTimer"
    @hide="resetTimer"
  >
    <div
      class="swal2-container swal2-center swal-custom-icon-top-padding swal2-shown custom-swal2"
      style="overflow-y: auto"
    >
      <div
        aria-labelledby="swal2-title"
        aria-describedby="swal2-content"
        class="swal2-popup swal2-modal swal2-show"
        tabindex="-1"
        role="dialog"
        aria-live="assertive"
        aria-modal="true"
        style="display: flex"
      >
        <div class="swal2-header">
          <img
            class="swal2-image call-icon"
            src="../../assets/images/call-icon.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div class="d-flex flex-column align-items-center">
          <h5 class="secondary-text">{{ $t("onspotConsultation.startCall") }}</h5>
          <h5>{{ $t("onspotConsultation.pleaseWait") }} <span class="primary-text">{{ formattedTime }}</span> {{ $t("onspotConsultation.minutes") }}</h5>
        </div>
        <div class="swal2-actions">
          <button
            type="button"
            class="swal2-cancel swal2-styled"
            aria-label=""
            @click="closeModal"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      timeLeft: 300, // 5 minutes in seconds
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
  },
  beforeDestroy(){
  },
  methods: {
    closeModal() {
      this.resetTimer();
      this.$emit("cancel");
      this.$refs.onSpotConsultationModal.hide();
        this.navigateTo("default");
    },
    startTimer() {
      // Ensure timer is reset when modal is shown
      this.resetTimer();
      this.timeLeft = 300; // Reset to 5 minutes

      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeLeft = 300; // Reset to 5 minutes when it reaches 0
        }
      }, 1000);
    },
    resetTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.heading {
  font-size: 1.5rem;
  color: var(--theme-secondary);
}
.sub-heading {
  font-size: 0.835rem;
  color: var(--gray);
}
.swal2-image {
  padding: 0.5rem;
}
.secondary-text {
  color: var(--theme-secondary);
}
.primary-text {
  color: var(--theme-default);
}
.call-icon {
  padding: 2.5rem !important;
}
</style>
