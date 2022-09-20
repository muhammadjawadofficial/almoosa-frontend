<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('criticalCare.title')" />
    <div class="search-box">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('doctorList.search')"
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
                    {{
                      appointment.first_name +
                      (appointment.middle_name
                        ? " " + appointment.middle_name + " "
                        : " ") +
                      appointment.family_name
                    }}
                  </div>
                  <div class="doctor-speciality">Intensive Care Unit</div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      <div v-if="appointment.mrn_number">
                        {{ $t("mrn_number") }} - {{ appointment.mrn_number }}
                      </div>
                      <div>
                        {{ appointment.gender }} -
                        {{ getYears(appointment.dob) }} {{ $t("years") }}
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
        ...this.patientList.filter((x) =>
          (
            x.first_name +
            (x.middle_name ? " " + x.middle_name + " " : " ") +
            x.family_name
          )
            .toLowerCase()
            .includes(val.toLowerCase())
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
      patientService.fetchCriticalCare(this.getUserInfo.id).then(
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
        () => {
          this.setLoadingState(false);
          this.failureToast();
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