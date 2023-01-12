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
                <div
                  class="appointment-list"
                  :class="{
                    noData:
                      !filteredLabCriticalList ||
                      !filteredLabCriticalList.length,
                  }"
                  @scroll="scroll"
                >
                  <div
                    class="loading no-data"
                    v-if="filteredLabCriticalList == null"
                  >
                    {{ $t("loading") }}
                  </div>
                  <div
                    class="no-data"
                    v-else-if="!filteredLabCriticalList.length"
                  >
                    {{ $t("noData") }}
                  </div>
                  <template v-else>
                    <div
                      class="appointment-list-item"
                      v-for="appointment in filteredLabCriticalList"
                      :key="'upcoming-appointment-id' + appointment.id"
                    >
                      <div class="appointment-card default">
                        <div class="doctor-avatar">
                          <img :src="getImageUrl(appointment.photo)" alt="" />
                        </div>
                        <div class="appointment-details">
                          <div class="doctor-name">
                            {{
                              appointment[getLocaleKey("patient_funll_name")]
                            }}
                          </div>
                          <div class="doctor-speciality">
                            {{ appointment.test_name.toLowerCase() }}
                          </div>
                          <div class="appointment-status">
                            <div class="appointment-time-span">
                              <div v-if="appointment.mrno">
                                {{ $t("mrn_number") }} -
                                {{ appointment.mrno }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="report-action-buttons">
                          <div
                            class="view-report"
                            @click="viewReport(appointment)"
                          >
                            <img
                              src="../assets/images/stats.svg"
                              alt="stats-img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </b-tab>
              <b-tab :title="$t('criticalCare.radiology')">
                <div
                  class="appointment-list"
                  :class="{
                    noData:
                      !filteredRadCriticalList ||
                      !filteredRadCriticalList.length,
                  }"
                >
                  <div
                    class="loading no-data"
                    v-if="filteredRadCriticalList == null"
                  >
                    {{ $t("loading") }}
                  </div>
                  <div
                    class="no-data"
                    v-else-if="!filteredRadCriticalList.length"
                  >
                    {{ $t("noData") }}
                  </div>
                  <template v-else>
                    <div
                      class="appointment-list-item"
                      v-for="appointment in filteredRadCriticalList"
                      :key="'upcoming-appointment-id' + appointment.id"
                    >
                      <div class="appointment-card default">
                        <div class="doctor-avatar">
                          <img :src="getImageUrl(appointment.photo)" alt="" />
                        </div>
                        <div class="appointment-details">
                          <div class="doctor-name">
                            {{
                              appointment[getLocaleKey("patient_funll_name")]
                            }}
                          </div>
                          <div class="doctor-speciality">
                            {{ appointment.test_name.toLowerCase() }}
                          </div>
                          <div class="appointment-status">
                            <div class="appointment-time-span">
                              <div v-if="appointment.mrno">
                                {{ $t("mrn_number") }} -
                                {{ appointment.mrno }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="report-action-buttons">
                          <div
                            class="view-report"
                            @click="viewReport(appointment)"
                          >
                            <img
                              src="../assets/images/stats.svg"
                              alt="stats-img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
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
    },
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    scroll(e) {
      var scrollBar = e.target;
      if (
        scrollBar.scrollTop + scrollBar.clientHeight >=
        scrollBar.scrollHeight - 20
      ) {
        var t = new Date().getTime();
        if (t - this.lastScrollUpdate > 3000) {
          this.lastScrollUpdate = t;
          console.log(
            "reached end: " +
              scrollBar.scrollTop +
              " " +
              scrollBar.clientHeight +
              " " +
              scrollBar.scrollHeight
          );
          //TODO: load more data
        } else {
          console.log("< 3sec between scoll. no update");
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
          } else {
            this.failureToast(labResponse.data.messsage);
          }
          let radResponse = res[1];
          if (radResponse.data.status) {
            let data = radResponse.data.data.items;
            this.radCriticalList = [...data];
            this.filteredRadCriticalList = [...this.radCriticalList];
          } else {
            this.failureToast(radResponse.data.messsage);
          }
        })
        .catch((error) => {
          this.labCriticalList = [];
          this.radCriticalList = [];
          this.filteredLabCriticalList = [];
          this.filteredRadCriticalList = [];
          if (!this.isAPIAborted(error)) this.failureToast();
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
    right: 6rem !important;
    height: fit-content;
    margin: auto;
  }
  @media only screen and (min-width: 525px) {
    gap: 1rem;
    flex-direction: row;
  }
}
</style>