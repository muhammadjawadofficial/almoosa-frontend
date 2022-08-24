<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation title="Schedule Appointment" />
    <div class="doctor-list-container">
        
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("user", ["getDoctorsList"]),
  },
};
</script>

<style lang="scss" scoped>
</style>