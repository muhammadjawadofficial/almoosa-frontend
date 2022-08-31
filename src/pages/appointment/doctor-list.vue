<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      backLink="Find Specialist"
      :title="$t('doctorList.title')"
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
          v-model="searchDoctorQuery"
        ></b-form-input>
      </div>
    </div>
    <div class="doctor-card-container">
      <template v-if="filteredDoctors && filteredDoctors.length">
        <div
          class="doctor-card"
          v-for="doctor in filteredDoctors"
          :key="'doctor-card-' + doctor.id"
        >
          <div class="doctor-image">
            <img :src="getImageUrl(doctor)" alt="doctor-image" />
          </div>
          <div class="doctor-name">
            {{
              doctor.first_name +
              (doctor.middle_name ? " " + doctor.middle_name + " " : " ") +
              doctor.family_name
            }}
          </div>
          <div class="doctor-speciality">{{ doctor.speciality.title }}</div>
          <button
            class="btn btn-primary make-appointment"
            @click="setSelectedDoctor(doctor)"
          >
            {{ $t("doctorList.makeAppointment") }}
          </button>
        </div>
      </template>
      <template v-else>
        <div class="no-data">{{ $t("doctorList.noData") }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      searchDoctorQuery: "",
      filteredDoctors: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getDoctorsList"]),
  },
  mounted() {
    if (!this.getDoctorsList) {
      this.navigateTo("Find Specialist");
    }
    this.filteredDoctors = [...this.getDoctorsList];
    this.setBookingDoctor(null);
  },
  watch: {
    searchDoctorQuery(val) {
      this.filteredDoctors = [
        ...this.getDoctorsList.filter((x) =>
          x.first_name.toLowerCase().includes(val.toLowerCase())
        ),
      ];
    },
  },
  methods: {
    ...mapActions("user", [
      "setBookingDoctor",
      "setBookingStartTime",
      "setBookingEndTime",
    ]),
    getImageUrl(profile) {
      if (profile.photo) {
        return process.env.VUE_APP_SERVER + profile.photo.path;
      }
      return "../../assets/images/profile.png";
    },
    setSelectedDoctor(doctor) {
      this.setBookingDoctor(doctor);
      this.setBookingStartTime(null);
      this.setBookingEndTime(null);
      this.navigateTo("Doctor Details");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>