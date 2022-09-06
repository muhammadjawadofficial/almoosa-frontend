<template>
  <div
    class="connect-container full-height-container d-flex iframe-loading"
  ></div>
</template>
  
  <script>
import { mapActions } from "vuex";
import { userService } from "../services";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions("appointment", ["setSelectedAppointment"]),
    showModal() {
      let booking = userService.getBooking();
      booking.status = "confirmed";
      this.setSelectedAppointment(booking);
      userService.removeBooking();
      this.setLoadingState(false);
      this.successIconModal(
        this.$t("selectPaymentMethod.paymentSuccessful"),
        this.$t("selectPaymentMethod.paymentSuccessfulText"),
        "m-payment-success"
      ).then(() => {
        this.navigateTo("default");
      });
    },
  },
  computed: {},
  beforeMount() {
    this.setLoadingState(true);
  },
  mounted() {
    this.showModal();
  },
};
</script>