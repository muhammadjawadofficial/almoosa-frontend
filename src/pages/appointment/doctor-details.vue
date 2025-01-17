<template>
  <div class="doctor-details-container find-specialist-container">
    <div class="doctor-details" v-if="doctor">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img
                :src="getImageUrl(doctor.photo || doctor)"
                alt="doctor-image"
              />
            </div>
            <div class="doctor-details-card-header-right">
              <div class="doctor-details-card-header-right-info">
                <div class="doctor-details-card-header-right-info-name">
                  {{ getFullName(doctor) }}
                </div>
                <div class="doctor-details-card-header-right-info-speciality">
                  {{
                    doctor.speciality
                      ? doctor.speciality[getLocaleKey("title")] ||
                        doctor[getLocaleKey("speciality")]
                      : "N/A"
                  }}
                </div>
                <div class="doctor-rating">
                  <div class="star-container">
                    <div class="value">
                      <div class="rating-container disable-hover">
                        <div class="fa fa-star star"></div>
                        <div class="fa fa-star star"></div>
                        <div class="fa fa-star star"></div>
                        <div class="fa fa-star star"></div>
                        <div class="fa fa-star star"></div>
                        <div
                          class="rating-filled"
                          :style="
                            'width: ' + (doctor.rating / 5 || 0) * 100 + '%'
                          "
                        >
                          <div class="fa fa-star star active"></div>
                          <div class="fa fa-star star active"></div>
                          <div class="fa fa-star star active"></div>
                          <div class="fa fa-star star active"></div>
                          <div class="fa fa-star star active"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span @click="openReviewModal()">{{
                    $t("doctorDetail.viewReviews")
                  }}</span>
                </div>
              </div>
              <div
                class="doctor-details-card-header-right-location"
                v-if="shouldShowLocation"
              >
                <img src="../../assets/images/location.svg" alt="" />
                {{ doctor.location }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="standard-width doctor-details-section">
        <div class="" style="--numberOfTabs: 3">
          <b-card
            header-tag="div"
            no-body
            class="ash-card card-wizard simple card-top-navigation"
          >
            <b-card-body>
              <b-tabs pills slot="header" class="tabbed-card">
                <b-tab
                  :title="$t('doctorDetail.tabs.booking')"
                  v-if="isBookingFlow"
                >
                  <div class="booking-details-tab-container">
                    <div class="booking-date">
                      <div class="tab-content-heading">
                        {{ $t("doctorList.bookingDate") }}
                      </div>

                      <ash-datepicker
                        v-model="selectedDate"
                        @input="bookingDateChanged"
                        disableDate="custom"
                        :dateToCompare="availabilityDates"
                        @month-change="handlePanelChange"
                      />
                    </div>
                    <div class="row">
                      <div
                        class="mt-5"
                        :class="{
                          'col-lg-4 col-md-6':
                            !getIsGuest &&
                            getBookingMethod == 'onsite' &&
                            !isClinicSelected,
                          'col-lg-6':
                            getIsGuest &&
                            getBookingMethod == 'onsite' &&
                            !isClinicSelected,
                        }"
                        v-if="getBookingMethod == 'onsite' && !isClinicSelected"
                      >
                        <div class="tab-content-heading">
                          {{ $t("findSpecialist.chooseLocation") }}
                        </div>
                        <div class="location-card-container mt-3">
                          <div
                            class="location-card"
                            :class="{
                              active: selectedClinic.id == clinic.id,
                              inactive: selectedClinic.id != clinic.id,
                              disabled: !clinic.is_active,
                            }"
                            v-for="clinic in clinics"
                            :key="'find-specialist-clinic-' + clinic.id"
                            @click="setSelectedClinic(clinic)"
                          >
                            <div class="location-card-details">
                              <div class="location-card-details-image">
                                <img
                                  :src="getImageUrl(clinic.image)"
                                  alt="clinic-image"
                                />
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
                          <div
                            class="loading pt-0 no-data"
                            v-if="clinics == null"
                          >
                            {{ $t("loading") }}
                          </div>
                          <div
                            class="no-data pt-0"
                            v-else-if="!clinics || !clinics.length"
                          >
                            {{ $t("noData") }}
                          </div>
                        </div>
                        <swiper
                          v-if="false"
                          class="swiper vertical-swiper location-card-container mt-3"
                          :options="swiperOption"
                          :slides-per-view="1"
                        >
                          <swiper-slide
                            v-for="slide in clinics"
                            :key="'slide-' + slide.id"
                          >
                            <div class="carousel-item location-card p-0">
                              <div class="login-dashboard-slide">
                                <div class="login-dashboard-slide--content">
                                  <div class="location-card-details vertical">
                                    <div class="location-card-details-image">
                                      <img
                                        :src="getImageUrl(slide.image)"
                                        alt="clinic-image"
                                      />
                                    </div>
                                    <div class="location-card-details-info">
                                      <div
                                        class="location-card-details-info-name"
                                      >
                                        {{ slide[getLocaleKey("title")] }}
                                      </div>
                                      <div
                                        class="location-card-details-info-address"
                                      >
                                        {{ slide[getLocaleKey("address")] }}
                                      </div>
                                      <div
                                        class="location-card-details-info-timing"
                                      >
                                        {{ slide[getLocaleKey("timing")] }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </swiper-slide>
                        </swiper>
                      </div>
                      <div
                        class="booking-time-slots mt-5"
                        :class="{
                          'col-lg-8 col-md-6':
                            !getIsGuest &&
                            getBookingMethod == 'onsite' &&
                            !isClinicSelected,
                          'col-lg-6':
                            getIsGuest &&
                            getBookingMethod == 'onsite' &&
                            !isClinicSelected,
                        }"
                      >
                        <div class="tab-content-heading">
                          {{ $t("doctorList.timeSlots") }}
                        </div>
                        <div class="time-slots-container">
                          <div class="no-data" v-if="!selectedDate">
                            {{ $t("doctorList.selectDate") }}
                          </div>
                          <div class="no-data" v-else-if="timeslots == null">
                            {{ this.$t("loading") }}
                          </div>
                          <template v-else-if="timeslots.length">
                            <div
                              class="time-slot"
                              :class="{
                                disabled: timeslot.is_booked != 'FREE',
                                active: selectedTimeSlotIndex == index,
                              }"
                              v-for="(timeslot, index) in timeslots"
                              :key="index + '-doctor-time-slot'"
                              @click="
                                timeslot.is_booked != 'FREE'
                                  ? null
                                  : setSelectedTimeSlot(timeslot, index)
                              "
                            >
                              {{ getTimeFromDate(timeslot.start_time, true) }}
                              -
                              {{ getTimeFromDate(timeslot.end_time, true) }}
                            </div>
                          </template>
                          <div class="no-data" v-else>
                            {{ this.$t("doctorDetail.timeslot.noData") }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab>
                <b-tab :title="$t('doctorDetail.tabs.clinic')">
                  <template v-if="doctor.clinics && doctor.clinics.length">
                    <div class="appointment-list">
                      <div
                        class="appointment-list-item"
                        v-for="clinic in doctor.clinics"
                        :key="'doctor-' + doctor.id + 'clinic-' + clinic.id"
                      >
                        <div class="hospital-name">
                          {{ clinic[getLocaleKey("title")] }}
                        </div>
                        <div class="hospital-address">
                          {{ clinic[getLocaleKey("address")] }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="no-data" v-else>
                    {{ $t("noData") }}
                  </div>
                </b-tab>
                <b-tab :title="$t('doctorDetail.tabs.experience')">
                  <div class="card-heading">
                    {{ $t("doctorDetail.aboutDoctor") }}
                  </div>
                  <div class="card-paragraph">
                    <!-- <div>
                      {{ $t("doctorDetail.degree") }}:
                      {{ doctor.degree || "N/A" }}
                    </div> -->
                  </div>
                  <div class="appointment-list">
                    <div class="appointment-list-item">
                      <div class="hospital-name">
                        {{ $t("doctorDetail.expertise") }}:
                      </div>
                      <template v-if="doctor[getLocaleKey('expertise')]">
                        <div
                          class="hospital-address"
                          v-for="(expertise, eindex) in doctor[
                            getLocaleKey('expertise')
                          ].split(',')"
                          :key="'expertise-' + eindex + '-' + expertise.trim()"
                        >
                          {{ expertise }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="hospital-address no-data pt-0">
                          {{ $t("noData") }}
                        </div>
                      </template>
                    </div>
                    <div class="appointment-list-item">
                      <div class="hospital-name">
                        {{ $t("doctorDetail.nationality") }}:
                      </div>
                      <div class="hospital-address">
                        {{
                          (doctor.nationality &&
                            doctor.nationality[getLocaleKey("nationality")]) ||
                          "N/A"
                        }}
                        <span
                          v-if="
                            doctor.nationality && doctor.nationality.flag_url
                          "
                        >
                          <b-img
                            class="flag"
                            :src="doctor.nationality.flag_url"
                            alt="Nationality Flag"
                            fluid
                          />
                        </span>
                      </div>
                    </div>
                    <div class="appointment-list-item">
                      <div class="hospital-name">
                        {{ $t("doctorDetail.languages") }}
                      </div>
                      <template v-if="doctor[getLocaleKey('languages')]">
                        <div
                          class="hospital-address"
                          v-for="language in doctor[
                            getLocaleKey('languages')
                          ].split(',')"
                          :key="'language-' + language.trim()"
                        >
                          {{ language }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="hospital-address no-data pt-0">
                          {{ $t("noData") }}
                        </div>
                      </template>
                    </div>
                    <div class="appointment-list-item">
                      <div class="hospital-name">
                        {{ $t("doctorDetail.ageGroups") }}
                      </div>
                      <template
                        v-if="doctor[getLocaleKey('consulting_age_group')]"
                      >
                        <div
                          class="hospital-address"
                          v-for="ageGroup in doctor[
                            getLocaleKey('consulting_age_group')
                          ].split(',')"
                          :key="'ageGroup-' + ageGroup.trim()"
                        >
                          {{ ageGroup }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="hospital-address no-data pt-0">
                          {{ $t("noData") }}
                        </div>
                      </template>
                    </div>
                  </div>
                </b-tab>
              </b-tabs>
            </b-card-body>
          </b-card>
          <div class="row">
            <div class="col-md-12 button-group">
              <button
                class="btn btn-secondary"
                @click="bookAppointment"
                v-if="isBookingFlow"
              >
                {{ $t("doctorList.bookAppointment") }}
              </button>
              <button
                class="btn"
                :class="isBookingFlow ? 'btn-tertiary' : 'btn-secondary'"
                @click="
                  navigateTo(
                    isBookingFlow
                      ? getIsReschedule
                        ? 'Appointment Detail'
                        : 'Doctor List' + (getIsGuest ? ' Guest' : '')
                      : 'Find A Specialist' + (getIsGuest ? ' Guest' : '')
                  )
                "
              >
                {{ $t("back") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <review-modal />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  appointmentService,
  freeAppointmentPromoService,
  userService,
} from "../../services";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import reviewsModal from "./reviews-modal.vue";
export default {
  data() {
    return {
      selectedDate: "",
      doctor: null,
      timeslots: null,
      selectedTimeSlot: null,
      selectedTimeSlotIndex: null,
      neverShowLocation: true,
      isBookingFlow: false,
      clinics: [],
      selectedClinic: {},
      availabilityDates: [],
      swiperOption: {
        direction: "vertical",
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingDoctor",
      "getBookingDate",
      "getBookingTimeslot",
      "getBookingStartTime",
      "getBookingEndTime",
      "getIsReschedule",
      "getSelectedAppointment",
      "getBookingMethod",
      "getBookingClinic",
      "getBookingNearestDate",
      "getSelectedDoctorRating",
    ]),
    ...mapGetters("user", ["getUserInfo"]),
    shouldShowLocation() {
      if (this.neverShowLocation) {
        return false;
      } else if (this.getIsReschedule) {
        return this.getSelectedAppointment.type == "onsite";
      } else {
        return this.getBookingMethod == "onsite";
      }
    },
    isClinicSelected() {
      return this.getBookingClinic && this.getBookingClinic.id;
    },
  },
  watch: {
    selectedDate(value, oldValue) {
      if (value) {
        let dateParts = this.getMonthAndYear(value);
        if (oldValue) {
          if (value.month !== oldValue.month || value.year !== oldValue.year) {
            this.fetchCalendarAvaiability(dateParts);
          }
        } else {
          this.fetchCalendarAvaiability(dateParts);
        }
      }
    },
  },
  components: {
    swiper,
    swiperSlide,
    "review-modal": reviewsModal,
  },
  mounted() {
    this.setSelectedDoctorRating({});
    if (!this.getBookingDoctor) {
      this.navigateTo("Doctor List");
    }
    this.isBookingFlow = ["Doctor Details", "Doctor Details Guest"].includes(
      this.$route.name
    );

    if (this.getIsReschedule) {
      this.selectedClinic = {
        id: this.getSelectedAppointment.location_id,
      };
    }

    this.initializeData();
    // this.fetchCalendarAvaiability(this.getMonthAndYear(this.selectedDate));
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingTimeslot",
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingDate",
      "setIsReschedule",
      "setSelectedAppointment",
      "resetBookAppointment",
      "setPaymentObject",
      "setBookingNearestDate",
      "setBookingMethod",
      "setSelectedDoctorRating",
    ]),
    async fetchCalendarAvaiability(dateParts) {
      let method = this.getBookingMethod.toLowerCase();
      if (method == "home-healthcare") {
        method = "onsite";
      }
      this.setLoadingState(true);
      const doctorId = this.getBookingDoctor.id;
      const appointmentType = method.toUpperCase();
      const locationId = this.selectedClinic ? this.selectedClinic.id : null;
      const month = dateParts.month;
      const year = dateParts.year;
      const response = await appointmentService.fetchMonthAvailability(
        doctorId,
        appointmentType,
        locationId,
        month,
        year
      );
      this.$set(this, "availabilityDates", response.data.data.items);
      this.setLoadingState(false);
    },
    handlePanelChange(dateParts) {
      this.fetchCalendarAvaiability(dateParts);
    },
    ...mapActions("user", ["updateUserInfo"]),
    initializeData() {
      this.doctor = this.getBookingDoctor;
      userService
        .getProfileById(this.getBookingDoctor.id)
        .then((res) => {
          let response = res.data;
          if (response.status) {
            let profile = response.data.items[0];
            if (profile) {
              const rating = profile.rating === null ? 0 : profile.rating;
              this.doctor = {
                ...profile,
                id: this.getBookingDoctor.id,
                profile_photo_url: this.getBookingDoctor.profile_photo_url,
                speciality: this.getBookingDoctor.speciality,
                speciality_ar: this.getBookingDoctor.speciality_ar,
                rating: rating,
              };
            }
            if (this.getBookingMethod == "online") {
              if (this.doctor && this.isBookingFlow) {
                this.fetchTimeslots();
              }
            } else if (
              this.getBookingMethod == "onsite" ||
              this.getBookingMethod == "home-healthcare"
            ) {
              if (!this.isClinicSelected) {
                appointmentService.getClinicsV1().then((res) => {
                  let response = res.data;
                  if (response.status) {
                    this.clinics = response.data.items;
                    this.selectedClinic = this.clinics[0];
                    this.fetchTimeslots();
                  } else {
                    this.clinics = [];
                    this.failureToast(response.message);
                  }
                });
              } else {
                this.selectedClinic = this.getBookingClinic;
                this.fetchTimeslots();
              }
            }
          } else {
            this.failureToast(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    setSelectedClinic(clinic) {
      this.selectedClinic = clinic;
      this.fetchTimeslots();
    },
    bookingDateChanged(val) {
      this.selectedDate = val;
      this.fetchTimeslots();
    },
    openReviewModal() {
      let doctor_id = this.getBookingDoctor.id;
      appointmentService.getDoctorRating(doctor_id).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.setSelectedDoctorRating(response.data);
            this.$bvModal.show("ReviewCustomModal");
          } else {
            this.failureToast(response.message);
          }
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    hideReviewRequestModal() {
      this.$bvModal.hide("ReviewCustomModal");
    },
    fetchTimeslots() {
      this.selectedTimeSlotIndex = null;
      let method = this.getBookingMethod || "";
      if (method == "home-healthcare") method = "onsite";
      method = method.toLowerCase();

      let location_id = null;
      if (method == "onsite" && this.selectedClinic && this.selectedClinic.id) {
        location_id = this.selectedClinic.id;
      }

      appointmentService
        .fetchTimeslots(this.doctor.id, this.selectedDate, method, location_id)
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              this.timeslots = [...response.data.items];
              let isThereAnyTimeSlotAvailable =
                this.timeslots && this.timeslots.length;
              let isSelectedDateIsSameAsOfBookingDate = this.isDateSame(
                this.getBookingDate,
                this.selectedDate
              );
              let isStartEndTimeExist =
                this.getBookingStartTime && this.getBookingEndTime;
              if (
                isThereAnyTimeSlotAvailable &&
                isSelectedDateIsSameAsOfBookingDate &&
                isStartEndTimeExist
              ) {
                this.timeslots.forEach((timeslot, index) => {
                  if (
                    timeslot.start_time == this.getBookingStartTime &&
                    timeslot.end_time == this.getBookingEndTime
                  ) {
                    this.selectedTimeSlotIndex = index;
                    this.selectedTimeSlot = timeslot;
                  }
                });
              }
            } else {
              this.failureToast(response.message);
            }
          },
          (error) => {
            console.error(error);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    setSelectedTimeSlot(timeslot, index) {
      this.selectedTimeSlot = timeslot;
      this.selectedTimeSlotIndex = index;
    },
    bookAppointment() {
      if (this.selectedTimeSlotIndex == null) {
        this.failureToast(this.$t("doctorDetail.timeslot.notSelected"));
        return;
      }
      this.setBookingDate(this.selectedDate);
      this.setBookingTimeslot(this.selectedTimeSlot);
      this.setBookingStartTime(this.selectedTimeSlot.start_time);
      this.setBookingEndTime(this.selectedTimeSlot.end_time);
      if (this.getIsGuest) {
        this.navigateTo("Login");
        localStorage.setItem("url", "Doctor Details");
      } else if (this.getIsReschedule) {
        this.rescheduleAppointment();
      } else {
        this.createAppointment();
      }
    },
    selectionSame() {
      let selectedTimeSlot = this.timeslots[this.selectedTimeSlotIndex];
      this.selectedTimeSlot = selectedTimeSlot;
      return (
        this.selectedDate == this.getBookingDate &&
        selectedTimeSlot.start_time == this.getBookingStartTime &&
        selectedTimeSlot.end_time == this.getBookingEndTime
      );
    },
    rescheduleAppointment() {
      if (this.selectionSame()) {
        appointmentService
          .updateAppointment(
            this.getIsReschedule,
            this.selectedTimeSlot,
            this.getUserInfo.mrn_number,
            this.getBookingMethod,
            this.selectedDate
          )
          .then(
            (res) => {
              let response = res.data;
              if (response.status) {
                if (
                  this.isEligibleForCancelFreeAppt &&
                  this.isEligibleForCancelFreeAppt.appointment_id ==
                    this.getIsReschedule
                ) {
                  freeAppointmentPromoService
                    .fetchFreeActiveAppointmentPromos(
                      "?mrn_number=" + this.getUserInfo.mrn_number
                    )
                    .then((promoRes) => {
                      let promoResponse = promoRes.data;
                      if (promoResponse.status) {
                        this.updateUserInfo({
                          first_free_promo: promoResponse.data.items,
                        });
                        this.saveRescheduledAppointment(response);
                      } else {
                        this.failureToast(response.message);
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                      if (!this.isAPIAborted(err))
                        this.failureToast(
                          err.response &&
                            err.response.data &&
                            err.response.data.message
                        );
                    });
                } else {
                  this.saveRescheduledAppointment(response);
                }
              } else {
                this.failureToast(response.message);
              }
            },
            (error) => {
              console.error(error);
              if (!this.isAPIAborted(error))
                this.failureToast(
                  error.response &&
                    error.response.data &&
                    error.response.data.message
                );
            }
          );
      }
    },
    createAppointment() {
      appointmentService
        .createAppointment(
          this.getBookingMethod,
          this.getUserInfo,
          this.getBookingDoctor,
          this.getBookingDate,
          this.getBookingTimeslot,
          this.getBookingAmount
        )
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              this.saveAppointment(response);
            } else {
              this.failureToast(response.message);
            }
          },
          (error) => {
            console.error(error.response);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    saveAppointment(response) {
      let appointment = response.data.items[0];
      appointment.doctor = this.getBookingDoctor;
      this.setSelectedAppointment(appointment);
      let obj = {
        amount: appointment.amount,
        appointment_id: appointment.id,
        payLater: true,
      };
      this.setPaymentObject(obj);
      if (this.getBookingMethod == "home-healthcare") {
        this.setBookingMethod("onsite");
      }
      this.navigateTo("Book Appointment");
    },
    saveRescheduledAppointment(response) {
      let appointment_response = response.data.items[0];
      let operation_status = appointment_response.operation_status || "";
      if (operation_status.toLowerCase().includes("succeeded")) {
        let appointment = this.getSelectedAppointment;
        this.setSelectedAppointment(null);
        appointment.booked_date = response.data.items[0].booked_date;
        appointment.start_time = this.getBookingStartTime;
        appointment.end_time = this.getBookingEndTime;
        appointment.id = response.data.items[0].new_appointment_id;
        appointment.status = "unpaid";
        this.setSelectedAppointment(appointment);
        let obj = {
          amount: appointment.amount,
          appointment_id: appointment.id,
          payLater: true,
        };
        this.setPaymentObject(obj);
      }
      this.successIconModal(
        this.$t("bookAppointment.modal.reschedule"),
        this.$t(
          appointment_response[this.getLocaleKey("message")] ||
            "bookAppointment.modal.rescheduleText"
        )
      ).then(() => {
        if (this.isEligibleForFreeAppt) {
          this.navigateTo("Book Appointment");
        } else {
          this.resetBookAppointment();
          this.navigateTo("Appointment Detail");
        }
      });
    },
  },
  beforeDestroy() {
    if (this.getIsReschedule) {
      this.setIsReschedule(false);
    }
    this.setBookingNearestDate(null);
  },
};
</script>

<style lang="scss" scoped>
.doctor-rating :deep(.vue-star-rating-rating-text) {
  display: none !important;
}

.doctor-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.doctor-rating > span {
  cursor: pointer;
  color: var(--theme-secondary);
}

.doctor-rating > span:hover {
  cursor: pointer;
  color: #55b047;
}

.flag {
  width: 2.5rem;
}

.booking-date ::v-deep .btn-light {
  color: #343a40 !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.custom-login-input-groups {
  padding: 0.4rem 0.7rem;

  &::before {
    opacity: 1;
    z-index: 0;
    background-color: transparent;
    border: 1px solid #707070;
    border-radius: 5px;
  }

  #datepicker-placeholder__outer_ {
    padding: 0;
  }

  max-width: 22.875rem;
}
.rating-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: auto;
    position: relative;
    .star {
        width: 2rem;
        height: 2rem;
        min-width: 2rem;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #d8d8d8;
    }
    &:not(.disable-hover) {
        &:hover .star {
            color: #55b047;

        }
        .star:hover ~ .star {
            color: #d8d8d8;
        }
    }
    .star.active {
      color: #55b047;
    }
}
.rating-container {
  .star {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    font-size: 1.5rem;
  }

  .rating-filled {
    position: absolute;
    display: flex;
    overflow: hidden;
    left: 0;
  }
}

.rtl .rating-filled {
  flex-direction: row-reverse;
}

</style>
