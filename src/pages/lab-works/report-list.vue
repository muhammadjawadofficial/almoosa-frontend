<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation
      :title="$t('labWorks.reports')"
      :backLink="'Lab Work Doctors'"
    />
    <div class="search-box top-padding">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('labWorks.search')"
          id="type-search"
          type="search"
          v-model="searchReportQuery"
        ></b-form-input>
      </div>
    </div>
    <b-card header-tag="div" no-body class="ash-card simple transparent">
      <b-card-body class="py-0 px-3 mt-4">
        <div class="loading no-data" v-if="filteredList == null">
          {{ $t("loading") }}
        </div>
        <div class="no-data" v-else-if="!filteredList.length">
          {{ $t(searchReportQuery ? "noRecord" : "noData") }}
        </div>
        <div class="appointment-list" v-else>
          <div
            class="appointment-list-item"
            v-for="(report, index) in filteredList"
            :key="'upcoming-appointment-id' + index + report.id"
          >
            <div
              class="appointment-card"
              :class="getStatusClass(report.result)"
            >
              <div class="doctor-avatar transparent">
                <lab-bg-svg />
              </div>
              <div class="appointment-details">
                <div class="doctor-name">
                  {{ report.test_name }}
                </div>
                <div class="doctor-speciality">
                  {{ getLongDateAndTimeFromDate(report.dated, true) }}
                </div>
                <div class="doctor-speciality">
                  {{ report.normal_range }}
                </div>
                <div class="appointment-status">
                  {{ report.result }}
                </div>
              </div>
              <div
                class="report-action-buttons"
                v-if="
                  showActionButtons &&
                  report.report_file &&
                  report.report_file.path
                "
              >
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
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { reportService, userService } from "../../services";
export default {
  data() {
    return {
      reports: null,
      filteredList: null,
      searchReportQuery: "",
      showActionButtons: false,
    };
  },
  mounted() {
    this.initializeData();
  },
  computed: {
    ...mapGetters("labwork", ["getSelectedLabWork"]),
  },
  watch: {
    searchReportQuery(val) {
      this.filteredList = [
        ...this.reports.filter((x) =>
          x.title.toLowerCase().includes(val.toLowerCase())
        ),
      ];
    },
  },
  methods: {
    initializeData() {
      if (!this.getSelectedLabWork) {
        this.navigateTo("Lab Work Doctors");
        return;
      }
      this.setLoadingState(true);
      reportService.getReportsWithAppointments(this.getSelectedLabWork.id).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items.filter(
              (x) => x.type.toLowerCase() === "lab"
            );
            this.reports = [...data];
            this.filteredList = [...data];
          } else {
            this.reports = [];
            this.filteredList = [];
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.reports = [];
          this.filteredList = [];
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    getStatusClass(status) {
      if (status.toLowerCase() === "normal") {
        return "success";
      } else if (status.toLowerCase() === "abnormal") {
        return "warning";
      } else {
        return "danger";
      }
    },
    viewReport(report) {
      window.open(report.report_file.path, "_blank");
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
