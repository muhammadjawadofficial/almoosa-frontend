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
                  <button
                    class="btn btn-secondary"
                    v-if="
                      (details.status || 'unpaid').toLowerCase() == 'unpaid' &&
                      !isDoctor
                    "
                    @click="makePayment"
                  >
                    {{ $t("bookAppointment.payNow") }}
                  </button>
                  <button
                    class="btn btn-primary"
                    @click="makeCall(details)"
                    v-if="
                      details.type.toLowerCase() == 'online' &&
                      !getUserInfo.isDependent &&
                      details.status &&
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
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      details: null,
      instructions: [],
    };
  },
  mounted() {
    this.initializeAppointmentDetails();
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
    ]),
    initializeAppointmentDetails() {
      this.details = this.getSelectedAppointment;
      if (!this.details) this.navigateTo("Upcoming Appointment");
      this.instructions = [
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      ];
    },
    makePayment() {
      let obj = {
        amount: this.details.amount,
        appointment_id: this.details.id,
        payLater: true,
      };
      this.setPaymentObject(obj);
      this.navigateTo("Select Payment Method");
    },
    makeCall(appointment) {
      if (this.details.status.toLowerCase() !== "paid") {
        this.failureToast(this.$t("cantJoinCallPaymetPending"));
        return;
      }
      if (
        this.isAllowedToCall(
          this.details.booked_date,
          this.details.start_time,
          this.details.end_time
        )
      ) {
        let html =
          "<ul class='swal2-list'>" +
          this.instructions.map((x) => "<li>" + x + "</li>").join("") +
          "</ul>";
        this.successIconListModal(
          this.$t("appointmentDetail.instructionTitle"),
          html,
          "m-clipboard",
          this.$t("appointmentDetail.joinCall")
        ).then((res) => {
          if (res.value) {
            localStorage.setItem("doctor", this.details.doctor_id);
            this.navigateTo("Connect", {
              connectId: this.createRoomId(
                appointment.id,
                appointment.doctor_id,
                this.getUserInfo.mrn_number
              ),
              name: this.getFullName(this.getUserInfo),
            });
          }
        });
      }
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
    cancelAppointment() {
      this.confirmIconModal(
        this.$t("upcomingAppointment.modal.confirm"),
        this.$t("upcomingAppointment.modal.confirmText"),
        "m-calendar-cancel-confirm",
        this.$t("yes"),
        this.$t("appointmentDetail.reschedule")
      ).then((result) => {
        if (result.value) {
          this.setLoadingState(true);
          appointmentService.cancelAppointment(this.details.id).then(
            (res) => {
              let response = res.data;
              if (response.status) {
                this.navigateTo("Upcoming Appointment");
                this.successIconModal(
                  this.$t("upcomingAppointment.modal.delete"),
                  this.$t("upcomingAppointment.modal.deleteText"),
                  "m-calendar-cancel"
                );
              } else {
                this.failureToast(response.message);
              }
              this.setLoadingState(false);
            },
            (error) => {
              console.error(error);
              if (!this.isAPIAborted(error))
                this.failureToast(
                  error.response &&
                    error.response.data &&
                    error.response.data.message
                );
              this.setLoadingState(false);
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
      return this.getUserInfo.speciality[this.getLocaleKey("title")] || "N/A";
    },
  },
};
</script>

<style>
</style>