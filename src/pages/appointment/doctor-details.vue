<template>
  <div class="doctor-details-container">
    <div class="doctor-details" v-if="getBookingDoctor">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img :src="getImageUrl(getBookingDoctor)" alt="doctor-image" />
            </div>
            <div class="doctor-details-card-header-right">
              <div class="doctor-details-card-header-right-info">
                <div class="doctor-details-card-header-right-info-name">
                  {{
                    getBookingDoctor.first_name +
                    (getBookingDoctor.middle_name
                      ? " " + getBookingDoctor.middle_name + " "
                      : " ") +
                    getBookingDoctor.family_name
                  }}
                </div>
                <div class="doctor-details-card-header-right-info-speciality">
                  {{ getBookingDoctor.speciality.title }}
                </div>
              </div>
              <div class="doctor-details-card-header-right-location">
                <location-svg />
                {{ getBookingDoctor.location }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="standard-width doctor-details-section">
        <div class="col-sm-12">
          <b-card
            header-tag="div"
            no-body
            class="ash-card card-wizard card-top-navigation"
          >
            <b-card-body>
              <b-tabs pills slot="header" class="tabbed-card">
                <b-tab title="Booking Details"> test </b-tab>
                <b-tab title="Clinics"> test </b-tab>
                <b-tab title="Work Experience"> test </b-tab>
              </b-tabs>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("user", ["getBookingDoctor"]),
  },
  methods: {
    getImageUrl(profile) {
      if (profile.photo) {
        return process.env.VUE_APP_SERVER + profile.photo.path;
      }
      return "../../assets/images/profile.png";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>