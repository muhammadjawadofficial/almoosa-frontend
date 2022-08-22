<template>
  <div class="appointment-detail-container page-body-container standard-width">
    <back-navigation
      backLink="Upcoming Appointment"
      title="Appointment Detail"
      subTitle="View your appointments history"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card
          header-tag="div"
          no-body
          class="ash-card bg-tertiary card-rounded"
        >
          <b-card-body class="mt-0">
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">Appointment</div>
                <div class="appointment-detail--value">{{ details.type }}</div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">Specialist</div>
                <div class="appointment-detail--value">
                  {{
                    details.doctor.first_name +
                    (details.doctor.middle_name
                      ? " " + details.doctor.middle_name + " "
                      : " ") +
                    details.doctor.family_name
                  }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">Medical Type</div>
                <div class="appointment-detail--value">Ortho</div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">Token</div>
                <div class="appointment-detail--value">4D</div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">Date & Time</div>
                <div class="appointment-detail--value">
                  {{ formatDate(details.booked_date) }}
                </div>
              </div>
              <div class="appointment-detail--action-buttons">
                <button class="btn btn-info appointment-detail--status">
                  Paid
                </button>
                <div class="appointment-detail--communication">
                  <button class="btn btn-primary">Join Call</button>
                  <button class="btn btn-secondary">Chat with Doctor</button>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button class="btn btn-outline-primary">Reschedule</button>
          <button class="btn btn-outline-danger">Cancel Appointment</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      details: null,
    };
  },
  mounted() {
    this.initializeAppointmentDetails();
  },
  methods: {
    ...mapActions("user", ["setSelectedAppointment"]),
    initializeAppointmentDetails() {
      this.details = this.getSelectedAppointment;
      if (!this.details) this.navigateTo("Upcoming Appointment");
    },
  },
  computed: {
    ...mapGetters("user", ["getSelectedAppointment"]),
  },
};
</script>

<style>
</style>