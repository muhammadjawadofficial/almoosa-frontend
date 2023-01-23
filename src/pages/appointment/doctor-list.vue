<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      :backLink="
        isBookingFlow
          ? 'Find Specialist' + (getIsGuest ? ' Guest' : '')
          : 'default'
      "
      :title="
        isBookingFlow ? $t('doctorList.title') : $t('doctorList.physicianList')
      "
    />
    <div class="search-box top-padding">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('doctorList.search')"
          id="type-search"
          type="search"
          v-model="searchDoctorQuery"
          :formatter="alphabetsOnly"
        ></b-form-input>
      </div>
    </div>
    <div class="doctor-card-container">
      <div class="no-data" v-if="filteredDoctors == null">
        {{ $t("loading") }}
      </div>
      <template v-else-if="filteredDoctors && filteredDoctors.length">
        <div
          class="doctor-card"
          v-for="doctor in filteredDoctors"
          :key="'doctor-card-' + doctor.id"
        >
          <div class="doctor-image">
            <img
              :src="getImageUrl(doctor.photo || doctor)"
              alt="doctor-image"
            />
          </div>
          <div class="doctor-name">
            {{ getFullName(doctor) }}
          </div>
          <div class="doctor-speciality">
            {{ doctor.speciality[getLocaleKey("title")] }}
          </div>
          <button
            class="btn btn-primary make-appointment"
            @click="setSelectedDoctor(doctor)"
          >
            {{ $t("doctorList.viewDetails") }}
          </button>
        </div>
      </template>
      <template v-else>
        <div class="no-data">
          {{ $t(searchDoctorQuery ? "noRecord" : "doctorList.noData") }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      searchDoctorQuery: "",
      filteredDoctors: null,
      isBookingFlow: false,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getDoctorsList",
      "getBookingClinic",
      "getBookingSpeciality",
      "getBookingMethod",
      "getBookingClinic",
      "getBookingDate",
    ]),
  },
  mounted() {
    this.isBookingFlow = ["Doctor List", "Doctor List Guest"].includes(
      this.$route.name
    );
    if (
      this.isBookingFlow &&
      (!this.getBookingSpeciality ||
        !this.getBookingMethod ||
        !this.getBookingDate)
    ) {
      this.navigateTo("Find Specialist" + (this.getIsGuest ? " Guest" : ""));
      return;
    }
    this.setBookingDoctor(null);
    this.fetchDoctorList();
  },
  watch: {
    searchDoctorQuery(val) {
      this.filteredDoctors = [
        ...this.getDoctorsList.filter((x) =>
          this.getFullName(x).toLowerCase().includes(val.toLowerCase())
        ),
      ];
    },
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingDoctor",
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingAmount",
      "setDoctorsList",
    ]),
    setSelectedDoctor(doctor) {
      this.setBookingDoctor(doctor);
      this.setBookingStartTime(null);
      this.setBookingEndTime(null);
      this.setBookingAmount(100);
      this.navigateTo(
        (this.isBookingFlow ? "Doctor Details" : "Specialist Details") +
          (this.getIsGuest ? " Guest" : "")
      );
    },
    fetchDoctorList() {
      let speciality = null;
      let date = null;
      let clinic = null;

      if (this.isBookingFlow) {
        speciality = this.getBookingSpeciality.id;
        date = this.getBookingDate;
        if (this.getBookingMethod == "onsite") {
          clinic = this.getBookingClinic.id;
        }
      }
      this.setLoadingState(true);
      appointmentService.findDoctors(speciality, date, clinic).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.setDoctorsList(response.data.items);
            this.filteredDoctors = [...response.data.items];
          } else {
            this.filteredDoctors = [];
            this.failureToast(response.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.filteredDoctors = [];
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          this.setLoadingState(false);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>