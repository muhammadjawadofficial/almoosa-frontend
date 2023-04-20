<template>
  <div
    class="upcoming-appointment-container page-body-container standard-width"
  >
    <back-navigation
      :title="$t('upcomingAppointment.heading')"
      :subTitle="$t('upcomingAppointment.subHeading')"
    />
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
                          <div class="doctor-speciality">
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
                          <div class="doctor-speciality">
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
      this.setLoadingState(true);
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
          } else {
            this.failureToast(response.data.messsage);
          }
          this.appointmentStatus = null;
          this.setLoadingState(false);
        },
        (error) => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
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

<style>
</style>