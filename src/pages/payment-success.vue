<template>
  <div
    class="connect-container full-height-container d-flex iframe-loading"
  ></div>
</template>
  
  <script>
export default {
  mounted() {
    this.successIconModal(
      this.$t("selectPaymentMethod.paymentSuccessful"),
      this.$t("selectPaymentMethod.paymentSuccessfulText"),
      "m-payment-success"
    ).then(() => {
      this.navigateTo("Upcoming Appointment");
    });
  },
};
</script>