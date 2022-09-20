<template>
  <div
    class="
      radiology-report-doctors-container
      page-body-container
      standard-width
    "
  >
    <back-navigation
      :title="$t('radiologyReport.title')"
      :backLink="'Radiology Report Doctors'"
    />
    <div class="search-box">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('doctorList.search')"
          id="type-search"
          type="search"
          v-model="searchReportQuery"
        ></b-form-input>
      </div>
    </div>
    <b-card header-tag="div" no-body class="ash-card simple transparent">
      <b-card-body class="py-0 px-3 mt-4">
        <div
          class="appointment-list"
          :class="{ noData: !reports || !reports.length }"
        >
          <div class="loading" v-if="reports == null">{{ $t("loading") }}</div>
          <div class="no-data" v-else-if="!reports.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="report in reports"
              :key="'upcoming-appointment-id' + report.id"
            >
              <div class="appointment-card default">
                <div class="doctor-avatar transparent">
                  <lab-bg-svg />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{ report.title }}
                  </div>
                  <div class="doctor-speciality">
                    {{ getLongDateAndTimeFromDate(report.dated, true) }}
                  </div>
                  <div class="appointment-status">
                    {{ report.result }}
                  </div>
                </div>
                <div class="report-action-buttons">
                  <div class="view-report" @click="viewReport(report)">
                    <img src="../../assets/images/stats.svg" alt="stats-img" />
                  </div>
                  <div class="download-report" @click="downloadReport(report)">
                    <img
                      src="../../assets/images/download.svg"
                      alt="download-img"
                    />
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
import { mapGetters } from "vuex";
import { userService } from "../../services";
export default {
  data() {
    return {
      reports: [],
      searchReportQuery: "",
    };
  },
  mounted() {
    this.initializeData();
  },
  computed: {
    ...mapGetters("radiologyReport", ["getSelectedRadiologyReport"]),
  },
  watch: {
    searchReportQuery(val) {
      this.reports = [
        ...this.getSelectedRadiologyReport.reports.filter((x) =>
          x.title.toLowerCase().includes(val.toLowerCase())
        ),
      ];
    },
  },
  methods: {
    initializeData() {
      if (!this.getSelectedRadiologyReport) {
        this.navigateTo("Radiology Report Doctors");
        return;
      }
      this.reports = this.getSelectedRadiologyReport.reports;
    },
    viewReport(report) {
      window.open(
        process.env.VUE_APP_SERVER + report.report_file.path,
        "_blank"
      );
    },
    downloadReport(report) {
      let file = {
        name: report.report_file.filename,
        url: report.report_file.path,
      };
      userService.downloadFile(file);
    },
  },
};
</script>
