<template>
  <div class="doctor-details-container">
    <div class="doctor-details" v-if="doctor">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img :src="getImageUrl(doctor.photo)" alt="doctor-image" />
            </div>
            <div class="doctor-details-card-header-right">
              <div class="doctor-details-card-header-right-info">
                <div class="doctor-details-card-header-right-info-name">
                  {{
                    doctor.first_name +
                    (doctor.middle_name
                      ? " " + doctor.middle_name + " "
                      : " ") +
                    doctor.family_name
                  }}
                </div>
                <div class="doctor-details-card-header-right-info-speciality">
                  {{ doctor.speciality.title }}
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
                      />
                    </div>
                    <div class="booking-time-slots" v-if="timeslots">
                      <div class="tab-content-heading">
                        {{ $t("doctorList.timeSlots") }}
                      </div>
                      <div class="time-slots-container">
                        <div
                          class="time-slot"
                          :class="{
                            disabled: timeslot.is_booked,
                            active: selectedTimeSlot == index,
                          }"
                          v-for="(timeslot, index) in timeslots.all_slots"
                          :key="index + '-doctor-time-slot'"
                          @click="
                            timeslot.is_booked
                              ? null
                              : setSelectedTimeSlot(index)
                          "
                        >
                          {{ removeSecondsFromTimeString(timeslot.start_time) }}
                          -
                          {{ removeSecondsFromTimeString(timeslot.end_time) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab>
                <b-tab :title="$t('doctorDetail.tabs.clinic')">
                  <div class="appointment-list">
                    <div
                      class="appointment-list-item"
                      v-for="clinic in doctor.clinics"
                      :key="'doctor-' + doctor.id + 'clinic-' + clinic.id"
                    >
                      <div class="hospital-name">
                        {{ clinic.title }}
                      </div>
                      <div class="hospital-address">
                        {{ clinic.address }}
                      </div>
                    </div>
                  </div>
                </b-tab>
                <b-tab :title="$t('doctorDetail.tabs.experience')">
                  <div class="card-heading">
                    {{ $t("doctorDetail.aboutDoctor") }}
                  </div>
                  <div class="card-paragraph">
                    <div>
                      {{ $t("doctorDetail.degree") }}:
                      {{ doctor.degree || $t("noData") }}
                    </div>
                    <div>
                      {{ $t("doctorDetail.expertise") }}:
                      {{ doctor.expertise || $t("noData") }}
                    </div>
                    <div>
                      {{ $t("doctorDetail.nationality") }}:
                      {{ doctor.nationality.nationality || $t("noData") }}
                    </div>
                  </div>
                  <div class="appointment-list">
                    <div class="appointment-list-item">
                      <div class="hospital-name">
                        {{ $t("doctorDetail.languages") }}
                      </div>
                      <template v-if="doctor.language">
                        <div
                          class="hospital-address"
                          v-for="language in doctor.languages.split(',')"
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
                      <template v-if="doctor.consulting_age_group">
                        <div
                          class="hospital-address"
                          v-for="ageGroup in doctor.consulting_age_group.split(
                            ','
                          )"
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
import { appointmentService } from "../../services";
export default {
  data() {
    return {
      selectedDate: "",
      doctor: null,
      timeslots: null,
      selectedTimeSlot: null,
      neverShowLocation: true,
      isBookingFlow: false,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingDoctor",
      "getBookingDate",
      "getBookingStartTime",
      "getBookingEndTime",
      "getIsReschedule",
      "getSelectedAppointment",
      "getBookingMethod",
    ]),
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
    this.initializeData();
    this.isBookingFlow = ["Doctor Details", "Doctor Details Guest"].includes(
      this.$route.name
    );
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingStartTime",
      "setBookingEndTime",
      "setBookingDate",
      "setIsReschedule",
      "setSelectedAppointment",
      "resetBookAppointment",
    ]),
    initializeData() {
      this.doctor = this.getBookingDoctor;
      this.selectedDate = this.getBookingDate;
      if (this.doctor) {
        this.fetchTimeslots();
      }
    },
    bookingDateChanged(val) {
      this.selectedDate = val;
      this.fetchTimeslots();
    },
    fetchTimeslots() {
      this.selectedTimeSlot = null;
      this.setLoadingState(true);
      appointmentService.fetchTimeslots(this.doctor.id, this.selectedDate).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.timeslots = response.data.items[0];
            let isThereAnyTimeSlotAvailable =
              this.timeslots && this.timeslots.all_slots.length;
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
              let timeslot = this.timeslots.all_slots.findIndex((x) => {
                return (
                  x.start_time == this.getBookingStartTime &&
                  x.end_time == this.getBookingEndTime
                );
              });
              if (timeslot > -1) {
                this.selectedTimeSlot = timeslot;
              }
            }
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
    setSelectedTimeSlot(index) {
      this.selectedTimeSlot = index;
    },
    bookAppointment() {
      if (this.selectedTimeSlot == null) {
        this.failureToast(this.$t("doctorDetail.timeslot.notSelected"));
        return;
      }
      let selectedTimeSlot = this.timeslots.all_slots[this.selectedTimeSlot];
      this.setBookingDate(this.selectedDate);
      this.setBookingStartTime(selectedTimeSlot.start_time);
      this.setBookingEndTime(selectedTimeSlot.end_time);
      if (this.getIsGuest) {
        this.navigateTo("Login");
        localStorage.setItem("url", "Doctor Details");
      } else if (this.getIsReschedule) {
        if (this.selectionSame()) {
          this.setLoadingState(true);
          appointmentService
            .updateAppointment(
              this.getIsReschedule,
              this.selectedDate,
              this.removeSecondsFromTimeString(
                this.getBookingStartTime,
                true,
                false
              ),
              this.removeSecondsFromTimeString(
                this.getBookingEndTime,
                true,
                false
              )
            )
            .then(
              (res) => {
                let response = res.data;
                if (response.status) {
                  let appointment = this.getSelectedAppointment;
                  appointment.booked_date = this.getBookingDate;
                  appointment.start_time = this.getBookingStartTime;
                  appointment.end_time = this.getBookingEndTime;
                  this.successIconModal(
                    this.$t("bookAppointment.modal.reschedule"),
                    this.$t("bookAppointment.modal.rescheduleText")
                  ).then(() => {
                    this.resetBookAppointment();
                    this.navigateTo("Appointment Detail");
                  });
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
        }
      } else {
        this.navigateTo("Book Appointment");
      }
    },
    selectionSame() {
      let selectedTimeSlot = this.timeslots.all_slots[this.selectedTimeSlot];
      return (
        this.selectedDate == this.getBookingDate &&
        selectedTimeSlot.start_time == this.getBookingStartTime &&
        selectedTimeSlot.end_time == this.getBookingEndTime
      );
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