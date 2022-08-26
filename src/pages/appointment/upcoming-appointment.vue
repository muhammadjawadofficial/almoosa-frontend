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
              :value="activeTab"
            >
              <b-tab :title="$t('upcomingAppointment.virtual')">
                <div class="appointment-list">
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
                        {{ getTimeFromDate(appointment.booked_date, true) }}
                      </div>
                    </div>
                    <div
                      class="appointment-card"
                      @click="viewDetails(appointment)"
                      :class="getStatusClass(appointment.status)"
                    >
                      <div class="doctor-avatar">
                        <img :src="getImageUrl(appointment.doctor)" alt="" />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name">
                          {{
                            appointment.doctor.first_name +
                            (appointment.doctor.middle_name
                              ? " " + appointment.doctor.middle_name + " "
                              : " ") +
                            appointment.doctor.family_name
                          }}
                        </div>
                        <div class="doctor-speciality">
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
                          {{ appointment.status }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="loading" v-if="appointmentStatus == 'loading'">
                    Loading...
                  </div>
                  <div class="no-data" v-else-if="!virtualAppointments.length">
                    No Data To Show
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('upcomingAppointment.onsite')">
                <div class="appointment-list">
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
                        {{ getTimeFromDate(appointment.booked_date, true) }}
                      </div>
                    </div>
                    <div
                      class="appointment-card"
                      @click="viewDetails(appointment)"
                      :class="getStatusClass(appointment.status)"
                    >
                      <div class="doctor-avatar">
                        <img :src="getImageUrl(appointment.doctor)" alt="" />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name">
                          {{
                            appointment.doctor.first_name +
                            (appointment.doctor.middle_name
                              ? " " + appointment.doctor.middle_name + " "
                              : " ") +
                            appointment.doctor.family_name
                          }}
                        </div>
                        <div class="doctor-speciality">
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
                          {{ appointment.status }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="loading" v-if="appointmentStatus == 'loading'">
                    Loading...
                  </div>
                  <div class="no-data" v-else-if="!virtualAppointments.length">
                    No Data To Show
                  </div>
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
import { appointmentService, userService } from "../../services";
export default {
  data() {
    return {
      onsiteAppointments: [],
      virtualAppointments: [],
      appointmentStatus: "loading",
      activeTab: null,
    };
  },
  mounted() {
    this.getAppointments();
    this.checkScreenOffset();
  },
  computed: {
    ...mapGetters("user", ["getSelectedAppointment"]),
  },
  methods: {
    ...mapActions("user", ["setSelectedAppointment"]),
    checkScreenOffset() {
      let appointment = this.getSelectedAppointment;
      if (appointment) {
        this.activeTab = appointment.type == "onsite" ? 1 : 0;
      }
    },
    setActiveTab(x) {
      this.activeTab = x;
    },
    viewDetails(appointment) {
      this.setSelectedAppointment(appointment);
      this.navigateTo("Appointment Detail");
    },
    getImageUrl(profile) {
      if (profile.photo) {
        return process.env.VUE_APP_SERVER + profile.photo.path;
      }
      return "../../assets/images/profile.png";
    },
    getStatusClass(status) {
      if (status.toLowerCase() == "pending") return "warning";
      else if (status.toLowerCase() == "cancelled") return "danger";
      else return "success";
    },
    getAppointments() {
      this.appointmentStatus = "loading";
      this.onsiteAppointments = [];
      this.virtualAppointments = [];
      this.setLoadingState(true);
      appointmentService
        .getUpcomingAppointemnts(userService.currentUser().id)
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              data.forEach((item) => {
                if (item.type == "onsite") {
                  this.onsiteAppointments.push(item);
                } else {
                  this.virtualAppointments.push(item);
                }
                this.appointmentStatus = "success";
              });
            } else {
              this.failureToast(response.data.messsage);
              this.appointmentStatus = "error";
            }
            this.setLoadingState(false);
          },
          () => {
            this.appointmentStatus = "error";
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