<template>
  <div
    class="connect-container full-height-container d-flex iframe-loading"
  ></div>
</template>
  
  <script>
export default {
  data() {
    return {};
  },
  methods: {
    showModal() {
      this.setBookingState();
      this.successIconModal(
        this.$t("selectPaymentMethod.paymentCancelled"),
        this.$t("selectPaymentMethod.paymentCancelledText"),
        "m-payment-failure"
      ).then(() => {
        this.navigateTo("default");
      });
    },
  },
  computed: {},
  mounted() {
    this.showModal();
  },
};
</script>