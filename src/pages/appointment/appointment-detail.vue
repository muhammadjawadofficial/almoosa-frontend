<template>
  <div class="appointment-detail-container page-body-container standard-width">
    <back-navigation
      backLink="Upcoming Appointment"
      :title="$t('appointmentDetail.heading')"
    />
    <div class="search-box top-padding">
      <button
        class="btn btn-secondary"
        @click="navigateTo('Appointment History')"
      >
        {{ $t("appointmentDetail.caseHistory") }}
      </button>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <b-card
          header-tag="div"
          no-body
          class="ash-card bg-tertiary card-rounded"
        >
          <b-card-body class="mt-0" v-if="details">
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.appointment") }}
                </div>
                <div class="appointment-detail--value">
                  {{
                    details.type
                      ? $t("bookAppointment." + details.type.toLowerCase())
                      : "N/A"
                  }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{
                    $t(
                      "appointmentDetail." +
                        (isDoctor ? "patient" : "specialist")
                    )
                  }}
                </div>
                <div class="appointment-detail--value">
                  {{
                    getFullName(
                      details[isDoctor ? "patient" : "doctor"],
                      isDoctor ? "" : $t("dr")
                    )
                  }}
                </div>
              </div>
              <template v-if="isDoctor">
                <div class="appointment-detail--sepecialist">
                  <div class="appointment-detail--label">
                    {{ $t("mrn_number") }}
                  </div>
                  <div class="appointment-detail--value">
                    {{ translateNumber(details.patient.mrn_number) }}
                  </div>
                </div>
                <div class="appointment-detail--sepecialist">
                  <div class="appointment-detail--label">
                    {{ $t("gender") }}
                  </div>
                  <div class="appointment-detail--value">
                    {{ $t("register." + details.patient.gender.toLowerCase()) }}
                  </div>
                </div>
                <div class="appointment-detail--sepecialist">
                  <div class="appointment-detail--label">
                    {{ $t("age") }}
                  </div>
                  <div class="appointment-detail--value">
                    {{
                      translateNumber(getYears(details.patient.dob)) +
                      " " +
                      $t("years")
                    }}
                  </div>
                </div>
              </template>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.medicalType") }}
                </div>
                <div class="appointment-detail--value" v-if="isDoctor">
                  {{ doctorSpeciality }}
                </div>
                <div class="appointment-detail--value" v-else>
                  {{
                    details.doctor.speciality[getLocaleKey("title")] ||
                    details.doctor[getLocaleKey("speciality")] ||
                    "N/A"
                  }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.dateTime") }}
                </div>
                <div class="appointment-detail--value">
                  {{
                    formatLongDayDateFromDate(details.booked_date) +
                    " - " +
                    getTimeFromDate(details.start_time, true)
                  }}
                </div>
              </div>
              <div class="appointment-detail--action-buttons">
                <button
                  class="btn btn-info appointment-detail--status"
                  v-if="!isDoctor"
                >
                  {{
                    $t(
                      "paymentStatus." +
                        (details.status || "unpaid").toLowerCase()
                    )
                  }}
                </button>
                <div class="appointment-detail--communication">
                  <template
                    v-if="
                      (details.status || 'unpaid').toLowerCase() == 'unpaid' &&
                      !isDoctor
                    "
                  >
                    <button
                      class="btn btn-secondary"
                      :disabled="
                        details.type.toLowerCase() == 'online' &&
                        !isAllowedToPay(details.start_time)
                      "
                      @click="makePayment"
                    >
                      {{ $t("bookAppointment.payNow") }}
                    </button>
                  </template>
                  <button
                    class="btn btn-primary"
                    @click="makeCall(details)"
                    v-if="
                      details.type &&
                      details.status &&
                      details.is_appt_billed &&
                      details.type.toLowerCase() == 'online' &&
                      details.status.toLowerCase() == 'paid'
                    "
                  >
                    {{ $t("appointmentDetail.joinCall") }}
                  </button>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons" v-if="!isDoctor">
          <button
            class="btn btn-outline-primary"
            @click="rescheduleAppointment"
          >
            {{ $t("appointmentDetail.reschedule") }}
          </button>
          <button @click="cancelAppointment" class="btn btn-outline-danger">
            {{ $t("appointmentDetail.cancelAppointment") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  appointmentService,
  freeAppointmentPromoService,
  userService,
} from "../../services";
export default {
  data() {
    return {
      details: null,
      instructions: [],
      paymentAmountResponse: null,
      serviceBaseRate: null,
    };
  },
  mounted() {
    this.initializeAppointmentDetails();
  },
  watch: {
    currentAppLang() {
      this.initializeAppointmentDetails();
    },
  },
  methods: {
    ...mapActions("appointment", [
      "setSelectedAppointment",
      "setBookingDate",
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingDoctor",
      "setBookingAmount",
      "setBookingMethod",
      "setIsReschedule",
      "setPaymentObject",
      "setTeleConsultation",
    ]),
    ...mapActions("user", ["updateUserInfo"]),
    initializeAppointmentDetails() {
      this.details = this.getSelectedAppointment;
      if (!this.details) this.navigateTo("Upcoming Appointment");

      if (this.details.type.toLowerCase() == "online") {
        this.fetchAppointmentInstructions();
      }
    },
    fetchAppointmentInstructions() {
      appointmentService
        .getAppointmentInstructions(
          "?title=" + this.getLocaleKey("TELE_INSTRUCTIONS", "", "_AR", "upper")
        )
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              let instructions = "";
              if (
                response.data &&
                response.data.items &&
                response.data.items.length
              ) {
                instructions = response.data.items[0].value;
                this.instructions = JSON.parse(instructions);
              }
            } else {
              this.failureToast(response.message);
            }
          },
          (error) => {
            console.error(error);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    makePayment() {
      if (
        this.details &&
        this.details.type.toLowerCase() == "online" &&
        !this.isAllowedToPay(this.details.start_time)
      ) {
        this.failureToast(this.$t("cannotPayForTheAppointment"));
        return;
      }
      let obj = {
        amount: this.details.amount,
        appointment_id: this.details.id,
        payLater: true,
        payableAmount: this.details.amount,
      };
      this.setPaymentObject(obj);
      this.navigateTo("Select Payment Method");
    },
    async makeCall(appointment) {
      let html =
        "<ul class='swal2-list'>" +
        this.instructions.map((x) => "<li>" + x + "</li>").join("") +
        "</ul>";
      this.successIconListModal(
        this.$t("appointmentDetail.instructionTitle"),
        html,
        "m-clipboard",
        this.$t("appointmentDetail.joinCall")
      ).then(async (res) => {
        if (res.value) {
          try {
            let teleConsultation =
              await appointmentService.joinTeleConsultation({
                appointment_id: appointment.id,
              });

            this.setTeleConsultation(teleConsultation.data.data);
            this.setSelectedAppointment(appointment);
            this.setDoctorRatingData();
            this.navigateTo("Connect Zoom Native");
          } catch (error) {
            let errorMessage =
              error.response &&
              error.response.data &&
              error.response.data.message;
            this.failureToast(errorMessage);
          }
        }
      });
    },
    setDoctorRatingData() {
      let doctorRatingPayload = {
        appointment_id: this.details.id,
        user_id: this.getUserInfo.id,
        rated_user_id: this.details.doctor_id,
      };
      localStorage.setItem(
        "doctorRatingPayload",
        JSON.stringify(doctorRatingPayload)
      );
    },
    rescheduleAppointment() {
      this.setBookingDoctor(this.details.doctor);
      this.setBookingDate(this.details.booked_date);
      this.setBookingStartTime(this.details.start_time);
      this.setBookingEndTime(this.details.end_time);
      this.setBookingAmount(this.details.amount);
      this.setIsReschedule(this.details.id);
      this.setBookingMethod(this.details.type);
      this.navigateTo("Doctor Details");
    },
    showCancelModal() {
      this.navigateTo("Upcoming Appointment");
      this.successIconModal(
        this.$t("upcomingAppointment.modal.delete"),
        this.$t("upcomingAppointment.modal.deleteText"),
        "m-calendar-cancel"
      );
    },
    cancelAppointment() {
      const isEligibleForCancelFreeAppt =
        this.isEligibleForCancelFreeAppt &&
        this.isEligibleForCancelFreeAppt.appointment_id ==
          this.getSelectedAppointment.id;
      this.confirmIconModal(
        this.$t("upcomingAppointment.modal.confirm"),
        this.$t("upcomingAppointment.modal.confirmText"),
        "m-calendar-cancel-confirm",
        this.$t("yes"),
        this.$t("appointmentDetail.reschedule")
      ).then((result) => {
        if (result.value) {
          appointmentService.cancelAppointment(this.details.id).then(
            (res) => {
              let response = res.data;
              if (response.status) {
                if (isEligibleForCancelFreeAppt) {
                  freeAppointmentPromoService
                    .fetchFreeActiveAppointmentPromos(
                      "?mrn_number=" + this.getUserInfo.mrn_number
                    )
                    .then((promoRes) => {
                      let promoResponse = promoRes.data;
                      if (promoResponse.status) {
                        this.updateUserInfo({
                          first_free_promo: promoResponse.data.items,
                        });
                        this.showCancelModal();
                      }
                    });
                } else {
                  this.showCancelModal();
                }
              } else {
                this.failureToast(response.message);
              }
            },
            (error) => {
              console.error(error);
              if (!this.isAPIAborted(error))
                this.failureToast(
                  error.response &&
                    error.response.data &&
                    error.response.data.message
                );
            }
          );
        } else if (result.dismiss == "cancel") {
          this.rescheduleAppointment();
        }
      });
    },
  },
  computed: {
    ...mapGetters("appointment", ["getSelectedAppointment", "getIsReschedule"]),
    ...mapGetters("user", ["getUserInfo"]),
    doctorSpeciality() {
      return (
        (this.getUserInfo.speciality &&
          this.getUserInfo.speciality[this.getLocaleKey("title")]) ||
        "N/A"
      );
    },
  },
};
</script>

<style>
</style>