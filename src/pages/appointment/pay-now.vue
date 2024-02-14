<template>
  <div class="connect-container full-height-container d-flex iframe-loading">
    <iframe
      v-if="getPaymentObject"
      @load="iframeIsLoaded"
      :src="getIframeUrl"
      class="full-height-container mt-0 w-100"
      frameborder="0"
    >
    </iframe>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import { userService } from "../../services";
export default {
  data() {
    return {
      testObject: {
        currency: "SAR",
        amount: 100,
        appointment_id: 129,
        method: null,
      },
    };
  },
  methods: {
    iframeIsLoaded() {
      this.setLoadingState(false);
    },
  },
  computed: {
    ...mapGetters("appointment", [
      "getPaymentObject",
      "getSelectedAppointment",
    ]),
    ...mapGetters("user", ["getUserInfo"]),
    getIframeUrl() {
      return (
        process.env.VUE_APP_API_V2_BASE_URL +
        "api/v1/payments?amount=" +
        this.getPaymentObject.amount +
        "&currency=" +
        this.getPaymentObject.currency +
        (this.getPaymentObject.method
          ? "&method=" + this.getPaymentObject.method
          : "") +
        (this.getPaymentObject.otherPayment
          ? "&package_id="
          : "&appointment_id=") +
        this.getPaymentObject.appointment_id +
        "&platform=web" +
        (this.getPaymentObject.otherPayment
          ? "&is_package=true"
          : "&doctor_id=" +
            (this.getSelectedAppointment
              ? this.getSelectedAppointment.doctor_id
              : "")) +
        "&patient_id=" +
        this.getUserInfo.id
      );
    },
  },
  mounted() {
    if (!this.getPaymentObject || !this.getPaymentObject.amount) {
      this.navigateTo("Upcoming Appointment");
      return;
    }
    if (!this.getPaymentObject.otherPayment)
      userService.setBooking(this.getSelectedAppointment);
    this.setLoadingState(true);
  },
};
</script>