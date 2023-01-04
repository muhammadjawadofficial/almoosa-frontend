<template>
  <div
    class="connect-container full-height-container d-flex iframe-loading"
  ></div>
</template>
  
  <script>
import { mapActions } from "vuex";
import { appointmentService, userService } from "../services";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions("appointment", ["setSelectedAppointment"]),
    showModal() {
      let booking = userService.getBooking();
      if (booking) {
        booking.status = "confirmed";
        this.setSelectedAppointment(booking);
        userService.removeBooking();
      }
      let paymentVerifyObject = JSON.parse(
        localStorage.getItem("paymentVerifyObject")
      );
      localStorage.removeItem("paymentVerifyObject");
      if (!paymentVerifyObject) {
        this.navigateTo("default");
        return;
      }
      appointmentService.createPayment(paymentVerifyObject).then((res) => {
        let response = res.data;
        this.setLoadingState(false);
        if (response && response.status) {
          if (
            response.data.items[0].operation_status
              .toLowerCase()
              .includes("fail")
          ) {
            this.successIconModal(
              this.$t("selectPaymentMethod.paymentFailed"),
              response.data.items[0][
                this.getLocaleKey("operation_message", "lower", "", "_ar")
              ],
              "m-payment-failure"
            ).then(() => {
              this.navigateTo("Appointment Detail");
            });
            return;
          }
          this.successIconModal(
            this.$t("selectPaymentMethod.paymentSuccessful"),
            this.$t("selectPaymentMethod.paymentSuccessfulText"),
            "m-payment-success"
          ).then(() => {
            this.navigateTo("default");
          });
        } else {
          this.failureToast();
        }
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