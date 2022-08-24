<template>
  <div class="main-dashboard-container">
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
            @click="findASpecialist('virtual')"
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
          <div class="consultation-section--blocks--single large tertiary">
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
          @click="navigateTo(item.link)"
        >
          <div v-if="item.unique" class="new-badge">
            <new-badge-svg />
          </div>
          <div class="title" v-html="$t('modules.' + item.text)"></div>
          <div class="icon">
            <component :is="item.icon" />
            <!-- <virtual-consultations-svg /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dashboardItems: [
        {
          text: "Check Symptoms",
          icon: "symptom-svg",
          unique: true
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
        },
        {
          text: "Lab Works",
          icon: "lab-svg",
        },
        {
          text: "Radiology Reports",
          icon: "user-report-svg",
        },
        {
          text: "My Medication",
          icon: "medical-jar-svg",
        },
        {
          text: "Medical Insurance",
          icon: "health-shield-svg",
        },
        {
          text: "My Timelines",
          icon: "timeline-svg",
        },
        {
          text: "Health Education",
          icon: "atom-svg",
        },
        {
          text: "View Promotions",
          icon: "promotions-svg",
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
    };
  },
  methods: {
    ...mapActions("user", ["setBookingMethod"]),
    findASpecialist(type) {
      if (type == "virtual") {
        this.setBookingMethod("virtual");
      } else {
        this.setBookingMethod("onsite");
      }
      this.navigateTo("Find Specialist");
    },
  },
};
</script>

<style lang="scss" scoped>
.main-banner {
  .background-image {
    position: relative;
    img {
      object-fit: cover;
      object-position: center;
      max-height: 500px;
    }
    .main-banner-text {
      position: absolute;
      text-align: start;
      font-size: 3.625rem;
      line-height: 4.25rem;
      color: #1e445c;
      opacity: 1;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 34rem;
    }
  }
  .consultation-section {
    transform: translateY(-50px);
    padding-block: 0;
    &--blocks {
      justify-content: center;
    }
  }
}
</style>