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
      this.successIconModal(
        this.$t("selectPaymentMethod.paymentFailed"),
        this.$t("selectPaymentMethod.paymentFailedText"),
        "m-payment-failure"
      ).then(() => {
        this.navigateTo("Appointment Detail");
      });
    },
  },
  computed: {},
  mounted() {
    this.showModal();
  },
};
</script>