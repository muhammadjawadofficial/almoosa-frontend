<template>
  <b-modal
    ref="selectAppointmentType"
    id="selectAppointmentTypeCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
    @hidden="onHidden"
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
            class="swal2-image p-0"
            src="../../assets/images/m-info.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div>
          <div class="heading">
            {{ $t("doctorList.selectToContinue") }}
          </div>
          <div class="sub-heading">
            {{ $t("doctorList.selectOneOption") }}
          </div>
          <!-- <hr /> -->
          <div class="consultation-section standard-width pb-0">
            <div class="consultation-section--blocks justify-content-center">
              <div
                v-for="(item, index) in appointmentTypes"
                class="consultation-section--blocks--single"
                :class="{ selected: item.type == selectedType }"
                :key="'dashboard-item-' + index"
                @click="handleSelection(item)"
              >
                <div v-if="item.unique" class="new-badge">
                  <new-badge-svg />
                </div>
                <div
                  class="title secondary-title"
                  v-html="$t('modules.' + item.text)"
                ></div>
                <div class="icon">
                  <component :is="item.icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showOnlineConfirm">
          <div class="subheading text-center mt-5">
            {{ $t("virtualConsultationNote") }}
          </div>
        </div>
        <div class="swal2-actions" v-if="showOnlineConfirm">
          <button
            type="button"
            class="swal2-confirm swal2-styled"
            aria-label=""
            style="
              display: inline-block;
              background-color: rgb(68, 102, 242);
              border-left-color: rgb(85, 176, 71);
              border-right-color: rgb(85, 176, 71);
            "
            @click="setSelectAppointmentTypeModal"
          >
            {{ $t("yes") }}
          </button>
          <button
            type="button"
            class="swal2-cancel swal2-styled"
            aria-label=""
            @click="resetSelection"
          >
            {{ $t("no") }}
          </button>
        </div>
        <div class="swal2-actions" v-else>
          <button
            type="button"
            class="swal2-confirm swal2-styled"
            aria-label=""
            style="
              display: inline-block;
              background-color: rgb(68, 102, 242);
              border-left-color: rgb(85, 176, 71);
              border-right-color: rgb(85, 176, 71);
            "
            @click="setSelectAppointmentTypeModal"
          >
            {{ $t("continue") }}
          </button>
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
  props: ["doctorId", "appointmentType", "clinicId"],
  data() {
    return {
      selectedType: null,
      showOnlineConfirm: false,
      appointmentTypes: [
        {
          text: "Virtual Consultations",
          icon: "doctor-laptop-svg",
          type: "online",
        },
        {
          text: "On-site Consultations",
          icon: "doctor-svg",
          type: "onsite",
        },
      ],
    };
  },
  methods: {
    onHidden() {
      this.selectedType = null;
      this.$emit("close");
    },
    closeModal() {
      this.$refs.selectAppointmentType.hide();
    },
    handleSelection(item) {
      this.selectedType = item.type;
      if(this.selectedType != 'online'){
        this.showOnlineConfirm = false;
      }
    },
    setSelectAppointmentTypeModal() {
      if (!this.selectedType) {
        this.failureToast(this.$t("doctorList.selectBookingType"));
        return;
      }
      if (this.selectedType == "online" && !this.showOnlineConfirm) {
        this.showOnlineConfirm = true;
        return;
      }
      this.$emit("select", this.selectedType);
    },
    resetSelection() {
      this.showOnlineConfirm = false;
      this.selectedType = null;
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
</style>