<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('criticalCare.title')" />
    <div class="search-box top-padding-3">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('criticalCare.search')"
          id="type-search"
          type="search"
          v-model="searchQuery"
        ></b-form-input>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card header-tag="div" no-body class="ash-card card-top-navigation">
          <b-card-body class="mt-0">
            <b-tabs pills slot="header" class="tabbed-card">
              <b-tab :title="$t('criticalCare.lab')">
                <div class="loading no-data" v-if="paginatedLabList == null">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!paginatedLabList.length">
                  {{ $t("noData") }}
                </div>
                <div class="appointment-list" v-else>
                  <div
                    class="appointment-list-item"
                    v-for="appointment in paginatedLabList"
                    :key="'upcoming-appointment-id' + appointment.id"
                  >
                    <div class="appointment-card default">
                      <div class="doctor-avatar">
                        <img :src="getImageUrl(appointment.photo)" alt="" />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name">
                          {{ appointment.test_name }}
                        </div>
                        <div class="doctor-speciality">
                          {{ appointment[getLocaleKey("patient_full_name")] }}
                        </div>
                        <div class="doctor-speciality" v-if="appointment.mrno">
                          {{
                            $t("mrn_number") +
                            " - " +
                            translateNumber(appointment.mrno)
                          }}
                        </div>
                        <div class="doctor-speciality text-muted">
                          {{
                            getLongDateAndTimeFromDate(appointment.dated, true)
                          }}
                        </div>
                        <div class="doctor-speciality text-muted">
                          {{ $t("range") + ": " + appointment.normal_range }}
                        </div>
                        <div class="appointment-status">
                          {{
                            appointment.result +
                            " - " +
                            (appointment.result_criticality || "N/A")
                          }}
                        </div>
                      </div>
                      <div
                        class="report-action-buttons"
                        v-if="appointment.report_url"
                      >
                        <button
                          class="btn start-call-button"
                          @click.stop="viewReport(appointment)"
                        >
                          {{ $t("viewReport") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="text-center"
                  v-if="
                    filteredLabCriticalList && filteredLabCriticalList.length
                  "
                >
                  <button
                    class="btn btn-secondary btn-pill"
                    @click="loadMore('lab')"
                  >
                    {{ $t("loadMore") }}
                  </button>
                </div>
              </b-tab>
              <b-tab :title="$t('criticalCare.radiology')">
                <div class="loading no-data" v-if="paginatedRadList == null">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!paginatedRadList.length">
                  {{ $t("noData") }}
                </div>
                <div class="appointment-list" v-else>
                  <div
                    class="appointment-list-item"
                    v-for="appointment in paginatedRadList"
                    :key="'upcoming-appointment-id' + appointment.id"
                  >
                    <div class="appointment-card default">
                      <div class="doctor-avatar">
                        <img :src="getImageUrl(appointment.photo)" alt="" />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name">
                          {{ appointment.test_name }}
                        </div>
                        <div class="doctor-speciality">
                          {{ appointment[getLocaleKey("patient_full_name")] }}
                        </div>
                        <div class="doctor-speciality" v-if="appointment.mrno">
                          {{
                            $t("mrn_number") +
                            " - " +
                            translateNumber(appointment.mrno)
                          }}
                        </div>
                        <div class="doctor-speciality">
                          {{
                            getLongDateAndTimeFromDate(appointment.dated, true)
                          }}
                        </div>
                        <div class="appointment-status">
                          {{ appointment.result }}
                        </div>
                      </div>
                      <div
                        class="report-action-buttons"
                        v-if="appointment.report_url"
                      >
                        <button
                          class="btn start-call-button"
                          @click.stop="viewReport(appointment)"
                        >
                          {{ $t("viewReport") }}
                        </button>
                        <!-- <div
                          class="view-report"
                          @click="viewReport(appointment)"
                        >
                          <img
                            src="../assets/images/stats.svg"
                            alt="stats-img"
                          />
                        </div> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="text-center"
                  v-if="
                    filteredRadCriticalList && filteredRadCriticalList.length
                  "
                >
                  <button
                    class="btn btn-secondary btn-pill"
                    @click="loadMore('rad')"
                  >
                    {{ $t("loadMore") }}
                  </button>
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
import { patientService, userService } from "../services";
export default {
  data() {
    return {
      labCriticalList: null,
      radCriticalList: null,
      filteredLabCriticalList: null,
      filteredRadCriticalList: null,
      paginatedLabList: null,
      paginatedRadList: null,
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  watch: {
    searchQuery(val) {
      this.filteredLabCriticalList = [
        ...this.labCriticalList.filter((x) =>
          this.getFullName(x).toLowerCase().includes(val.toLowerCase())
        ),
      ];
      this.filteredRadCriticalList = [
        ...this.radCriticalList.filter((x) =>
          this.getFullName(x).toLowerCase().includes(val.toLowerCase())
        ),
      ];
      this.paginatedLabList = [];
      this.paginatedRadList = [];
      this.loadMore("lab");
      this.loadMore("rad");
    },
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    loadMore(name) {
      if (name == "rad") {
        for (let i = 0; i < 5; i++) {
          if (this.filteredRadCriticalList.length) {
            this.paginatedRadList.push(this.filteredRadCriticalList.shift());
          }
        }
      } else if (name == "lab") {
        for (let i = 0; i < 5; i++) {
          if (this.filteredLabCriticalList.length) {
            this.paginatedLabList.push(this.filteredLabCriticalList.shift());
          }
        }
      }
    },
    fetchAppointments() {
      this.labCriticalList = null;
      this.setLoadingState(true);
      let fromDate = this.removeDateTime(
        new Date().setFullYear(new Date().getFullYear() - 1)
      );
      let toDate = this.removeDateTime(new Date());
      let queryString =
        "?doctor_id=" +
        this.getUserInfo.id +
        "&from_date=" +
        fromDate +
        "&to_date=" +
        toDate;
      let radQueryString = queryString + "&type=rad";
      let labQueryString = queryString + "&type=lab";

      Promise.all([
        patientService.fetchCriticalCare(labQueryString),
        patientService.fetchCriticalCare(radQueryString),
      ])
        .then((res) => {
          let labResponse = res[0];
          if (labResponse.data.status) {
            let data = labResponse.data.data.items;
            this.labCriticalList = [...data];
            this.filteredLabCriticalList = [...this.labCriticalList];
            this.paginatedLabList = [];
            this.loadMore("lab");
          } else {
            this.failureToast(labResponse.data.messsage);
          }
          let radResponse = res[1];
          if (radResponse.data.status) {
            let data = radResponse.data.data.items;
            this.radCriticalList = [...data];
            this.filteredRadCriticalList = [...this.radCriticalList];
            this.paginatedRadList = [];
            this.loadMore("rad");
          } else {
            this.failureToast(radResponse.data.messsage);
          }
        })
        .catch((error) => {
          this.labCriticalList = [];
          this.radCriticalList = [];
          this.filteredLabCriticalList = [];
          this.filteredRadCriticalList = [];
          this.paginatedLabList = [];
          this.paginatedRadList = [];
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        })
        .finally(() => {
          this.setLoadingState(false);
        });
    },
    viewReport(report) {
      window.open(report.report_url, "_blank");
    },
    downloadReport(report) {
      let file = {
        url: report.image_url,
      };
      userService.downloadFile(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment-time-span {
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  flex-direction: column;
  @media only screen and (min-width: 992px) {
    gap: 2rem;
    top: 1.875rem;
    bottom: 1.875rem;
    &.report-icon {
      right: 6rem !important;
    }
    height: fit-content;
    margin: auto;
  }
  @media only screen and (min-width: 525px) {
    gap: 1rem;
    flex-direction: row;
  }
}
</style>