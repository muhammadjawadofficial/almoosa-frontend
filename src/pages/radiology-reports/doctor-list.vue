<template>
  <div
    class="
      radiology-report-doctors-container
      page-body-container
      standard-width
    "
  >
    <back-navigation :title="$t('radiologyReport.title')" />
    <b-card
      header-tag="div"
      no-body
      class="ash-card card-wizard simple transparent"
    >
      <b-card-body class="py-0 px-3 mt-4">
        <div
          class="appointment-list"
          :class="{ noData: !reportAppointments || !reportAppointments.length }"
        >
          <div class="loading" v-if="reportAppointments == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data" v-else-if="!reportAppointments.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="appointment in reportAppointments"
              :key="'upcoming-appointment-id' + appointment.id"
            >
              <div class="appointment-time">
                <div class="appointment-time-day">
                  {{ getDate(appointment.booked_date) }}
                </div>
                <div class="appointment-time-time">
                  {{ removeSecondsFromTimeString(appointment.start_time) }}
                </div>
              </div>
              <div class="appointment-card default">
                <div class="doctor-avatar">
                  <img :src="getImageUrl(appointment.doctor.photo)" alt="" />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{ $t("bookAppointment." + appointment.type) }}
                    {{ $t("radiologyReport.appointmentSession") }}
                  </div>
                  <div class="doctor-speciality">
                    {{
                      appointment.doctor.first_name +
                      (appointment.doctor.middle_name
                        ? " " + appointment.doctor.middle_name + " "
                        : " ") +
                      appointment.doctor.family_name
                    }}
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      {{ removeSecondsFromTimeString(appointment.start_time) }}
                      -
                      {{ removeSecondsFromTimeString(appointment.end_time) }}
                    </div>
                  </div>
                  <button
                    class="btn btn-primary start-call-button"
                    @click="viewDetails(appointment)"
                  >
                    {{ $t("radiologyReport.viewDetails") }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reportService } from "../../services";
export default {
  data() {
    return {
      reportAppointments: null,
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    ...mapActions("radiologyReport", ["setSelectedRadiologyReport"]),
    fetchAppointments() {
      this.setLoadingState(true);
      reportService
        .getAppointmentsWithReports(this.getUserInfo.id, "radiology")
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              this.reportAppointments = [...data];
              this.filteredDoctors = [...data];
            } else {
              this.failureToast(response.data.messsage);
            }
            this.setLoadingState(false);
          },
          () => {
            this.setLoadingState(false);
            this.failureToast();
          }
        );
    },
    viewDetails(appointment) {
      this.setSelectedRadiologyReport(appointment);
      this.navigateTo("Radiology Reports");
    },
  },
};
</script>
