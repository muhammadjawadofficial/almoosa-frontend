<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation
      :title="$t('upcomingAppointment.appointmentTimeline')"
      backLink="Appointment Detail"
    />
    <b-card
      header-tag="div"
      no-body
      class="ash-card card-wizard simple transparent"
    >
      <b-card-body class="py-0 px-3 mt-4">
        <div
          class="appointment-list"
          :class="{ noData: !timelineList || !timelineList.length }"
        >
          <div class="loading no-data" v-if="timelineList == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data" v-else-if="!timelineList.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="timeline in timelineList"
              :key="'upcoming-appointment-id' + timeline.id"
            >
              <div class="appointment-time">
                <div class="appointment-time-day">
                  {{ getDate(timeline.booked_date) }}
                </div>
                <div class="appointment-time-time">
                  {{
                    timeline.start_time
                      ? getTimeFromDate(timeline.start_time, true)
                      : ""
                  }}
                </div>
              </div>
              <div class="appointment-card default">
                <div class="appointment-details">
                  <div
                    class="doctor-name"
                    :class="{
                      'font-info': timeline.type == 'onsite',
                      'font-primary': timeline.type == 'online',
                    }"
                  >
                    {{ $t("bookAppointment." + timeline.type.toLowerCase()) }}
                    {{ $t("appointmentDetail.consultation") }}
                  </div>
                  <div class="appointment-detail-section mt-3">
                    <div class="appointment-detail-section-title">
                      <template v-if="isDoctor">
                        {{ $t("appointmentDetail.treatmentType") }}
                      </template>
                      <template v-else>
                        {{
                          timeline.doctor && timeline.doctor.speciality
                            ? timeline.doctor.speciality.title
                            : "N/A"
                        }}
                        {{ $t("appointmentDetail.specialist") }}
                      </template>
                    </div>
                    <div class="appointment-detail-section-value mt-1">
                      <template v-if="isDoctor">
                        {{ getLocaleKey(getUserInfo["department"]) || "N/A" }}
                      </template>
                      <template v-else>
                        {{ getFullName(timeline.doctor) }}
                      </template>
                    </div>
                  </div>
                  <div class="appointment-detail-section mt-3">
                    <div class="appointment-detail-section-title">
                      {{ $t("appointmentDetail.treatmentDate") }}
                    </div>
                    <div class="appointment-detail-section-value mt-1">
                      {{ formatLongDayDateFromDate(timeline.booked_date) }}
                      <em v-if="timeline.start_time" class="separator">.</em>
                      {{
                        timeline.start_time
                          ? getTimeFromDate(timeline.start_time, true)
                          : ""
                      }}
                    </div>
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      {{
                        timeline.start_time
                          ? getTimeFromDate(timeline.start_time, true) + " - "
                          : ""
                      }}
                      {{
                        timeline.end_time
                          ? getTimeFromDate(timeline.end_time, true)
                          : ""
                      }}
                    </div>
                  </div>
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
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      timelineList: null,
    };
  },
  mounted() {
    if (!this.getSelectedAppointment) {
      this.navigateTo("Appointment Detail");
      return;
    }
    this.fetchTimelines();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("appointment", ["getSelectedAppointment"]),
  },
  methods: {
    ...mapActions("myTimeline", ["setSelectedTimeline"]),
    fetchTimelines() {
      this.setLoadingState(true);
      let obj = {
        mrn_number: this.getUserInfo.mrn_number,
        doctor_id: this.getSelectedAppointment.doctor_id,
      };
      if (this.isDoctor) {
        obj = {
          mrn_number: this.getSelectedAppointment.patient_id,
          doctor_id: this.getUserInfo.id,
        };
      }
      appointmentService
        .getAppointmentHistory(obj.mrn_number, obj.doctor_id)
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              this.timelineList = [...data];
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
  },
};
</script>
