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
            <img :src="getImageUrl(doctor.photo)" alt="doctor-image" />
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
            {{
              isBookingFlow
                ? $t("doctorList.makeAppointment")
                : $t("doctorList.viewDetails")
            }}
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
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      searchDoctorQuery: "",
      filteredDoctors: [],
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
          clinic = this.getBookingClinic;
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
            this.failureToast(response.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          console.error(err);
          this.failureToast();
          this.setLoadingState(false);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>