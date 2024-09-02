<template>
  <div
    class="find-specialist-container only-back-container page-body-container standard-width"
  >
    <back-navigation />
    <div
      class="datetime-section find-specialist-container-section block-section"
    >
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
        <ash-datepicker
          :placeholder="$t('findSpecialist.selectDate')"
          v-model="selectedDate"
          disableDate="forward"
        />
      </div>
    </div>
    <div
      v-if="getBookingMethod == 'onsite'"
      class="location-section find-specialist-container-section block-section"
    >
      <div class="heading-section">
        <div class="heading-icon">
          <location-svg />
        </div>
        <div class="heading-text">
          <div class="heading-title">
            {{ $t("findSpecialist.chooseLocation") }}
          </div>
        </div>
      </div>
      <div class="body-section">
        <div class="location-card-container">
          <div
            class="location-card"
            :class="{
              active: selectedClinic.id == clinic.id,
              disabled: !clinic.is_active,
            }"
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
                  {{ clinic[getLocaleKey("title")] }}
                </div>
                <div class="location-card-details-info-address">
                  {{ clinic[getLocaleKey("address")] }}
                </div>
                <div class="location-card-details-info-timing">
                  {{ clinic[getLocaleKey("timing")] }}
                </div>
              </div>
            </div>
            <div class="location-card-map" v-if="false">
              <img
                :src="getImageUrl(clinic.map_image)"
                alt="clinic-map-image"
              />
            </div>
          </div>
          <div class="loading pt-0 no-data" v-if="clinics == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data pt-0" v-else-if="!clinics || !clinics.length">
            {{ $t("noData") }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="specialist-section find-specialist-container-section block-section pb-3"
      style="position: relative"
    >
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
      <div class="search-box">
        <div class="search-icon">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div class="search-input">
          <b-form-input
            :placeholder="$t('findSpecialist.searchSpeciality')"
            id="type-search"
            type="search"
            v-model="searchQuery"
            :formatter="alphabetsOnly"
          ></b-form-input>
        </div>
      </div>
      <div class="body-section">
        <div
          v-if="selectedSpeciality.sub_count > 0"
          class="specialities-container"
        >
          <div class="speciality active disabled" @click="unselectSpeciality">
            <div class="speciality-image">
              <img :src="getImageUrl(selectedSpeciality.icon)" alt="icon" />
            </div>
            <div class="speciality-label">
              {{ selectedSpeciality[getLocaleKey("title")] }}
            </div>
          </div>
        </div>
        <div v-else class="specialities-container">
          <div
            class="speciality"
            :class="{ active: selectedSpeciality.id == speciality.id }"
            v-for="speciality in filteredSpecialities"
            :key="'find-speciality-' + speciality.id"
            @click="setSelectedSpeciality(speciality)"
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
    <template v-if="selectedSpeciality.sub_count > 0">
      <hr />
      <div
        class="specialist-section find-specialist-container-section block-section pt-0"
        style="position: relative"
      >
        <div class="heading-section">
          <div class="heading-icon">
            <img
              src="../../assets/images/speciality.svg"
              alt="speciality-icon"
            />
          </div>
          <div class="heading-text">
            <div class="heading-title">
              {{ $t("findSpecialist.subSpecialities") }}
            </div>
            <div class="heading-subTitle">
              {{ $t("findSpecialist.findSubSpecialist") }}
            </div>
          </div>
        </div>
        <div class="body-section">
          <!-- Subspecialities Container -->
          <div class="specialities-container">
            <div
              class="no-data"
              v-if="!filteredSubSpecialities || !filteredSubSpecialities.length"
            >
              {{ $t("noData") }}
            </div>
            <div
              v-else
              class="speciality"
              :class="{ active: selectedSubSpeciality.id == subSpeciality.id }"
              v-for="subSpeciality in filteredSubSpecialities"
              :key="'find-subspeciality-' + subSpeciality.id"
              @click="setSelectedSubSpeciality(subSpeciality)"
            >
              <div class="speciality-image">
                <img :src="getImageUrl(subSpeciality.icon)" alt="icon" />
              </div>
              <div class="speciality-label">
                {{ subSpeciality[getLocaleKey("title")] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      class="datetime-section find-specialist-container-section block-section"
    >
      <button @click="findSpecialist" class="btn btn-secondary">
        {{ $t("modules.Find Specialist") }}
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
      clinics: null,
      specialities: null,
      subSpecialities: null,
      selectedClinic: {},
      selectedSpeciality: {},
      selectedSubSpeciality: {},
      selectedDate: null,
      filteredSpecialities: [],
      filteredSubSpecialities: [],
      searchQuery: "",
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingMethod",
      "getBookingClinic",
      "getBookingDate",
      "getBookingSpeciality",
      "getBookingSubSpeciality",
    ]),
  },
  watch: {
    "$route.params.method": function () {
      this.setSelectedMethod();
    },
    searchQuery(val) {
      if (this.selectedSpeciality.sub_count > 0)
        this.filteredSubSpecialities = [
          ...this.subSpecialities.filter((x) =>
            x[this.getLocaleKey("title")]
              .toLowerCase()
              .includes(val.toLowerCase())
          ),
        ];
      else
        this.filteredSpecialities = [
          ...this.specialities.filter((x) =>
            x[this.getLocaleKey("title")]
              .toLowerCase()
              .includes(val.toLowerCase())
          ),
        ];
    },
  },
  async mounted() {
    let method = this.$route.params.method;
    if (method == "home-healthcare") {
      const response = await appointmentService.getHomeHealthcare();
      if (response.data.status) {
        const homeHealthCareClinic = response.data.data.items[0];
        this.setBookingClinic(homeHealthCareClinic);
      }
    }
    if (!method && this.getBookingMethod) {
      this.navigateTo("Find Specialist" + (this.getIsGuest ? " Guest" : ""), {
        method: this.getBookingMethod,
      });
    }
    this.setSelectedMethod();
    if (!this.getBookingMethod) {
      this.navigateTo("default");
    }
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingSpeciality",
      "setBookingSubSpeciality",
      "setBookingClinic",
      "setBookingDate",
      "setDoctorsList",
      "setBookingMethod",
    ]),
    unselectSpeciality() {
      this.selectedSpeciality = {};
      this.selectedSubSpeciality = {};
      this.subSpecialities = [];
      this.searchQuery = "";
    },
    getSpecialityQuery() {
      let query = "?";
      let clinicId = "";
      if (
        (this.getBookingMethod && this.getBookingMethod == "onsite") ||
        this.getBookingMethod == "online"
      )
        query += "&appointment_type=" + this.getBookingMethod;
      if (this.getBookingMethod && this.getBookingMethod == "home-healthcare")
        query += "&appointment_type=onsite";
      if (
        (this.getBookingMethod == "onsite" ||
          this.getBookingMethod == "home-healthcare") &&
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
      this.filteredSubSpecialities = null;
      Promise.all([
        this.getBookingMethod == "onsite"
          ? appointmentService.getClinicsV1()
          : null,
        appointmentService.getSpecialities(this.getSpecialityQuery()),
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
        this.setSelectedSpeciality(this.getBookingSpeciality);
      }
      if (this.getBookingSubSpeciality) {
        this.selectedSubSpeciality = this.getBookingSubSpeciality;
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
      this.setBookingMethod(type);

      this.initializeData();
    },
    setSelectedClinic(clinic) {
      if (!clinic.is_active) return;
      let isNew = this.selectedClinic.id !== clinic.id;
      this.selectedClinic = clinic;
      if (isNew) {
        this.selectedSpeciality = {};
        this.selectedSubSpeciality = {};
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

    setSelectedSpeciality(speciality) {
      this.searchQuery = "";
      this.selectedSpeciality = speciality;

      if (!this.selectedSpeciality.sub_count) return;

      appointmentService
        .getSubSpecialities(speciality.id)
        .then((response) => {
          if (response.data.status && response.data.data.items.length > 0) {
            this.subSpecialities = response.data.data.items;
            this.filteredSubSpecialities = [...this.subSpecialities];
          } else {
            this.subSpecialities = [];
          }
        })
        .catch((error) => {
          this.subSpecialities = []; // Clear on error as well
          if (!this.isAPIAborted(error)) {
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          }
        });
    },
    setSelectedSubSpeciality(subSpeciality) {
      this.selectedSubSpeciality = subSpeciality;
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
      if (
        this.selectedSpeciality.sub_count > 0 &&
        !this.selectedSubSpeciality.id
      ) {
        this.failureToast(this.$t("findSpecialist.error.subSpeciality"));
        return;
      }
      if (this.getBookingMethod != "onsite" && this.getBookingMethod != "home-healthcare") {
        this.selectedClinic = {};
      }
      this.setBookingClinic(this.selectedClinic);
      this.setBookingSpeciality(this.selectedSpeciality);
      this.setBookingSubSpeciality(this.selectedSubSpeciality);
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
