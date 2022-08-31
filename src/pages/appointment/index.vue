<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("user", [
      "setBookingMethod",
      "setBookingSpeciality",
      "setBookingClinic",
      "setBookingDate",
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingDoctor",
      "setBookingAmount",
    ]),
  },
  beforeDestroy() {
    this.setBookingMethod(null);
    this.setBookingSpeciality(null);
    this.setBookingClinic(null);
    this.setBookingDate(null);
    this.setBookingStartTime(null);
    this.setBookingEndTime(null);
    this.setBookingDoctor(null);
    this.setBookingAmount(null);
  },
};
</script>