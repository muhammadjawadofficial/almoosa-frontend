<template>
  <div class="find-specialist-container page-body-container standard-width">
    <back-navigation />
    <div
      v-if="getBookingMethod == 'onsite'"
      class="location-section find-specialist-container-section"
    >
      <div class="heading-section">
        <div class="heading-icon">
          <location-svg />
        </div>
        <div class="heading-text">
          <div class="heading-title">
            {{ $t("findSpecialist.chooseLocation") }}
          </div>
          <div class="heading-subTitle">
            {{ $t("ash") }}
          </div>
        </div>
      </div>
      <div class="body-section">
        <div class="location-card-container">
          <div
            class="location-card"
            :class="{ active: selectedClinic.id == clinic.id }"
            v-for="clinic in clinics"
            :key="'find-specialist-clinic-' + clinic.id"
            @click="setSelectedClinic(clinic)"
          >
            <div class="location-card-details">
              <div class="location-card-details-image">
                <img :src="getImageUrl(clinic.image)" alt="clinic-image" />
              </div>
              <div class="location-card-details-info">
                <div class="location-card-details-info-name">
                  {{ clinic.title }}
                </div>
                <div class="location-card-details-info-address">
                  {{ clinic.address }}
                </div>
                <div class="location-card-details-info-timing">
                  {{ clinic.timing }}
                </div>
              </div>
            </div>
            <div class="location-card-map">
              <img
                :src="getImageUrl(clinic.map_image)"
                alt="clinic-map-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="specialist-section find-specialist-container-section">
      <div class="heading-section">
        <div class="heading-icon">
          <img src="../../assets/images/speciality.svg" alt="speciality-icon" />
        </div>
        <div class="heading-text">
          <div class="heading-title">
            {{ $t("findSpecialist.specialities") }}
          </div>
          <div class="heading-subTitle">
            {{ $t("findSpecialist.findSpecialist") }}
          </div>
        </div>
      </div>
      <div class="body-section">
        <div class="specialities-container">
          <div
            class="speciality"
            :class="{ active: selectedSpeciality.id == speciality.id }"
            v-for="speciality in specialities"
            :key="'find-speciality-' + speciality.id"
            @click="setSelectedSpeciality(speciality)"
          >
            <div class="speciality-image">
              <img src="../../assets/images/sample.svg" alt="speciality-icon" />
              <!-- <img :src="getImageUrl(speciality.icon)" alt="speciality-icon" /> -->
            </div>
            <div class="speciality-label">
              {{ speciality.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="datetime-section find-specialist-container-section">
      <div class="heading-section">
        <div class="heading-icon">
          <img src="../../assets/images/calendar.svg" alt="calendar-icon" />
        </div>
        <div class="heading-text">
          <div class="heading-title">
            {{ $t("findSpecialist.selectDateTime") }}
          </div>
          <div class="heading-subTitle">
            {{ getLongMonthDayFromDate(selectedDate) }}
          </div>
        </div>
      </div>
      <div class="body-section">
        <ash-datepicker v-model="selectedDate" />
      </div>
    </div>
    <div class="datetime-section find-specialist-container-section">
      <button @click="findSpecialist" class="btn btn-secondary">
        {{ $t("findSpecialist.findMySpecialist") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      clinics: [],
      specialities: [],
      selectedClinic: {},
      selectedSpeciality: {},
      selectedDate: null,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingMethod",
      "getBookingClinic",
      "getBookingDate",
      "getBookingSpeciality",
    ]),
  },
  mounted() {
    if (!this.getBookingMethod) {
      this.navigateTo("default");
    }
    this.initializeData();
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingSpeciality",
      "setBookingClinic",
      "setBookingDate",
      "setDoctorsList",
    ]),
    initializeData() {
      this.setLoadingState(true);
      appointmentService.getClinics().then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.clinics = response.data.items;
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
      this.setLoadingState(true);
      appointmentService.getSpecialities().then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.specialities = res.data.data.items;
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
      let today = new Date();
      this.selectedDate =
        today.getUTCFullYear() +
        "-" +
        (today.getUTCMonth() + 1) +
        "-" +
        today.getUTCDate();
      if (this.getBookingDate) {
        this.selectedDate = this.getBookingDate;
      }
      if (this.getBookingClinic) {
        this.selectedClinic = this.getBookingClinic;
      }
      if (this.getBookingSpeciality) {
        this.selectedSpeciality = this.getBookingSpeciality;
      }
    },
    getImageUrl(image) {
      return process.env.VUE_APP_SERVER + image.path;
    },
    setSelectedClinic(clinic) {
      this.selectedClinic = clinic;
    },
    setSelectedSpeciality(speciality) {
      this.selectedSpeciality = speciality;
    },
    findSpecialist() {
      if (this.getBookingMethod == "onsite" && !this.selectedClinic.id) {
        this.failureToast(this.$t("findSpecialist.error.location"));
        return;
      }
      if (!this.selectedSpeciality.id) {
        this.failureToast(this.$t("findSpecialist.error.speciality"));
        return;
      }
      if (this.getBookingMethod != "onsite") {
        this.selectedClinic = {};
      }
      this.setBookingClinic(this.selectedClinic);
      this.setBookingSpeciality(this.selectedSpeciality);
      this.setBookingDate(this.selectedDate);
      appointmentService
        .findDoctors(
          this.selectedSpeciality.id,
          this.selectedDate,
          this.selectedClinic.id
        )
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              this.setDoctorsList(response.data.items);
              this.navigateTo("Doctor List");
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