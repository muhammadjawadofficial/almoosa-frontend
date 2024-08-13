<template>
  <div
    class="my-medical-insurance-container standard-width page-body-container login-form"
  >
    <back-navigation
      :title="$t('detailMedical.title')"
      backLink="Medical Sessions"
    />

    <div class="row mt-5">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card
          header-tag="div"
          no-body
          class="ash-card card-top-navigation tabs-start"
        >
          <div class="add-new-insurance" @click="requestAReport()">
            <div class="icon">
              <img src="../../assets/images/add.svg" alt="add" />
            </div>
            <div class="text">
              {{ $t("detailMedical.newReportRequest") }}
            </div>
          </div>
          <b-card-body class="mt-0">
            <b-tabs pills slot="header" class="tabbed-card">
              <b-tab :title="$t('detailMedical.ready')">
                <div class="loading no-data" v-if="!readyReports">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!readyReports.length">
                  {{ $t("noData") }}
                </div>
                <div class="appointment-list" v-else>
                  <div
                    class="appointment-list-item"
                    v-for="(report, index) in readyReports"
                    :key="'detail-medical-ready-report-' + index"
                  >
                    <div class="appointment-card success">
                      <div class="doctor-avatar transparent">
                        <shield-bg-svg />
                      </div>
                      <div class="appointment-details ready">
                        <div class="doctor-name w600">
                          {{ $t("detailMedical.doctorName") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ report.doctor_name || "N/A" }}
                        </div>
                        <div class="doctor-name w600">
                          {{ $t("detailMedical.issuedDate") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ report.issued_date || "N/A" }}
                        </div>
                        <div class="doctor-name w600">
                          {{ $t("detailMedical.reportId") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ report.template_id || "N/A" }}
                        </div>
                        <div class="download-report">
                          <div class="buttons">
                            <button
                              @click="viewReport(report)"
                              class="btn btn-primary"
                            >
                              View
                            </button>
                            <a
                              :href="
                                reportUrl(
                                  'detail-medical',
                                  reportParams(report)
                                )
                              "
                              class="btn btn-secondary"
                            >
                              Download
                            </a>
                          </div>
                          <div class="images">
                            <img
                              @click="viewReport(report)"
                              src="../../assets/images/stats.svg"
                              alt="stats-img"
                            />
                            <a
                              :href="
                                reportUrl(
                                  'detail-medical',
                                  reportParams(report)
                                )
                              "
                            >
                              <img
                                src="../../assets/images/download.svg"
                                alt="download-img"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('detailMedical.requested')">
                <div class="loading no-data" v-if="requestedReports == null">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!requestedReports.length">
                  {{ $t("noData") }}
                </div>
                <div class="appointment-list" v-else>
                  <div
                    class="appointment-list-item"
                    v-for="(request, index) in requestedReports"
                    :key="'upcoming-appointment-id' + index + request.id"
                  >
                    <div
                      class="appointment-card"
                      :class="getStatusClass(request.status)"
                    >
                      <div class="doctor-avatar transparent">
                        <shield-bg-svg />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-speciality w200">
                          {{ $t("detailMedical.requestSubmitted") }}
                        </div>
                        <div class="date-time w200">
                          {{
                            getLongDateAndTimeFromDate(request.created_at, true)
                          }}
                        </div>
                        <div class="last-update-on w200">
                          {{ $t("detailMedical.requestUpdated") }}
                        </div>
                        <div class="date-time w200">
                          {{
                            getLongDateAndTimeFromDate(request.updated_at, true)
                          }}
                        </div>
                        <button class="btn btn-conditional start-call-button">
                          {{
                            $t("detailMedical." + request.status.toLowerCase())
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { medicalReportsService } from "../../services";
export default {
  data() {
    return {
      readyReports: null,
      requestedReports: null,
      selectedSession: null,
      visit_no: null,
      // alreadyRequested: false,
    };
  },
  mounted() {
    if (!this.getSelectedTimeline) {
      return this.navigateBack();
    }
    let visit_no = this.$route.params.visit_no;
    this.visit_no = visit_no;
    this.visit_no = 2563375;
    this.getDetailMedicalReports();
    this.getDetailMedicalReportRequest();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("medicalReports", ["getSelectedTimeline"]),
  },
  methods: {
    getDetailMedicalReports() {
      let query = `?visit_no=${this.visit_no}`;
      medicalReportsService
        .fetchDetailMedicalReports(query)
        .then((response) => {
          if (response.data.status) {
            this.readyReports = response.data.data.items;
          } else {
            this.failureToast(response.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    getDetailMedicalReportRequest() {
      this.$set(this, "requestedReports", []);
      let query = `?visit_no=${this.visit_no}`;
      medicalReportsService
        .fetchDetailMedicalReportRequest(query)
        .then((response) => {
          if (response.data.status) {
            this.$set(this, "requestedReports", response.data.data.items);
            // this.alreadyRequested = this.requestedReports.some(
            //   (x) => x.status == "pending"
            // );
          } else {
            this.failureToast(response.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    requestAReport() {
      // if (this.alreadyRequested) {
      //   this.failureIconModal(
      //     this.$t("detailMedical.newReportRequest"),
      //     this.$t("detailMedical.reportAlreadyRequest")
      //   );
      //   return;
      // }
      this.confirmIconModal(
        this.$t("detailMedical.newReportRequest"),
        this.$t("detailMedical.areYouSure"),
        "m-info"
      ).then((res) => {
        if (res.value) {
          medicalReportsService
            .createDetailMedicalReportRequest({
              visit_no: this.visit_no,
              appointment_id: this.getSelectedTimeline.id,
            })
            .then((response) => {
              if (response.data.status) {
                this.getDetailMedicalReportRequest();
              } else {
                this.failureToast(response.data.message);
              }
            })
            .catch((error) => {
              if (!this.isAPIAborted(error))
                this.failureToast(
                  error.response &&
                    error.response.data &&
                    error.response.data.message
                );
            });
        }
      });
    },
    getStatusClass(statusTemp) {
      let status = statusTemp || "";
      if (status.toLowerCase() == "pending") return "warning";
      else if (status.toLowerCase() == "rejected") return "danger";
      else return "success";
    },
    viewReport(report) {
      let path =
        process.env.VUE_APP_SERVER +
        "api/v1/medical-reports/pdf/" +
        this.currentAppLang +
        "/detail-medical?template_id=" +
        report.template_id;
      window.open(path, "_blank");
    },
    reportParams(report) {
      return `template_id=${report.template_id}&reportName=${report.issued_date}_${this.getSelectedTimeline.visit_no}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.add-new-insurance {
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: calc(var(--pill-height) * -1);
  right: 0;
  cursor: pointer;
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    img {
      width: 100%;
    }
  }
  @media (max-width: 768px) {
    position: relative;
    inset: unset;
    padding: 2rem 2rem 0;
  }
}
.card.ash-card
  .card-body
  .appointment-list-item
  .appointment-card
  .appointment-details {
  .doctor-name {
    color: #0f425e;
    margin-top: 1rem;
    font-size: 1.375rem;
  }
  .doctor-speciality {
    font-size: 1.188rem;
  }
  .last-update-on {
    margin-top: 1rem;
    font-size: 1.125rem;
  }
  .date-time {
    font-size: 1rem;
    color: #aeaeb4;
  }
  .start-call-button {
    text-transform: capitalize;
  }
}
.appointment-details.ready {
  position: relative;
  .download-report {
    .images {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      @media (max-width: 768px) {
        flex-direction: column;
      }
      @media (max-width: 575px) {
        display: none;
      }
    }
    .buttons {
      @media (min-width: 576px) {
        display: none;
      }
      margin-block: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
}
</style>