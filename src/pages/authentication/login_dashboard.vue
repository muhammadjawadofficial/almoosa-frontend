<template>
  <div class="login-dashboard">
    <div class="consultation-section">
      <div class="consultation-section--heading">
        Let's Consult With Our Specialist Today
      </div>
      <div class="consultation-section--blocks">
        <div
          class="consultation-section--blocks--single"
          :class="{ unique: item.unique }"
          v-for="(item, index) in dashboardItems"
          :key="'dashboard-item-' + index"
          @click="loadModule(item)"
        >
          <div v-if="item.unique" class="new-badge">
            <new-badge-svg />
          </div>
          <div class="title">{{ item.text }}</div>
          <div class="icon">
            <component :is="item.icon" />
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
          text: "Virtual Consultations",
          icon: "doctor-laptop-svg",
          link: "Find Specialist Guest",
          param: { method: "online" },
          unique: true,
        },
        {
          text: "On-site Consultations",
          icon: "doctor-svg",
          link: "Find Specialist Guest",
          param: { method: "onsite" },
        },
        {
          text: "Check Symptoms",
          icon: "symptom-svg",
        },
        {
          text: "Health Education",
          icon: "atom-svg",
          link: "Health Education Guest",
        },
        {
          text: "Virtual Tour",
          icon: "user-tag-svg",
        },
        {
          text: "Emergency Consultations",
          icon: "call-help-svg",
        },
        {
          text: "Contact Us",
          icon: "laptop-svg",
        },
        {
          text: "Find Specialist",
          icon: "heart-checkup-svg",
          link: "Find A Specialist Guest",
        },
      ],
    };
  },
  mounted() {
    if (this.getLSRole() == 4) {
      this.navigateTo("Login");
    }
    localStorage.removeItem("url");
    this.$root.$refs.appointmentModule &&
      this.$root.$refs.appointmentModule.destroyObjects(true);
  },
  methods: {
    ...mapActions("user", ["setUserRole"]),
    navigate(name) {
      this.navigateTo(name);
    },
    loadModule(item) {
      if (item.link) {
        if (item.param) {
          this.navigateTo(item.link, item.param);
        } else {
          this.navigateTo(item.link);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>