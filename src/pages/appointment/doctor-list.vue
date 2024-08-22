<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      :backLink="
        isBookingFlow
          ? 'Find Specialist' + (getIsGuest ? ' Guest' : '')
          : 'default'
      "
      :title="$t('doctorList.physicianList')"
    />
    <div class="search-box" :class="{ 'top-padding': !getIsGuest }">
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
      <template v-else-if="!filteredDoctors.length">
        <div class="no-data">
          {{ $t(!searchDoctorQuery ? "noRecord" : "doctorList.noData") }}
        </div>
      </template>
      <template v-else>
        <div
          class="doctor-card"
          v-for="doctor in filteredDoctors"
          :key="'doctor-card-' + doctor.id"
          :class="{
            // unavailable: doctor.has_schedule == 'NO',
            // 'fully-booked': doctor.doctor_availability == 'NO',
          }"
        >
          <div class="doctor-image">
            <img
              :src="getImageUrl(doctor.photo || doctor)"
              alt="doctor-image"
            />
            <div
              class="doctor-availability"
              v-if="isBookingFlow && isDoctorAvailableForBooking(doctor)"
            >
              {{
                doctor.has_schedule == "NO"
                  ? $t("doctorUnavailable")
                  : doctor.doctor_availability == "NO"
                  ? $t("doctorFullyBooked")
                  : ""
              }}
            </div>
          </div>
          <div class="doctor-name">
            {{ getFullName(doctor, $t("dr")) }}
          </div>
          <div class="doctor-speciality">
            {{
              doctor.speciality
                ? doctor.speciality[getLocaleKey("title")]
                : doctor.speciality_id || "N/A"
            }}
          </div>
          <button
            class="btn btn-primary make-appointment"
            @click="setSelectedDoctor(doctor)"
          >
            <!-- {{
              doctor.has_schedule == "NO"
                ? $t("doctorUnavailable")
                : doctor.doctor_availability == "NO"
                ? $t("doctorFullyBooked")
                : $t("doctorList.viewDetails")
            }} -->
            {{
              isDoctorAvailableForBooking(doctor)
                ? $t("doctorList.viewAvailability")
                : $t("doctorList.viewDetails")
            }}
          </button>
        </div>
      </template>
    </div>
    <nearest-availability-modal
      @select="selectNearestAvailability"
      @close="hideNearestAvailabilityModal"
    />
    <select-appointment-type-modal
      @select="selectBookingType"
      @close="hideSelectAppointmentTypeModal"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../../services";
import NearestAppointmentModal from "./nearest-availability-modal";
import SelectAppointmentTypeModal from "./select-appointment-type-modal";
export default {
  data() {
    return {
      searchDoctorQuery: "",
      filteredDoctors: null,
      isBookingFlow: false,
    };
  },
  components: {
    "nearest-availability-modal": NearestAppointmentModal,
    "select-appointment-type-modal": SelectAppointmentTypeModal,
  },
  computed: {
    ...mapGetters("appointment", [
      "getDoctorsList",
      "getBookingClinic",
      "getBookingSpeciality",
      "getBookingSubSpeciality",
      "getBookingSelectedSpeciality",
      "getBookingMethod",
      "getBookingDate",
    ]),
    isBookAConsultationFlow() {
      return !["onsite", "online"].includes(this.getBookingMethod);
    },
  },
  mounted() {
    this.isBookingFlow = ["Doctor List", "Doctor List Guest"].includes(
      this.$route.name
    );
    if (
      this.isBookingFlow &&
      (!this.getBookingSelectedSpeciality ||
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
      "setBookingDate",
      "setBookingNearestDate",
      "setBookingMethod",
    ]),
    openNearestAvailabilityModal() {
      this.$bvModal.show("nearestAvailabilityCustomModal");
    },
    openSelectAppointmentTypeModal() {
      this.$bvModal.show("selectAppointmentTypeCustomModal");
    },
    hideNearestAvailabilityModal() {
      this.$bvModal.hide("nearestAvailabilityCustomModal");
    },
    hideSelectAppointmentTypeModal() {
      this.$bvModal.hide("selectAppointmentTypeCustomModal");
    },
    isDoctorAvailableForBooking(doctor) {
      return (
        this.isBookingFlow &&
        (doctor.has_schedule == "NO" || doctor.doctor_availability == "NO")
      );
    },
    setSelectedDoctor(doctor) {
      this.setBookingDoctor(doctor);
      this.setBookingStartTime(null);
      this.setBookingEndTime(null);
      this.setBookingAmount(100);
      if (this.isDoctorAvailableForBooking(doctor)) {
        this.openNearestAvailabilityModal();
        return;
      }
      if (this.isBookingFlow && this.isBookAConsultationFlow) {
        this.openSelectAppointmentTypeModal();
        return;
      }
      this.navigateTo(
        (this.isBookingFlow ? "Doctor Details" : "Specialist Details") +
          (this.getIsGuest ? " Guest" : "")
      );
    },
    selectNearestAvailability(date) {
      this.setBookingNearestDate(this.removeDateTime(date));
      if (this.isBookingFlow && this.isBookAConsultationFlow) {
        this.openSelectAppointmentTypeModal();
        return;
      }
      this.navigateTo(
        (this.isBookingFlow ? "Doctor Details" : "Specialist Details") +
          (this.getIsGuest ? " Guest" : "")
      );
    },
    selectBookingType(type) {
      this.setBookingMethod(type);
      this.navigateTo(
        (this.isBookingFlow ? "Doctor Details" : "Specialist Details") +
          (this.getIsGuest ? " Guest" : "")
      );
    },
    fetchDoctorList() {
      let speciality = null;
      let subSpeciality = null;
      let date = null;
      let clinic = null;

      if (this.isBookingFlow) {
        speciality = this.getBookingSelectedSpeciality.id;
        date = this.getBookingDate;
        if (this.getBookingMethod == "onsite") {
          clinic = this.getBookingClinic.id;
        }
      }

      let method = null;
      if (
        this.getBookingMethod == "onsite" ||
        this.getBookingMethod == "online"
      ) {
        method = this.getBookingMethod;
      }

      appointmentService
        .findDoctors(speciality, date, clinic, method, this.currentAppLang)
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              this.setDoctorsList(response.data.items);
              this.filteredDoctors = [...response.data.items];
            } else {
              this.filteredDoctors = [];
              this.failureToast(response.message);
            }
          },
          (error) => {
            this.filteredDoctors = [];
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

<style lang="scss" scoped></style>
