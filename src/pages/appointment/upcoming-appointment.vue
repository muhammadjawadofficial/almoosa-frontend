<template>
  <div
    class="upcoming-appointment-container page-body-container standard-width"
  >
    <div class="d-flex">
      <back-navigation
        :title="$t('upcomingAppointment.heading')"
        :subTitle="$t('upcomingAppointment.subHeading')"
        backLink="Medical File"
      />
      <div class="filters-dropdown" v-if="isDoctor">
        <span class="date-text">
          {{ $t("upcomingAppointment.date") }}
          <img src="../../assets/images/filter.svg" alt="" />
        </span>
        <div class="filters-dropdown-menu">
          <template v-if="true">
            <div style="display: flex">
              <div class="date-container" @click="showCalendar = !showCalendar">
                {{ $t("upcomingAppointment.from") }}:
                {{ fromDate || $t("upcomingAppointment.selectDate") }}
              </div>
              <div class="date-container" @click="showCalendar = !showCalendar">
                {{ $t("upcomingAppointment.to") }}:
                {{ toDate || $t("upcomingAppointment.selectDate") }}
              </div>
            </div>
            <date-picker
              :append-to-body="false"
              format="YYYY-MM-DD"
              v-model="dateRange"
              :popup-style="{ top: 'calc(100% - 5px)', left: 0, right: 0 }"
              popup-class="hideSecondCalendar"
              value-type="format"
              class="ash-datepicker"
              range
              :open="showCalendar"
              :lang="currentAppLang"
              @input="dateChange"
              :disabled-date="disabledBeforeTodayAndAfterAWeek"
              :clearable="fromDate != defaultStart && toDate != defaultEnd"
            >
              <template #icon-calendar>
                <img
                  src="../../assets/images/calendar.svg"
                  alt="Not Found"
                  style="width: 1rem; height: 1rem; object-fit: contain"
                />
              </template>
            </date-picker>
          </template>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card
          header-tag="div"
          no-body
          class="ash-card card-wizard card-top-navigation"
        >
          <b-card-body>
            <b-tabs
              pills
              slot="header"
              class="tabbed-card"
              @activate-tab="setActiveTab"
            >
              <b-tab
                :title="$t('upcomingAppointment.virtual')"
                :active="activeTab == 0"
              >
                <div
                  class="appointment-list"
                  :class="{
                    noData: !virtualAppointments || !virtualAppointments.length,
                  }"
                >
                  <div
                    class="appointment-list-item"
                    v-for="appointment in virtualAppointments"
                    :key="'upcoming-appointment-id' + appointment.id"
                  >
                    <div class="appointment-time">
                      <div class="appointment-time-day">
                        {{ getDate(appointment.booked_date) }}
                      </div>
                      <div class="appointment-time-day">
                        {{ getYear(appointment.booked_date) }}
                      </div>
                      <div class="appointment-time-time">
                        {{ getTimeFromDate(appointment.start_time, true) }}
                      </div>
                    </div>
                    <div
                      class="appointment-card"
                      @click="viewDetails(appointment)"
                      :class="
                        isDoctor
                          ? 'default'
                          : getStatusClass(appointment.status)
                      "
                    >
                      <div class="doctor-avatar">
                        <img
                          :src="
                            getImageUrl(
                              appointment[isDoctor ? 'patient' : 'doctor'].photo
                            )
                          "
                          alt=""
                        />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name">
                          {{
                            getFullName(
                              appointment[isDoctor ? "patient" : "doctor"],
                              isDoctor ? "" : $t("dr")
                            )
                          }}
                        </div>
                        <template v-if="isDoctor">
                          <div class="doctor-speciality">
                            <div>
                              {{ getPatientSubDetails(appointment.patient) }}
                            </div>
                          </div>
                          <div
                            class="doctor-speciality"
                            v-if="
                              appointment.patient && appointment.patient.gender
                            "
                          >
                            <div>
                              {{
                                $t("gender") +
                                ": " +
                                $t(appointment.patient.gender.toLowerCase())
                              }}
                            </div>
                          </div>
                        </template>
                        <div class="doctor-speciality" v-else>
                          {{ appointment.doctor[getLocaleKey("speciality")] }}
                          {{
                            appointment.doctor.location
                              ? ", " + appointment.doctor.location
                              : ""
                          }}
                          {{
                            !appointment.doctor.speciality &&
                            !appointment.doctor.location
                              ? "N/A"
                              : ""
                          }}
                        </div>
                        <div class="appointment-status">
                          <div class="appointment-time-span">
                            {{ getTimeFromDate(appointment.start_time, true) }}
                            -
                            {{ getTimeFromDate(appointment.end_time, true) }}
                          </div>
                          <template v-if="isDoctor">
                            {{
                              translateNumber(
                                getYears(appointment.patient.dob)
                              ) +
                              " " +
                              $t("years")
                            }}
                          </template>
                          <template v-else>
                            {{
                              $t(
                                "paymentStatus." +
                                  appointment.status.toLowerCase()
                              )
                            }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-data" v-if="appointmentStatus == 'loading'">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!virtualAppointments.length">
                  {{ $t("noData") }}
                </div>
              </b-tab>
              <b-tab
                :title="$t('upcomingAppointment.onsite')"
                :active="activeTab == 1"
              >
                <div
                  class="appointment-list"
                  :class="{ noData: !onsiteAppointments.length }"
                >
                  <div
                    class="appointment-list-item"
                    v-for="appointment in onsiteAppointments"
                    :key="'upcoming-appointment-id' + appointment.id"
                  >
                    <div class="appointment-time">
                      <div class="appointment-time-day">
                        {{ getDate(appointment.booked_date) }}
                      </div>
                      <div class="appointment-time-day">
                        {{ getYear(appointment.booked_date) }}
                      </div>
                      <div class="appointment-time-time">
                        {{ getTimeFromDate(appointment.start_time, true) }}
                      </div>
                    </div>
                    <div
                      class="appointment-card"
                      @click="viewDetails(appointment)"
                      :class="
                        isDoctor
                          ? 'default'
                          : getStatusClass(appointment.status)
                      "
                    >
                      <div class="doctor-avatar">
                        <img
                          :src="
                            getImageUrl(
                              appointment[isDoctor ? 'patient' : 'doctor'].photo
                            )
                          "
                          alt=""
                        />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name">
                          {{
                            getFullName(
                              appointment[isDoctor ? "patient" : "doctor"],
                              isDoctor ? "" : $t("dr")
                            )
                          }}
                        </div>
                        <template v-if="isDoctor">
                          <div class="doctor-speciality">
                            <div>
                              {{ getPatientSubDetails(appointment.patient) }}
                            </div>
                          </div>
                          <div
                            class="doctor-speciality"
                            v-if="
                              appointment.patient && appointment.patient.gender
                            "
                          >
                            <div>
                              {{
                                $t("gender") +
                                ": " +
                                $t(
                                  "register." +
                                    appointment.patient.gender.toLowerCase()
                                )
                              }}
                            </div>
                          </div>
                        </template>
                        <div class="doctor-speciality" v-else>
                          {{
                            appointment.doctor[getLocaleKey("speciality")] ||
                            appointment[getLocaleKey("speciality")]
                          }}
                          {{
                            appointment.doctor.location
                              ? ", " + appointment.doctor.location
                              : ""
                          }}
                          {{
                            !appointment.doctor.speciality &&
                            !appointment.doctor.location
                              ? "N/A"
                              : ""
                          }}
                        </div>
                        <div class="appointment-status success">
                          <div class="appointment-time-span">
                            {{ getTimeFromDate(appointment.start_time, true) }}
                            -
                            {{ getTimeFromDate(appointment.end_time, true) }}
                          </div>
                          <template v-if="isDoctor">
                            {{
                              translateNumber(
                                getYears(appointment.patient.dob)
                              ) +
                              " " +
                              $t("years")
                            }}
                          </template>
                          <template v-else>
                            {{
                              $t(
                                "paymentStatus." +
                                  appointment.status.toLowerCase()
                              )
                            }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-data" v-if="appointmentStatus == 'loading'">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!onsiteAppointments.length">
                  {{ $t("noData") }}
                </div>
              </b-tab>
            </b-tabs>
          </b-card-body>
        </b-card>
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
      onsiteAppointments: [],
      virtualAppointments: [],
      appointmentStatus: "loading",
      activeTab: null,
      showCalendar: false,
      fromDate: null,
      toDate: null,
      dateRange: null,
      defaultStart: null,
      defaultEnd: null,
      totalOnsiteAppointments: [],
      totalVirtualAppointments: [],
    };
  },
  watch: {
    $route: function (val) {
      this.activeTab = val.params.method;
    },
  },
  mounted() {
    this.getAppointments();
    this.checkScreenOffset();
    this.setSelectedAppointment(null);
    this.activeTab = this.$route.params.method == "online" ? 0 : 1;
  },
  computed: {
    ...mapGetters("appointment", ["getSelectedAppointment"]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    ...mapActions("appointment", ["setSelectedAppointment"]),
    checkScreenOffset() {
      let appointment = this.getSelectedAppointment;
      if (appointment) {
        this.activeTab = appointment.type == "onsite" ? 1 : 0;
      }
    },
    setActiveTab(x) {
      this.navigateTo("Upcoming Appointment", {
        method: x ? "onsite" : "online",
      });
    },
    viewDetails(appointment) {
      this.setSelectedAppointment(appointment);
      this.navigateTo("Appointment Detail");
    },
    getStatusClass(status) {
      if (status.toLowerCase() == "unpaid") return "warning";
      else if (status.toLowerCase() == "cancelled") return "danger";
      else return "success";
    },
    getPatientSubDetails(patient) {
      let selected = null;
      if (patient.mrn_number) {
        selected = "mrn_number";
      } else if (patient.saudi_id) {
        selected = "saudi_id";
      } else if (patient.iqama) {
        selected = "iqama";
      }
      if (selected)
        return (
          this.$t(selected) + ": " + this.translateNumber(patient[selected])
        );
      return "";
    },
    getAppointments() {
      this.onsiteAppointments = [];
      this.virtualAppointments = [];
      let userIdQueryParam = this.isDoctor
        ? "doctor_id=" + this.getUserInfo.id
        : "patient_id=" + this.getUserInfo.mrn_number;
      appointmentService.getUpcomingAppointemnts(userIdQueryParam).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            data.forEach((item) => {
              if (item.type.toLowerCase() == "onsite") {
                this.onsiteAppointments.push(item);
              } else {
                this.virtualAppointments.push(item);
              }
            });
            this.totalOnsiteAppointments = this.onsiteAppointments;
            this.totalVirtualAppointments = this.virtualAppointments;
          } else {
            this.failureToast(response.data.messsage);
          }
          this.appointmentStatus = null;
        },
        (error) => {
          this.appointmentStatus = null;
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    dateChange(val) {
      this.fromDate = val[0];
      this.toDate = val[1];

      if (!this.fromDate || this.toDate) {
        this.showCalendar = false;
      }
      if (this.fromDate && this.fromDate == this.toDate) {
        let date = new Date(this.toDate);
        date.setDate(date.getDate() + 1);
        this.toDate = this.dateFormatter(date, "YYYY-MM-DD", false, "en");
      }
      this.filterAppointments();
    },
    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today;
    },
    filterAppointments() {
      let filteredVirtualAppointments = this.totalVirtualAppointments;
      let filteredOnsiteAppointments = this.totalOnsiteAppointments;

      if (this.fromDate && this.toDate) {
        const date = (date) => new Date(date);
        const fromDate = date(this.fromDate);
        const toDate = date(this.toDate);
        const isAppointmentInRange = (bookedDate) =>
          date(bookedDate) >= fromDate && date(bookedDate) < toDate;

        filteredVirtualAppointments = this.totalVirtualAppointments.filter(
          (appointment) => isAppointmentInRange(appointment.booked_date)
        );
        filteredOnsiteAppointments = this.totalOnsiteAppointments.filter(
          (appointment) => isAppointmentInRange(appointment.booked_date)
        );
      }

      this.virtualAppointments = filteredVirtualAppointments;
      this.onsiteAppointments = filteredOnsiteAppointments;
    },
  },
};
</script>

<style lang="scss" >
.filters-dropdown-menu {
  right: unset;
}

.d-flex {
  justify-content: space-between;
}
</style>