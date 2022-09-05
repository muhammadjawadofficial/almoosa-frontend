<template>
  <div class="connect-container full-height-container d-flex iframe-loading">
    <iframe
      v-if="getPaymentObject"
      @load="iframeIsLoaded"
      :src="`https://devbatch-almoosa.loca.lt/api/v1/payments?amount=${
        getPaymentObject.amount
      }&currency=${getPaymentObject.currency}${
        getPaymentObject.method ? '&method=' + getPaymentObject.method : ''
      }&appointment_id=${getPaymentObject.appointment_id}&platform=web`"
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
  },
  mounted() {
    if (!this.getSelectedAppointment) {
      this.navigateTo("Upcoming Appointment");
      return;
    }
    userService.setBooking(this.getSelectedAppointment);
    this.setLoadingState(true);
  },
};
</script>