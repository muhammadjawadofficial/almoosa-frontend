<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('modules.Sick Leave')" />
    <b-card
      header-tag="div"
      no-body
      class="ash-card card-wizard simple transparent"
    >
      <b-card-body class="py-0 px-3 mt-4">
        <div class="loading no-data" v-if="sickLeavesList == null">
          {{ $t("loading") }}
        </div>
        <div class="no-data" v-else-if="!sickLeavesList.length">
          {{ $t("noData") }}
        </div>
        <div class="appointment-list" v-else>
          <div
            class="appointment-list-item"
            v-for="(sickLeave, index) in sickLeavesList"
            :key="'upcoming-appointment-id' + index + sickLeave.id"
          >
            <div class="appointment-time">
              <div class="appointment-time-day">
                {{ getDate(sickLeave.created_at, false) }}
              </div>
              <div class="appointment-time-day">
                {{ getYear(sickLeave.created_at, false) }}
              </div>
            </div>
            <div class="appointment-card default">
              <div class="doctor-avatar">
                <img
                  :src="getImageUrl(sickLeave.doctor && sickLeave.doctor.photo)"
                  alt=""
                />
              </div>
              <div class="appointment-details">
                <div class="doctor-name">
                  {{ sickLeave.type_of_leave || "N/A" }}
                </div>
                <div class="doctor-speciality">
                  {{
                    `${sickLeave[getLocaleKey("speciality")]} | ${
                      sickLeave[getLocaleKey("visit_type")]
                    } - ${translateNumber(sickLeave.visit_no)}`
                  }}
                </div>
                <div class="appointment-status unset success">
                  <div class="appointment-time-span">
                    {{ sickLeave[getLocaleKey("incharge")] }}
                  </div>
                </div>
                <div class="appointment-status">
                  <div class="appointment-time-span">
                    {{ formatDate(sickLeave.leave_from) }}
                    -
                    {{ formatDate(sickLeave.leave_to) }}
                  </div>
                </div>
                <a
                  class="btn btn-conditional start-call-button"
                  :href="reportUrl('sick', reportParams(sickLeave))"
                >
                  {{ $t("download") }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { medicalReportsService } from "../../services";
export default {
  data() {
    return {
      sickLeavesList: null,
    };
  },
  mounted() {
    this.fetchSickLeaves();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    fetchSickLeaves() {
      let query = `?mrn_number=${this.getUserInfo.mrn_number}`;
      medicalReportsService.fetchSickLeaveReports(query).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.sickLeavesList = [...data];
          } else {
            this.sickLeavesList = [];
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          this.sickLeavesList = [];
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    reportParams(sickLeave) {
      return `visit_no=${sickLeave.visit_no}&reportName=${sickLeave.visit_type}_${sickLeave.visit_no}_${sickLeave.speciality}_${sickLeave.type_of_leave}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment-status.unset {
  .appointment-time-span {
    position: unset !important;
  }
}
</style>