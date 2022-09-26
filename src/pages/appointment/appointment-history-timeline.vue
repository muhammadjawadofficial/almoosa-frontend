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
          <div class="loading" v-if="timelineList == null">
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
                  {{ removeSecondsFromTimeString(timeline.start_time) }}
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
                    {{ $t("bookAppointment." + timeline.type) }}
                    {{ $t("appointmentDetail.consultation") }}
                  </div>
                  <div class="appointment-detail-section mt-3">
                    <div class="appointment-detail-section-title">
                      <template v-if="isDoctor">
                        {{ $t("appointmentDetail.treatmentType") }}
                      </template>
                      <template v-else>
                        {{ timeline.doctor.speciality.title }}
                        {{ $t("appointmentDetail.specialist") }}
                      </template>
                    </div>
                    <div class="appointment-detail-section-value mt-1">
                      <template v-if="isDoctor">
                        {{ timeline.doctor.speciality.title }}
                      </template>
                      <template v-else>
                        {{
                          timeline.doctor.first_name +
                          (timeline.doctor.middle_name
                            ? " " + timeline.doctor.middle_name + " "
                            : " ") +
                          timeline.doctor.family_name
                        }}
                      </template>
                    </div>
                  </div>
                  <div class="appointment-detail-section mt-3">
                    <div class="appointment-detail-section-title">
                      {{ $t("appointmentDetail.treatmentDate") }}
                    </div>
                    <div class="appointment-detail-section-value mt-1">
                      {{ formatLongDayDateFromDate(timeline.booked_date) }}
                      <em class="separator">.</em>
                      {{ removeSecondsFromTimeString(timeline.start_time) }}
                    </div>
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      {{ removeSecondsFromTimeString(timeline.start_time) }}
                      -
                      {{ removeSecondsFromTimeString(timeline.end_time) }}
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
      appointmentService
        .getAppointmentHistory(
          this.getSelectedAppointment.patient_id,
          this.getSelectedAppointment.doctor_id
        )
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
