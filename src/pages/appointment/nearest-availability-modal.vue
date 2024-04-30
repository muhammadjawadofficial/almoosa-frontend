<template>
  <b-modal
    ref="nearestAvailability"
    id="nearestAvailabilityCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
    @hidden="onHidden"
    @shown="fetchNearestAvailability"
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
            src="../../assets/images/m-document.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div>
          <div class="heading">
            {{ getFullName(this.getBookingDoctor, $t("dr")) }}
          </div>
          <div class="sub-heading">
            {{ $t("doctorList.doctorIsAvailableOnFollowingDates") }}
          </div>
          <hr />
          <div class="d-flex">
            <div class="booking-time-slots mt-0 w-100 sd">
              <div class="time-slots-container large">
                <div class="no-data pt-0 text-center" v-if="getLoading">
                  {{ this.$t("loading") }}
                </div>
                <template v-else-if="availableDates.length">
                  <div
                    class="time-slot"
                    :class="{
                      active: selectedDate == availableDate.date,
                    }"
                    v-for="(availableDate, index) in availableDates"
                    :key="index + '-available-date'"
                    @click="handleSelection(availableDate, index)"
                  >
                    {{ getLongDateFromDate(availableDate.date) }}
                  </div>
                </template>
                <div class="no-data pt-0 text-center" v-else>
                  {{ $t("noRecord") }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swal2-actions">
          <button
            type="button"
            class="swal2-confirm swal2-styled"
            aria-label=""
            v-if="availableDates.length"
            style="
              display: inline-block;
              background-color: rgb(68, 102, 242);
              border-left-color: rgb(85, 176, 71);
              border-right-color: rgb(85, 176, 71);
            "
            @click="setNearestAvailability"
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
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../../services";
export default {
  props: ["doctorId", "appointmentType", "clinicId"],
  data() {
    return {
      availableDates: [],
      selectedDate: null,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingDoctor",
      "getBookingClinic",
      "getBookingMethod",
    ]),
  },
  methods: {
    ...mapActions("appointment", ["setBookingDate"]),
    onHidden() {
      this.selectedDate = null;
      this.availableDates = [];
      this.$emit("close");
    },
    closeModal() {
      this.$refs.nearestAvailability.hide();
    },
    handleSelection(date) {
      this.selectedDate = date.date;
    },
    fetchNearestAvailability() {
      let type = null;
      if(this.getBookingMethod == 'online' || this.getBookingMethod == 'onsite') {
        type = this.getBookingMethod.toUpperCase();
      }
      const payload = {
        doctor_id: this.getBookingDoctor.id,
        type: type,
        clinic_id: this.getBookingClinic.id,
      };
      appointmentService
        .getNearestAvailability(payload)
        .then((response) => {
          if (response.data.status) {
            this.availableDates = response.data.data.items;
          } else {
            this.failureToast(response.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    setNearestAvailability() {
      if (!this.selectedDate) {
        this.failureToast(this.$t("findSpecialist.selectDate"));
        return;
      }
      this.$emit("select", this.selectedDate);
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