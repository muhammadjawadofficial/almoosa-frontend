<template>
  <div
    class="find-specialist-container only-back-container page-body-container standard-width"
  >
    <back-navigation />
    <!-- list-of-spcaillist -->
    <div
      class="specialist-section find-specialist-container-section block-section"
      style="position: relative"
    >
      <div class="heading-section">
        <div class="heading-icon">
          <img src="../../assets/images/speciality.svg" alt="speciality-icon" />
        </div>
        <div class="heading-text">
          <div class="heading-title">
            {{ $t("symptoms.symptom") }}
          </div>
          <div class="heading-subTitle">
            {{ $t("symptoms.findSymptoms") }}
          </div>
        </div>
      </div>
      <div class="search-box">
        <div class="search-icon">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div class="search-input">
          <b-form-input
            :placeholder="$t('symptoms.searchSymptom')"
            id="type-search"
            type="search"
            v-model="searchQuery"
            :formatter="alphabetsOnly"
          ></b-form-input>
        </div>
      </div>
      <div class="body-section pt-4">
        <div class="specialities-container">
          <div
            class="speciality"
            v-for="speciality in filteredSpecialities"
            :key="'find-speciality-' + speciality.id"
            @click="setSelectedSymptom(speciality)"
          >
            <!-- :class="{ active: selectedSpeciality.id == speciality.id }" -->
            <div class="speciality-image">
              <img :src="getImageUrl(speciality.icon)" alt="icon" />
            </div>
            <div class="speciality-label">
              {{ speciality[getLocaleKey("title")] }}
            </div>
          </div>
          <div class="loading pt-0 no-data" v-if="specialities == null">
            {{ $t("loading") }}
          </div>
          <div
            class="no-data pt-0"
            v-else-if="!filteredSpecialities || !filteredSpecialities.length"
          >
            {{ $t("noRecord") }}
          </div>
        </div>
      </div>
    </div>
    <!-- <div
      class="datetime-section find-specialist-container-section block-section"
    >
      <button @click="findSpecialist" class="btn btn-secondary">
        {{ $t("modules.Find Specialist") }}
      </button>
    </div> -->
  </div>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      clinics: null,
      specialities: null,
      selectedClinic: {},
      selectedSpeciality: {},
      selectedDate: null,
      filteredSpecialities: [],
      searchQuery: "",
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
  watch: {
    "$route.params.method": function () {
      this.setSelectedMethod();
    },
    searchQuery(val) {
      this.filteredSpecialities = [
        ...this.specialities.filter((x) =>
          x[this.getLocaleKey("title")]
            .toLowerCase()
            .includes(val.toLowerCase())
        ),
      ];
    },
  },
  mounted() {
    // if (!this.$route.params.method && this.getBookingMethod) {
    //   this.navigateTo("Find Specialist" + (this.getIsGuest ? " Guest" : ""), {
    //     method: this.getBookingMethod,
    //   });
    // }
    this.setSelectedMethod();
    // if (!this.getBookingMethod) {
    //   this.navigateTo("default");
    // }
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingSpeciality",
      "setBookingClinic",
      "setBookingDate",
      "setDoctorsList",
      "setBookingMethod",
    ]),
    getSpecialityQuery() {
      let query = "?";
      let clinicId = "";
      if (this.getBookingMethod)
        query += "&appointment_type=" + this.getBookingMethod;
      if (
        this.getBookingMethod == "onsite" &&
        (this.selectedClinic || this.getBookingClinic)
      )
        clinicId =
          (this.selectedClinic && this.selectedClinic.id) ||
          (this.getBookingClinic && this.getBookingClinic.id);
      if (clinicId) query += "&clinic_id=" + clinicId;

      return query;
    },
    initializeData() {
      this.clinics = null;
      this.specialities = null;
      this.filteredSpecialities = null;
      Promise.all([
        this.getBookingMethod == "onsite"
          ? appointmentService.getClinicsV1()
          : null,
        appointmentService.getSymptomsSpecialitiesV1(this.getSpecialityQuery()),
      ])
        .then((res) => {
          if (this.getBookingMethod == "onsite") {
            let clinicResponse = res[0].data;
            if (clinicResponse.status) {
              this.clinics = clinicResponse.data.items;
            } else {
              this.clinics = [];
              this.failureToast(clinicResponse.message);
            }
          }
          let specialitiesResponse = res[1].data;
          if (specialitiesResponse.status) {
            this.specialities = specialitiesResponse.data.items;
            this.filteredSpecialities = [...this.specialities];
          } else {
            this.specialities = [];
            this.failureToast(specialitiesResponse.data.message);
          }
        })
        .catch((error) => {
          this.clinics = [];
          this.specialities = [];
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
      let today = new Date();
      this.selectedDate = this.removeDateTime(today.setHours(0, 0, 0));
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
    getSpecialityIcon(name) {
      let productImage = "";
      try {
        productImage = require(`../../assets/images/speciality/${name}.svg`);
      } catch (error) {
        productImage = require("../../assets/images/add.svg");
      }
      return productImage;
    },
    setSelectedMethod(pre = null) {
      let type = pre || this.$route.params.method;
      if (type == "online") {
        this.setBookingMethod("online");
      } else if (type == "onsite") {
        this.setBookingMethod("onsite");
      }

      this.initializeData();
    },
    setSelectedClinic(clinic) {
      if (!clinic.is_active) return;
      let isNew = this.selectedClinic.id !== clinic.id;
      this.selectedClinic = clinic;
      if (isNew) {
        this.selectedSpeciality = {};
        appointmentService
          .getSpecialities(this.getSpecialityQuery())
          .then((res) => {
            let specialitiesResponse = res.data;
            if (specialitiesResponse.status) {
              this.specialities = specialitiesResponse.data.items;
              this.filteredSpecialities = [...this.specialities];
            } else {
              this.specialities = [];
              this.failureToast(specialitiesResponse.data.message);
            }
          })
          .catch((error) => {
            this.specialities = [];
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          });
      }
    },
    setSelectedSymptom(speciality) {
      this.selectedSpeciality = speciality;
      this.$router.push({
        name: "Gender Checker",
        query: { speciality: JSON.stringify(this.selectedSpeciality.id) },
      });
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
      if (this.getIsGuest) {
        this.navigateTo("Doctor List Guest");
      } else {
        this.navigateTo("Doctor List");
      }
    },
  },
};
</script>
  
  <style lang="scss" scoped></style>