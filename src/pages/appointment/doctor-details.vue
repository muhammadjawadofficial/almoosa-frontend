<template>
  <div class="doctor-details-container">
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
                        disableDate="forward"
                      />
                    </div>
                    <div class="booking-time-slots">
                      <div class="tab-content-heading">
                        {{ $t("doctorList.timeSlots") }}
                      </div>
                      <div class="time-slots-container">
                        <div class="no-data" v-if="timeslots == null">
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
                          v-for="expertise in doctor[
                            getLocaleKey('expertise')
                          ].split(',')"
                          :key="'expertise-' + expertise.trim()"
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  appointmentService,
  freeAppointmentPromoService,
  userService,
} from "../../services";
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
      "getBookingNearestDate",
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
  },
  mounted() {
    if (!this.getBookingDoctor) {
      this.navigateTo("Doctor List");
    }
    this.isBookingFlow = ["Doctor Details", "Doctor Details Guest"].includes(
      this.$route.name
    );
    this.initializeData();
  },
  beforeDestroy() {
    this.setBookingNearestDate(null);
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
    ]),
    ...mapActions("user", ["updateUserInfo"]),
    initializeData() {
      this.doctor = this.getBookingDoctor;
      this.selectedDate = this.removeDateTime(
        this.getBookingNearestDate || this.getBookingDate
      );

      userService
        .getProfileById(this.getBookingDoctor.id)
        .then((res) => {
          let response = res.data;
          if (response.status) {
            let profile = response.data.items[0];
            if (profile) {
              this.doctor = {
                ...profile,
                id: this.getBookingDoctor.id,
                profile_photo_url: this.getBookingDoctor.profile_photo_url,
                speciality: this.getBookingDoctor.speciality,
                speciality_ar: this.getBookingDoctor.speciality_ar,
              };
            }
            if (this.doctor && this.isBookingFlow) {
              this.fetchTimeslots();
            }
          } else {
            this.failureToast(response.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    bookingDateChanged(val) {
      this.selectedDate = val;
      this.fetchTimeslots();
    },
    fetchTimeslots() {
      this.selectedTimeSlotIndex = null;
      appointmentService
        .fetchTimeslots(
          this.doctor.id,
          this.selectedDate,
          this.getBookingMethod
        )
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>