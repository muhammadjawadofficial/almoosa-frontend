<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('myTimeline.title')" backLink="Medical File" />
    <b-card
      header-tag="div"
      no-body
      class="ash-card card-wizard simple transparent"
    >
      <b-card-body class="py-0 px-3 mt-4">
        <div class="loading no-data" v-if="timelineList == null">
          {{ $t("loading") }}
        </div>
        <div class="no-data" v-else-if="!timelineList.length">
          {{ $t("noData") }}
        </div>
        <div class="appointment-list" v-else>
          <div
            class="appointment-list-item"
            v-for="(timeline, index) in timelineList"
            :key="'upcoming-appointment-id' + index + timeline.id"
          >
            <div class="appointment-time">
              <div class="appointment-time-day">
                {{ getDate(timeline.start_date) }}
              </div>
              <div class="appointment-time-day">
                {{ getYear(timeline.booked_date) }}
              </div>
              <div class="appointment-time-time">
                {{ getTimeFromDate(timeline.start_date, true) }}
              </div>
            </div>
            <div class="appointment-card default">
              <div class="doctor-avatar">
                <img
                  :src="getImageUrl(timeline.doctor && timeline.doctor.photo)"
                  alt=""
                />
              </div>
              <div class="appointment-details">
                <div class="doctor-name">
                  {{ timeline[getLocaleKey("department")] || "N/A" }}
                </div>
                <div class="doctor-speciality">
                  {{ timeline[getLocaleKey("doctor_name")] }}
                </div>
                <div class="appointment-status success">
                  <div class="appointment-time-span">
                    {{ timeline.episode_status }}
                  </div>
                </div>
                <button
                  class="btn btn-conditional start-call-button"
                  @click="viewDetails(timeline)"
                >
                  {{ $t("myTimeline.viewDetails") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { timelineService } from "../../services";
export default {
  data() {
    return {
      timelineList: null,
    };
  },
  mounted() {
    this.fetchTimelines();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    ...mapActions("myTimeline", ["setSelectedTimeline"]),
    fetchTimelines() {
      timelineService.fetchTimelineSessions(this.getUserInfo.mrn_number).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.timelineList = [...data];
            this.filteredDoctors = [...data];
          } else {
            this.timelineList = [];
            this.filteredDoctors = [];
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          this.timelineList = [];
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
      this.setSelectedTimeline(appointment);
      this.navigateTo("My Timeline Details");
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment-time-span {
  position: unset !important;
}
</style>