<template>
  <div
    class="find-specialist-container only-back-container page-body-container standard-width"
  >
    <back-navigation v-if="!isWebView" />
    <div
      class="specialist-section find-specialist-container-section block-section"
      :class="{ 'py-0': isWebView }"
      style="position: relative"
    >
      <div class="heading-section" v-if="!isWebView">
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
        <div
          class="specialities-container"
          :class="{ 'justify-content-center': isWebView }"
        >
          <div
            class="speciality"
            v-for="speciality in filteredSpecialities"
            :key="'find-speciality-' + speciality.id"
            @click="setSelectedSymptom(speciality)"
          >
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
    this.setAppLanguageFromRoute();
    this.initializeData();
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
        appointmentService.getSymptomsSpecialitiesSuggested(this.getSpecialityQuery()),
      ])
        .then((res) => {
          let specialitiesResponse = res[0].data;
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
    setSelectedSymptom(speciality) {
      this.selectedSpeciality = speciality;
      this.$router.push({
        name: "Survey" + (this.isWebView ? " WebView" : "") + (this.getIsGuest ? " Guest" : ""),
        query: { speciality: JSON.stringify(this.selectedSpeciality.id) },
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped></style>