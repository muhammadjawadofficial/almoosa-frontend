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
                        v-if="
                          appointment.type &&
                          appointment.status &&
                          appointment.is_appt_billed &&
                          appointment.type.toLowerCase() == 'virtual' &&
                          appointment.status.toLowerCase() == 'paid'
                        "
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
        <div class="background-image">
          <div class="carousel-inner" v-if="banners.length">
            <swiper class="swiper" :options="swiperOption" :slides-per-view="1">
              <swiper-slide v-for="slide in banners" :key="'slide-' + slide.id">
                <div class="carousel-item active">
                  <div
                    class="login-dashboard-slide"
                    :style="
                      '--background-image-url:url(' +
                      getImageUrl(slide.image) +
                      ')'
                    "
                  >
                    <div class="login-dashboard-slide--content">
                      <pre>{{ slide[getLocaleKey("text")] }}</pre>
                    </div>
                  </div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </div>
        <div class="consultation-section standard-width">
          <div
            class="consultation-section--blocks three no-sub-title justify-content-center"
            :class="{ one: getUserInfo.isDependent }"
          >
            <div
              class="consultation-section--blocks--single large primary flex-column-reverse"
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
              <div class="icon circle-shape">
                <on-site-svg />
              </div>
            </div>
            <div
              class="consultation-section--blocks--single large secondary flex-column-reverse"
              @click="findASpecialist('online')"
            >
              <!-- <div class="new-badge">
                <new-badge-svg />
              </div> -->
              <div class="title">
                {{ $t("modules.Remote Consultations") }}
                <div class="sub-title">
                  {{
                    $t(
                      "modules.description.Discover the best doctors in Almoosa Health Group"
                    )
                  }}
                </div>
              </div>
              <div class="icon circle-shape">
                <remote-consultation-svg />
              </div>
            </div>
            <div
              class="consultation-section--blocks--single large tertiary flex-column-reverse"
              @click="onSpotConsultation()"
            >
              <div class="title">
                {{ $t("modules.On-spot Consultations") }}
                <div class="sub-title">
                  {{
                    $t(
                      "modules.description.Discover the best doctors in Almoosa Health Group"
                    )
                  }}
                </div>
              </div>
              <div class="icon circle-shape">
                <on-spot-svg />
              </div>
            </div>
            <!-- <div
              class="consultation-section--blocks--single large flex-column-reverse"
              v-if="!getUserInfo.isDependent"
              @click="onSpotConsultation()"
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
            </div> -->
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
              v-if="!(getUserInfo.isDependent ^ item.dependentComponents)"
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
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      dashboardItems: [
        {
          text: "My Profile",
          icon: "username-svg",
          link: "Profile",
          unique: true,
        },
        {
          text: "My Timelines",
          icon: "timeline-svg",
          link: "My Timeline",
          dependentComponents: true,
        },
        {
          text: "My Medications",
          icon: "medical-jar-svg",
          link: "My Medication",
          dependentComponents: true,
        },
        {
          text: "Lab Works",
          icon: "lab-svg",
          link: "Lab Works",
          dependentComponents: true,
        },
        {
          text: "Radiology Reports",
          icon: "user-report-svg",
          link: "Radiology Report",
          dependentComponents: true,
        },
        {
          text: "Upcoming Appointment",
          icon: "calendar-svg",
          link: "Upcoming Appointment",
          param: { method: "onsite" },
          dependentComponents: true,
        },
        {
          text: "Medical Insurance",
          icon: "health-shield-svg",
          link: "Medical Insurance",
          dependentComponents: true,
        },
        {
          text: "Medical File",
          icon: "medical-file-svg",
          link: "Medical File",
          unique: true,
        },
        {
          text: "Health Education",
          icon: "atom-svg",
          link: "Health Education",
        },
        {
          text: "Packages",
          icon: "briefcase-svg",
          link: "Services Packages",
        },

        {
          text: "Home HealthCare",
          icon: "home-healthcare-svg",
          link: "Find Specialist",
          param: { method: "home-healthcare" },
        },
        {
          text: "View Family Member",
          icon: "family-svg",
          link: "Family Members",
        },
        {
          text: "Find Specialist",
          icon: "doctor-laptop-svg",
          link: "Find A Specialist",
        },
        {
          text: "View Promotions",
          icon: "promotions-svg",
          link: "Promotions",
        },
        {
          text: "Check Symptoms",
          icon: "symptom-svg",
          link: "Confirm Survey",
          unique: true,
        },
        {
          text: "Virtual Tour",
          icon: "user-tag-svg",
          link: "Virtual Tour",
        },
        {
          text: "Medical Reports",
          icon: "heart-report-svg",
          link: "Medical Sessions",
        },
        {
          text: "Sick Leave",
          icon: "hospital-svg",
          link: "Sick Leave",
        },
        {
          text: "Feedback",
          icon: "feedback-svg",
          link: "Feedback",
        },
      ],
      todayAppointments: null,
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: `.next-${this.id}`,
          prevEl: `.prev-${this.id}`,
        },
      },
      banners: [],
      showButtons: true,
      showSlider: false,
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
    this.fetchBanners();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo", "getMainBanner"]),
    ...mapGetters("appointment", ["getBookingMethod"]),
  },
  methods: {
    ...mapActions("appointment", [
      "setBookingMethod",
      "setDoctorsList",
      "setTeleConsultation",
      "setSelectedAppointment",
    ]),
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
    fetchBanners() {
      if (!this.banners.length) {
        let query = "?type=PROMOTIONAL";
        userService.getBanner(query).then(
          (res) => {
            if (res.data.status) {
              this.banners = res.data.data.items;
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
    onSpotConsultation() {
      this.navigateTo("OnSpot Lobby");
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
    async makeCall(appointment) {
      let teleConsultation = await appointmentService.joinTeleConsultation({
        appointment_id: appointment.id,
      });

      this.setSelectedAppointment(appointment);
      this.setTeleConsultation(teleConsultation.data.data);
      this.navigateTo("Connect Zoom Native");
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
.background-image {
  z-index: 0;
}
.circle-shape {
  width: 6.25rem;
  height: 6.25rem !important;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0px #00000040;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}
.swiper-container {
  border-radius: 1.25rem;
  .login-dashboard-slide {
    --background-image-url: url("../assets/images/login/slider/slide2.png");
    display: flex;
    align-items: center;
    // height: 188px;
    padding: 3rem 3rem 4rem;
    background: var(--background-image-url);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    aspect-ratio: 15 / 5;
    min-height: 12rem;
    @media (max-width: 660px) {
      padding: 1rem 2rem;
    }
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--background-image-url);
      background-position: center;
      background-repeat: repeat;
      background-size: contain;
      width: 100%;
      aspect-ratio: 15 / 5;
      filter: blur(10px);
      z-index: -1;
    }
    &--content {
      // width: 23.625rem;
      color: white;
      font-size: 2.563rem;
      line-height: 3.063rem;
      font-weight: bold;
      @media (max-width: 768px) {
        font-size: 2rem;
        line-height: 2rem;
      }
      pre {
        font: inherit;
        color: inherit;
        white-space: pre-line;
        padding: 0;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        background: transparent;
      }
    }
  }
  .swiper-pagination {
    :deep {
      .swiper-pagination-bullet {
        aspect-ratio: 1;
        height: 0.938rem;
        width: auto;
        background: white;
        opacity: 1;
        &-active {
          background: var(--theme-default);
        }
      }
    }
    left: 1rem;
    bottom: 1rem;
    width: fit-content;
  }
}
</style>
