<template>
  <b-modal
    ref="onSpotConsultationModal"
    id="onSpotCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
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
            class="swal2-image"
            src="../../assets/images/call.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div class="d-flex flex-column align-items-center">
          <h5 class="secondary-text">Starting Video Call....</h5>
          <h5>Pleae wait <span class="primary-text">5:00</span> minutes</h5>
        </div>
        <div class="swal2-actions">
          <!-- <button
              type="button"
              class="swal2-confirm swal2-styled"
              aria-label=""
              style="display: inline-block; background-color: rgb(68, 102, 242)"
              @click="setUpdateRequest"
            >
              {{ $t("ok") }}
            </button> -->
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
  props: {
  },
  data() {
    return {
      selectedDecision: null,
      rejectionReason: "",
      decisionOptions: [
        { value: "pending", text: "Pending", textAr: "قيد الانتظار" },
        { value: "in-progress", text: "In Progress", textAr: "في تَقَدم" },
        { value: "approved", text: "Approved", textAr: "وافقت" },
        { value: "rejected", text: "Rejected", textAr: "مرفوض" },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$refs.onSpotConsultationModal.hide();
      this.selectedDecision = null;
      this.rejectionReason = "";
    },
    setUpdateRequest() {
      if (!this.selectedDecision) {
        this.failureToast(this.$t("detailMedical.selectLanguage"));
        return;
      }

      const payload = {
        status: this.selectedDecision,
      };

      if (this.selectedDecision === "rejected") {
        if (!this.rejectionReason) {
          this.failureToast(this.$t("detailMedical.enterReason"));
          return;
        }
        payload.reason = this.rejectionReason;
      }

      // console.log("Payload is:", payload);
      this.$emit("set-update-request", payload);
      this.closeModal();
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
</style>
