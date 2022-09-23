<template>
  <div class="main-dashboard-container" :class="{ 'standard-width': isDoctor }">
    <template v-if="isDoctor">
      <div class="consultation-section page-body-container">
        <div class="consultation-section--blocks">
          <div
            class="consultation-section--blocks--single large secondary"
            @click="navigateTo('Upcoming Appointment', { method: 'online' })"
          >
            <div class="title">
              {{ $t("modules.View Appointments") }}
              <div class="sub-title">
                {{
                  $t(
                    "modules.description.View your complete upcoming appointments"
                  )
                }}
              </div>
            </div>
            <div class="icon small-icon">
              <calendar-fill-svg />
            </div>
          </div>
          <div
            class="consultation-section--blocks--single large primary"
            @click="navigateTo('InPatients')"
          >
            <div class="title">
              {{ $t("modules.View Inpatients") }}
              <div class="sub-title">
                {{
                  $t("modules.description.View your all inpatients data here")
                }}
              </div>
            </div>
            <div class="icon small-icon">
              <hospital-svg />
            </div>
          </div>
          <div
            class="consultation-section--blocks--single large tertiary"
            @click="navigateTo('Critical Care')"
          >
            <div class="title">
              {{ $t("modules.Critical Care") }}
              <div class="sub-title">
                {{
                  $t(
                    "modules.description.View your all critical outpatients data here"
                  )
                }}
              </div>
            </div>
            <div class="icon small-icon">
              <shield-svg />
            </div>
          </div>
        </div>
      </div>
      <div class="today-appointment-section">
        <template v-if="todayAppointments && todayAppointments.length">
          <div class="main-heading">
            {{ $t("dashboard.yourToday") }}
            {{ translateNumber("" + todayAppointments.length) }}
            {{ $t("dashboard.appointments") }}
          </div>
          <div class="sub-heading">
            {{ $t("dashboard.changeDate") }}
          </div>
          <b-card header-tag="div" no-body class="ash-card card-wizard">
            <b-card-body class="py-0 px-3">
              <div
                class="appointment-list"
                :class="{
                  noData: !todayAppointments || !todayAppointments.length,
                }"
              >
                <div
                  class="appointment-list-item"
                  v-for="appointment in todayAppointments"
                  :key="'upcoming-appointment-id' + appointment.id"
                >
                  <div class="appointment-time">
                    <div class="appointment-time-day">
                      {{ getDate(appointment.booked_date) }}
                    </div>
                    <div class="appointment-time-time">
                      {{ removeSecondsFromTimeString(appointment.start_time) }}
                    </div>
                  </div>
                  <div
                    class="appointment-card warning"
                    @click="viewDetails(appointment)"
                  >
                    <div class="doctor-avatar">
                      <img
                        :src="getImageUrl(appointment.patient.photo)"
                        alt=""
                      />
                    </div>
                    <div class="appointment-details">
                      <div class="doctor-name">
                        {{
                          appointment.patient.first_name +
                          (appointment.patient.middle_name
                            ? " " + appointment.patient.middle_name + " "
                            : " ") +
                          appointment.patient.family_name
                        }}
                      </div>
                      <div class="appointment-status">
                        <div class="appointment-time-span">
                          {{
                            removeSecondsFromTimeString(appointment.start_time)
                          }}
                          -
                          {{
                            removeSecondsFromTimeString(appointment.end_time)
                          }}
                        </div>
                        {{ $t("bookAppointment." + appointment.type) }}
                      </div>
                      <button
                        class="btn btn-primary start-call-button"
                        v-if="appointment.type == 'online'"
                        @click="makeCall(appointment)"
                      >
                        {{ $t("startCall") }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="loading" v-if="appointmentStatus == 'loading'">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!todayAppointments.length">
                  {{ $t("noData") }}
                </div>
              </div>
            </b-card-body>
          </b-card>
        </template>
        <template v-else>
          <div class="main-heading">
            {{ $t("dashboard.noData") }}
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="main-banner">
        <div class="background-image">
          <img
            src="../assets/images/banners/banner-main.png"
            alt="main-banner"
            class="img-fluid w-100"
          />
          <div class="standard-width">
            <div class="main-banner-text w600">
              {{ $t("dashboard.helpMillions") }}
            </div>
          </div>
        </div>
        <div class="consultation-section standard-width">
          <div class="consultation-section--blocks">
            <div
              class="consultation-section--blocks--single large secondary"
              @click="findASpecialist('online')"
            >
              <div class="new-badge">
                <new-badge-svg />
              </div>
              <div class="title">
                {{ $t("modules.Virtual Consultations") }}
                <div class="sub-title">
                  {{
                    $t(
                      "modules.description.Discover the best doctors in Almoosa Specialist Hospital"
                    )
                  }}
                </div>
              </div>
              <div class="icon">
                <doctor-laptop-svg />
              </div>
            </div>
            <div
              class="consultation-section--blocks--single large primary"
              @click="findASpecialist('onsite')"
            >
              <div class="title">
                {{ $t("modules.On-site Consultations") }}
                <div class="sub-title">
                  {{
                    $t(
                      "modules.description.Discover the best doctors in Almoosa Specialist Hospital"
                    )
                  }}
                </div>
              </div>
              <div class="icon">
                <doctor-svg />
              </div>
            </div>
            <div
              class="consultation-section--blocks--single large tertiary"
              @click="findSpecialist()"
            >
              <div class="title">
                {{ $t("modules.Find Specialist") }}
                <div class="sub-title">
                  {{
                    $t(
                      "modules.description.Discover the best doctors in Almoosa Specialist Hospital"
                    )
                  }}
                </div>
              </div>
              <div class="icon">
                <heart-checkup-svg />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="consultation-section standard-width large">
        <div class="consultation-section--pre-heading">
          {{ $t("dashboard.letsConsult") }}
        </div>
        <div class="consultation-section--heading two-tone">
          {{ $t("dashboard.withOurSpecialist") }}
        </div>
        <div class="consultation-section--blocks">
          <div
            class="consultation-section--blocks--single"
            :class="{ uniques: item.unique }"
            v-for="(item, index) in dashboardItems"
            :key="'dashboard-item-' + index"
            @click="navigateTo(item.link, item.param)"
          >
            <div v-if="item.unique" class="new-badge">
              <new-badge-svg />
            </div>
            <div class="title" v-html="$t('modules.' + item.text)"></div>
            <div class="icon">
              <component :is="item.icon" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../services";
export default {
  data() {
    return {
      dashboardItems: [
        {
          text: "Check Symptoms",
          icon: "symptom-svg",
          unique: true,
        },
        {
          text: "Add Family Member",
          icon: "family-svg",
          link: "Book Appointment",
        },
        {
          text: "Upcoming Appointment",
          icon: "calendar-svg",
          link: "Upcoming Appointment",
          param: { method: "online" },
        },
        {
          text: "Lab Works",
          icon: "lab-svg",
          link: "Lab Works",
        },
        {
          text: "Radiology Reports",
          icon: "user-report-svg",
          link: "Radiology Report",
        },
        {
          text: "My Medication",
          icon: "medical-jar-svg",
          link: "My Medication",
        },
        {
          text: "Medical Insurance",
          icon: "health-shield-svg",
          link: "Medical Insurance",
        },
        {
          text: "My Timelines",
          icon: "timeline-svg",
          link: "My Timeline",
        },
        {
          text: "Health Education",
          icon: "atom-svg",
          link: "Health Education",
        },
        {
          text: "View Promotions",
          icon: "promotions-svg",
          link: "Promotions",
        },
        {
          text: "Get Service & Package",
          icon: "briefcase-svg",
        },
        {
          text: "Emergency Consultations",
          icon: "call-help-svg",
        },
        {
          text: "Virtual Tour",
          icon: "user-tag-svg",
        },
      ],
      todayAppointments: [],
      appointmentStatus: "loading",
    };
  },
  mounted() {
    if (localStorage.getItem("url")) {
      this.navigateTo(localStorage.getItem("url"), {
        method: this.getBookingMethod,
      });
      localStorage.removeItem("url");
    }
    if (this.isDoctor) {
      this.getTodayAppointment();
    }

    this.$messaging
      .getToken({
        vapidKey:
          "BCBFdxeSbCZ_iyTTLUctA7WiZoN__DKtNJiHZFLuBKyoWRcNbiu95V5zLiYOBUBptIUXo-dD1kn8-Ws3dnPBVj8",
      })
      .then((currentToken) => {
        if (currentToken) {
          console.log("client token", currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("appointment", ["getBookingMethod"]),
  },
  methods: {
    ...mapActions("appointment", ["setBookingMethod", "setDoctorsList"]),
    findSpecialist() {
      this.navigateTo("Find A Specialist");
    },
    findASpecialist(type) {
      this.navigateTo("Find Specialist", { method: type });
    },
    getTodayAppointment() {
      appointmentService.getTodayAppointment(this.getUserInfo.id).then(
        (res) => {
          if (res.data.status) {
            this.todayAppointments = res.data.data.items;
          } else {
            this.failureToast(res.data.message);
          }
          this.appointmentStatus = null;
          this.setLoadingState(false);
        },
        (error) => {
          this.appointmentStatus = null;
          this.setLoadingState(false);
          console.error(error);
        }
      );
    },
    makeCall() {
      this.navigateTo("Connect");
    },
  },
};
</script>

<style lang="scss" scoped>
.main-dashboard-container {
  .ash-card {
    background: transparent;
    box-shadow: none;
  }
  .appointment-card {
    align-items: center !important;
  }
  .main-heading {
    font-size: 2.25rem;
    color: var(--theme-secondary);
  }
  .sub-heading {
    font-size: 1.25rem;
    color: var(--theme-default);
  }
  .today-appointment-section {
    margin-top: 2rem;
  }
}
</style>