<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("appointment", [
      "setBookingMethod",
      "setBookingSpeciality",
      "setBookingSubSpeciality",
      "setBookingClinic",
      "setBookingDate",
      "setBookingTimeslot",
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingDoctor",
      "setBookingAmount",
      "setSelectedAppointment",
      "setBookingNearestDate",
    ]),
    destroyObjects(always = false) {
      if (always || !localStorage.getItem("url")) {
        this.setBookingMethod(null);
        this.setBookingSpeciality(null);
        this.setBookingSubSpeciality(null);
        this.setBookingClinic(null);
        this.setBookingDate(null);
        this.setBookingTimeslot(null);
        this.setBookingStartTime(null);
        this.setBookingEndTime(null);
        this.setBookingDoctor(null);
        this.setSelectedAppointment(null);
        this.setBookingAmount(null);
        this.setBookingNearestDate(null);
      }
    },
  },
  created() {
    this.$root.$refs.appointmentModule = this;
  },
  beforeDestroy() {
    this.destroyObjects();
  },
};
</script>