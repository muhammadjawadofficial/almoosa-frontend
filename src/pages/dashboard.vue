<template>
  <div class="main-dashboard-container" :class="{ 'standard-width': isDoctor }">
    <template v-if="isDoctor">
      <div class="consultation-section page-body-container">
        <div class="consultation-section--blocks no-sub-title">
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
            @click="navigateTo('Critical Results')"
          >
            <div class="title">
              {{ $t("modules.Critical Results") }}
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
        <div class="loading no-data" v-if="todayAppointments == null">
          {{ $t("dashboard.fetchingTodayAppointment") }}
        </div>
        <div class="no-data" v-else-if="!todayAppointments.length">
          {{ $t("dashboard.noData") }}
        </div>
        <template v-else>
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
              <div class="appointment-list">
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
                      {{
                        appointment.start_time
                          ? getTimeFromDate(appointment.start_time, true)
                          : ""
                      }}
                    </div>
                  </div>
                  <div class="appointment-card default">
                    <div class="doctor-avatar">
                      <img :src="getImageUrl(appointment.patient)" alt="" />
                    </div>
                    <div class="appointment-details">
                      <div class="doctor-name">
                        {{ getFullName(appointment.patient) }}
                      </div>
                      <div class="appointment-status">
                        <div class="appointment-time-span">
                          {{
                            appointment.start_time
                              ? getTimeFromDate(appointment.start_time, true) +
                                " - "
                              : ""
                          }}
                          {{
                            appointment.end_time
                              ? getTimeFromDate(appointment.end_time, true)
                              : ""
                          }}
                        </div>
                        {{
                          $t(
                            "bookAppointment." + appointment.type.toLowerCase()
                          )
                        }}
                      </div>
                      <button
                        class="btn btn-primary start-call-button"
                        v-if="appointment.type.toLowerCase() == 'virtual'"
                        @click="makeCall(appointment)"
                      >
                        {{ $t("startCall") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="main-banner">
        <div class="background-image" v-if="getMainBanner">
          <img
            :src="getImageUrl(getMainBanner.image)"
            alt="main-banner"
            class="img-fluid w-100"
          />
          <div class="standard-width">
            <div class="main-banner-text w600">
              {{ getMainBanner[getLocaleKey("text")] }}
            </div>
          </div>
        </div>
        <div class="consultation-section standard-width">
          <div
            class="consultation-section--blocks no-sub-title"
            :class="{ two: getUserInfo.isDependent }"
          >
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
                      "modules.description.Discover the best doctors in Almoosa Health Group"
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
                      "modules.description.Discover the best doctors in Almoosa Health Group"
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
              v-if="!getUserInfo.isDependent"
              @click="findSpecialist()"
            >
              <div class="title">
                {{ $t("modules.Find Specialist") }}
                <div class="sub-title">
                  {{
                    $t(
                      "modules.description.Discover the best doctors in Almoosa Health Group"
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
          <template v-for="(item, index) in dashboardItems">
            <div
              v-if="
                !getUserInfo.isDependent ||
                (getUserInfo.isDependent && item.guardianComponents)
              "
              class="consultation-section--blocks--single"
              :class="{ uniques: item.unique }"
              :key="'dashboard-item-' + index"
              @click="
                item.link
                  ? navigateTo(item.link, item.param, item.external)
                  : navigateTo('Coming Soon')
              "
            >
              <div v-if="item.unique" class="new-badge">
                <new-badge-svg />
              </div>
              <div class="title" v-html="$t('modules.' + item.text)"></div>
              <div class="icon">
                <component :is="item.icon" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService, userService } from "../services";
export default {
  data() {
    return {
      dashboardItems: [
        {
          text: "My Timelines",
          icon: "timeline-svg",
          link: "My Timeline",
          guardianComponents: true,
        },
        {
          text: "My Medications",
          icon: "medical-jar-svg",
          link: "My Medication",
        },
        {
          text: "Lab Works",
          icon: "lab-svg",
          link: "Lab Works",
          guardianComponents: true,
        },
        {
          text: "Radiology Reports",
          icon: "user-report-svg",
          link: "Radiology Report",
          guardianComponents: true,
        },
        {
          text: "Upcoming Appointment",
          icon: "calendar-svg",
          link: "Upcoming Appointment",
          param: { method: "onsite" },
          guardianComponents: true,
        },
        {
          text: "Medical Insurance",
          icon: "health-shield-svg",
          link: "Medical Insurance",
          guardianComponents: true,
        },
        {
          text: "Health Education",
          icon: "atom-svg",
          link: "Health Education",
        },
        {
          text: "Service & Package",
          icon: "briefcase-svg",
          link: "Services Packages",
        },
        {
          text: "View Family Member",
          icon: "family-svg",
          link: "Family Members",
        },
        {
          text: "View Promotions",
          icon: "promotions-svg",
          link: "Promotions",
        },
        {
          text: "Check Symptoms",
          icon: "symptom-svg",
          link: "Symptom Checker",
          unique: true
        },
        {
          text: "Virtual Tour",
          icon: "user-tag-svg",
          link: "Virtual Tour",
        },
      ],
      todayAppointments: null,
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
    this.fetchBanner();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo", "getMainBanner"]),
    ...mapGetters("appointment", ["getBookingMethod"]),
  },
  methods: {
    ...mapActions("appointment", ["setBookingMethod", "setDoctorsList"]),
    ...mapActions("user", ["setMainBanner"]),
    fetchBanner() {
      if (!this.getMainBanner) {
        let query = "?type=MAIN";
        userService.getBanner(query).then(
          (res) => {
            if (res.data.status) {
              let banner = res.data.data.items[0];
              if (banner) {
                this.setMainBanner(banner);
              }
            } else {
              this.failureToast(res.data.message);
            }
          },
          (error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
            console.error(error);
          }
        );
      }
    },
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
            this.todayAppointments = [];
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          this.todayAppointments = [];
          console.error(error);
        }
      );
    },
    makeCall(appointment) {
      this.navigateTo("Connect", {
        connectId: this.createRoomId(
          appointment.id,
          appointment.doctor_id,
          appointment.patient_id
        ),
        name: this.getFullName(this.getUserInfo),
      });
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