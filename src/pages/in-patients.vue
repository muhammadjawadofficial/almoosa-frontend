<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('inPatients.title')" />
    <div class="search-box top-padding">
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
    <b-card header-tag="div" no-body class="ash-card simple transparent">
      <b-card-body class="py-0 px-3 mt-4">
        <div
          class="appointment-list"
          :class="{ noData: !filteredPatients || !filteredPatients.length }"
        >
          <div class="loading no-data" v-if="filteredPatients == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data" v-else-if="!filteredPatients.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="appointment in filteredPatients"
              :key="'upcoming-appointment-id' + appointment.id"
            >
              <div class="appointment-card default">
                <div class="doctor-avatar">
                  <img :src="getImageUrl(appointment.photo)" alt="" />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{ getFullName(appointment) }}
                  </div>
                  <div class="appointment-status">
                    {{ appointment[getLocaleKey("department")] }}
                  </div>
                  <div class="doctor-speciality" v-if="appointment.bed_number">
                    {{
                      $t("bed") + " " + translateNumber(appointment.bed_number)
                    }}
                  </div>
                  <div
                    class="doctor-speciality"
                    v-if="appointment.nursing_station"
                  >
                    {{
                      $t("nursingStation") + ": " + appointment.nursing_station
                    }}
                  </div>
                  <div
                    class="doctor-speciality text-muted"
                    v-if="appointment.admission_date"
                  >
                    {{
                      $t("admittedOn") +
                      ": " +
                      formatDateTime(appointment.admission_date)
                    }}
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      <div v-if="appointment.mrn_number">
                        {{ $t("mrn_number") }} -
                        {{ translateNumber(appointment.mrn_number) }}
                      </div>
                      <div>
                        <template v-if="appointment.gender">
                          {{
                            $t("register." + appointment.gender.toLowerCase())
                          }}
                        </template>
                        <template v-if="appointment.dob">
                          -
                          {{ translateNumber(getYears(appointment.dob)) }}
                          {{ $t("years") }}
                        </template>
                      </div>
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
import { mapGetters } from "vuex";
import { patientService } from "../services";
export default {
  data() {
    return {
      patientList: null,
      filteredPatients: null,
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  watch: {
    searchQuery(val) {
      this.filteredPatients = [
        ...this.patientList.filter(
          (x) =>
            this.getFullName(x).toLowerCase().includes(val.toLowerCase()) ||
            ("" + x.mrn_number).includes(val)
        ),
      ];
    },
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    fetchAppointments() {
      this.patientList = null;
      this.setLoadingState(true);
      patientService.fetchInPatients(this.getUserInfo.id).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.patientList = [...data];
            this.filteredPatients = [...this.patientList];
          } else {
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        (error) => {
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
    height: fit-content;
    margin: auto;
  }
  @media only screen and (min-width: 525px) {
    gap: 1rem;
    flex-direction: row;
  }
}
</style>