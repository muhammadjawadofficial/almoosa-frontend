<template>
  <div
    class="
      book-appointment-completion-conatiner
      page-body-container
      standard-width
    "
  >
    <b-card header-tag="div" no-body class="ash-card bg-tertiary card-rounded">
      <b-card-header class="bg-secondary">
        <div class="appointment-success-header">
          <div class="success-icon">
            <img src="../../assets/images/check-transparent.svg" alt="" />
          </div>
          <div class="success-message">
            <div class="success-message-text">
              {{ $t("bookAppointment.success") }}
            </div>
            <div class="success-message-info">
              {{ $t("bookAppointment.info") }}
            </div>
          </div>
        </div>
      </b-card-header>
      <b-card-body class="mt-0">
        <div class="appointment-success-body">
          <div class="appointment-detail">
            <div class="appointment-detail--type">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.appointment") }}
              </div>
              <div class="appointment-detail--value">
                {{ $t("bookAppointment." + getBookingMethod) }}
              </div>
            </div>
            <div class="appointment-detail--sepecialist">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.specialist") }}
              </div>
              <div class="appointment-detail--value">
                {{
                  getBookingDoctor.first_name +
                  (getBookingDoctor.middle_name
                    ? " " + getBookingDoctor.middle_name + " "
                    : " ") +
                  getBookingDoctor.family_name
                }}
              </div>
            </div>
            <div class="appointment-detail--sepecialist">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.dateTime") }}
              </div>
              <div class="appointment-detail--value">
                {{
                  getLongDateFromDate(getBookingDate) +
                  " - " +
                  removeSecondsFromTimeString(getBookingStartTime) +
                  " - " +
                  removeSecondsFromTimeString(getBookingEndTime)
                }}
              </div>
            </div>
            <div class="appointment-detail--sepecialist">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.payment") }}
              </div>
              <div class="appointment-detail--value">
                SAR {{ getBookingAmount }}
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <div class="row">
      <div class="col-md-12 button-group">
        <button class="btn btn-primary" @click="showModal">
          {{ $t("bookAppointment.payNow") }}
        </button>
        <button class="btn btn-secondary" @click="bookAppointment">
          {{ $t("bookAppointment.payLater") }}
        </button>
        <button class="btn btn-tertiary" @click="navigateTo('Doctor Details')">
          {{ $t("back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService, userService } from "../../services";
export default {
  mounted() {
    this.checkAccess();
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingMethod",
      "getBookingDoctor",
      "getBookingDate",
      "getBookingStartTime",
      "getBookingEndTime",
      "getBookingAmount",
    ]),
  },
  methods: {
    ...mapActions("appointment", ["resetBookAppointment",]),
    checkAccess() {
      console.log(
        "sar",
        this.getBookingAmount,
        this.getBookingEndTime,
        this.getBookingStartTime,
        this.getBookingDate,
        this.getBookingDoctor,
        this.getBookingMethod
      );
      if (
        !(
          this.getBookingAmount &&
          this.getBookingEndTime &&
          this.getBookingStartTime &&
          this.getBookingDate &&
          this.getBookingDoctor &&
          this.getBookingMethod
        )
      ) {
        this.navigateTo("Doctor Details");
      }
    },
    showModal() {
      this.successIconModal(
        this.$t("bookAppointment.modal.confirmed"),
        this.$t("bookAppointment.modal.confirmedText")
      ).then(() => {
        this.resetBookAppointment();
        this.navigateTo("Upcoming Appointment");
      });
    },
    bookAppointment() {
      this.setLoadingState(true);
      appointmentService
        .createAppointment(
          this.getBookingMethod,
          userService.currentUser(),
          this.getBookingDoctor,
          this.getBookingDate,
          this.removeSecondsFromTimeString(
            this.getBookingStartTime,
            true,
            false
          ),
          this.removeSecondsFromTimeString(this.getBookingEndTime, true, false),
          this.getBookingAmount
        )
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              this.showModal();
            } else {
              this.failureToast(response.message);
            }
            this.setLoadingState(false);
          },
          (err) => {
            console.error(err);
            this.failureToast();
            this.setLoadingState(false);
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  button {
    padding-block: 0.5rem;
    font-size: 1.125rem;
  }
}
.appointment-detail > * {
  margin-bottom: 2rem;
}
.page-body-container {
  padding-top: 2rem;
}
</style>