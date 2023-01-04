<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('myTimeline.title')" />
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
              v-for="(timeline, index) in timelineList"
              :key="'upcoming-appointment-id' + index + timeline.id"
            >
              <div class="appointment-time">
                <div class="appointment-time-day">
                  {{ getDate(timeline.start_date) }}
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
                <div class="doctor-avatar">
                  <img
                    :src="getImageUrl(timeline.doctor && timeline.doctor.photo)"
                    alt=""
                  />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{
                      timeline.episode_status
                        ? timeline.episode_status +
                          " " +
                          $t("myTimeline.appointmentSession")
                        : "N/A"
                    }}
                  </div>
                  <div class="doctor-speciality">
                    {{ timeline.doctor_name }}
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
                  <button
                    class="btn start-call-button"
                    @click="viewDetails(timeline)"
                  >
                    {{ $t("myTimeline.viewDetails") }}
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
      this.setLoadingState(true);
      timelineService.fetchTimelineSessions(this.getUserInfo.mrn_number).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.timelineList = [...data];
            this.filteredDoctors = [...data];
          } else {
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        () => {
          this.timelineList = [];
          this.filteredDoctors = [];
          this.setLoadingState(false);
          this.failureToast();
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
