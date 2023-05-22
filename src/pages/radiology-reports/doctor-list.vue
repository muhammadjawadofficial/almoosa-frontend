<template>
  <div
    class="radiology-report-doctors-container page-body-container standard-width"
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
          <div class="loading no-data" v-if="reportAppointments == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data" v-else-if="!reportAppointments.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="(appointment, index) in reportAppointments"
              :key="'upcoming-appointment-id' + index + appointment.id"
            >
              <div class="appointment-time">
                <div class="appointment-time-day">
                  {{ getDate(appointment.booked_date) }}
                </div>
                <div class="appointment-time-day">
                  {{ getYear(appointment.booked_date) }}
                </div>
                <div class="appointment-time-time">
                  {{
                    appointment.start_time
                      ? getTimeFromDate(appointment.start_time, true)
                      : ""
                  }}
                </div>
              </div>
              <div class="appointment-card default">
                <div class="doctor-avatar">
                  <img :src="getImageUrl(appointment.doctor.photo)" alt="" />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{
                      appointment.doctor[getLocaleKey("speciality")] || "N/A"
                    }}
                  </div>
                  <div class="doctor-speciality">
                    {{ getFullName(appointment.doctor, $t("dr")) }}
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      {{
                        appointment.start_time
                          ? getTimeFromDate(appointment.start_time, true) +
                            " - "
                          : ""
                      }}
                      {{
                        appointment.end_time
                          ? getTimeFromDate(appointment.end_time, true)
                          : ""
                      }}
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
    ...mapActions("radiologyReport", ["setSelectedRadiologyReportSession"]),
    fetchAppointments() {
      reportService
        .getAppointmentsWithReports(this.getUserInfo.mrn_number, "rad")
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              this.reportAppointments = [...data];
              this.filteredDoctors = [...data];
            } else {
              this.reportAppointments = [];
              this.filteredDoctors = [];
              this.failureToast(response.data.messsage);
            }
          },
          (error) => {
            this.reportAppointments = [];
            this.filteredDoctors = [];
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    viewDetails(appointment) {
      this.setSelectedRadiologyReportSession(appointment);
      this.navigateTo("Radiology Reports");
    },
  },
};
</script>
