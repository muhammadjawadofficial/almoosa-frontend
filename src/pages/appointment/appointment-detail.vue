<template>
  <div class="appointment-detail-container page-body-container standard-width">
    <back-navigation
      backLink="Upcoming Appointment"
      :title="$t('appointmentDetail.heading')"
      :subTitle="$t('appointmentDetail.subHeading')"
    />
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
                  {{ $t("bookAppointment." + details.type) }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.specialist") }}
                </div>
                <div class="appointment-detail--value">
                  {{
                    details[isDoctor ? "patient" : "doctor"].first_name +
                    (details[isDoctor ? "patient" : "doctor"].middle_name
                      ? " " +
                        details[isDoctor ? "patient" : "doctor"].middle_name +
                        " "
                      : " ") +
                    details[isDoctor ? "patient" : "doctor"].family_name
                  }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.medicalType") }}
                </div>
                <div class="appointment-detail--value" v-if="isDoctor">
                  {{ doctorSpeciality }}
                </div>
                <div class="appointment-detail--value" v-else>
                  {{ details.doctor.speciality.title }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.token") }}
                </div>
                <div class="appointment-detail--value">4D</div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.dateTime") }}
                </div>
                <div class="appointment-detail--value">
                  {{ dateFormatter(details.booked_date) }}
                </div>
              </div>
              <div class="appointment-detail--action-buttons">
                <button class="btn btn-info appointment-detail--status">
                  {{ details.status }}
                </button>
                <div
                  class="appointment-detail--communication"
                  v-if="details.type == 'online'"
                >
                  <button class="btn btn-primary" @click="makeCall(details)">
                    {{ $t("appointmentDetail.joinCall") }}
                  </button>
                  <!-- <button class="btn btn-secondary">
                    {{ $t("appointmentDetail.chatWithDoctor") }}
                  </button> -->
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons" v-if="!isDoctor">
          <button class="btn btn-outline-primary">
            {{ $t("appointmentDetail.reschedule") }}
          </button>
          <button class="btn btn-outline-danger">
            {{ $t("appointmentDetail.cancelAppointment") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { userService } from "../../services";
export default {
  data() {
    return {
      details: null,
    };
  },
  mounted() {
    this.initializeAppointmentDetails();
  },
  methods: {
    ...mapActions("appointment", ["setSelectedAppointment"]),
    initializeAppointmentDetails() {
      this.details = this.getSelectedAppointment;
      if (!this.details) this.navigateTo("Upcoming Appointment");
    },
    makeCall(details) {
      this.navigateTo("Connect");
    },
  },
  computed: {
    ...mapGetters("appointment", ["getSelectedAppointment"]),
    doctorSpeciality() {
      return userService.currentUser().speciality;
    },
  },
};
</script>

<style>
</style>