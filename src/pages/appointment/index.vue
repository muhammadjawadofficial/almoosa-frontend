<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("user", [
      "setBookingDate",
      "setBookingClinic",
      "setBookingSpeciality",
    ]),
  },
  beforeDestroy() {
    this.setBookingDate(null);
    this.setBookingClinic(null);
    this.setBookingSpeciality(null);
  },
};
</script>