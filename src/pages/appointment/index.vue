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
      "setBookingClinic",
      "setBookingDate",
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingDoctor",
      "setBookingAmount",
      "setSelectedAppointment",
    ]),
    destroyObjects(always = false) {
      if (always || !localStorage.getItem("url")) {
        this.setBookingMethod(null);
        this.setBookingSpeciality(null);
        this.setBookingClinic(null);
        this.setBookingDate(null);
        this.setBookingStartTime(null);
        this.setBookingEndTime(null);
        this.setBookingDoctor(null);
        this.setSelectedAppointment(null);
        this.setBookingAmount(null);
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