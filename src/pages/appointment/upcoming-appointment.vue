<template>
  <div
    class="upcoming-appointment-container page-body-container standard-width"
  >
    <back-navigation :title="$t('modules.Upcoming Appointment')" />
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
                      <div class="appointment-time-time">
                        {{
                          removeSecondsFromTimeString(appointment.start_time)
                        }}
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
                            appointment[isDoctor ? "patient" : "doctor"]
                              .first_name +
                            (appointment[isDoctor ? "patient" : "doctor"]
                              .middle_name
                              ? " " +
                                appointment[isDoctor ? "patient" : "doctor"]
                                  .middle_name +
                                " "
                              : " ") +
                            appointment[isDoctor ? "patient" : "doctor"]
                              .family_name
                          }}
                        </div>
                        <div class="doctor-speciality" v-if="isDoctor">
                          <div>
                            {{ getPatientSubDetails(appointment.patient) }}
                          </div>
                        </div>
                        <div class="doctor-speciality" v-else>
                          {{ appointment.doctor.speciality.title }},
                          {{ appointment.doctor.location }}
                        </div>
                        <div class="appointment-status">
                          <div class="appointment-time-span">
                            {{
                              removeSecondsFromTimeString(
                                appointment.start_time
                              )
                            }}
                            -
                            {{
                              removeSecondsFromTimeString(appointment.end_time)
                            }}
                          </div>
                          <template v-if="isDoctor">
                            {{
                              getYears(appointment.patient.dob) +
                              " " +
                              $t("years")
                            }}
                          </template>
                          <template v-else>
                            {{ appointment.status }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="loading" v-if="appointmentStatus == 'loading'">
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
                      <div class="appointment-time-time">
                        {{
                          removeSecondsFromTimeString(appointment.start_time)
                        }}
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
                            appointment[isDoctor ? "patient" : "doctor"]
                              .first_name +
                            (appointment[isDoctor ? "patient" : "doctor"]
                              .middle_name
                              ? " " +
                                appointment[isDoctor ? "patient" : "doctor"]
                                  .middle_name +
                                " "
                              : " ") +
                            appointment[isDoctor ? "patient" : "doctor"]
                              .family_name
                          }}
                        </div>
                        <div class="doctor-speciality" v-if="isDoctor">
                          <div>
                            {{ getPatientSubDetails(appointment.patient) }}
                          </div>
                        </div>
                        <div class="doctor-speciality" v-else>
                          {{ appointment.doctor.speciality.title }},
                          {{ appointment.doctor.location }}
                        </div>
                        <div class="appointment-status success">
                          <div class="appointment-time-span">
                            {{
                              removeSecondsFromTimeString(
                                appointment.start_time
                              )
                            }}
                            -
                            {{
                              removeSecondsFromTimeString(appointment.end_time)
                            }}
                          </div>
                          <template v-if="isDoctor">
                            {{
                              getYears(appointment.patient.dob) +
                              " " +
                              $t("years")
                            }}
                          </template>
                          <template v-else>
                            {{ appointment.status }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="loading" v-if="appointmentStatus == 'loading'">
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
      if (status.toLowerCase() == "pending") return "warning";
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
      if (selected) return this.$t(selected) + " - " + patient[selected];
      return "";
    },
    getAppointments() {
      this.onsiteAppointments = [];
      this.virtualAppointments = [];
      let userIdQueryParam = this.isDoctor ? "doctor_id=" : "patient_id=";
      userIdQueryParam += this.getUserInfo.id;
      this.setLoadingState(true);
      appointmentService.getUpcomingAppointemnts(userIdQueryParam).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            data.forEach((item) => {
              if (item.type == "onsite") {
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
        () => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
          this.failureToast();
        }
      );
    },
  },
};
</script>

<style>
</style>