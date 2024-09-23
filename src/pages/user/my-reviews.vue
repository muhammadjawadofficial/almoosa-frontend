<template>
  <div
    class="radiology-report-doctors-container page-body-container standard-width"
  >
    <b-card
      header-tag="div"
      no-body
      class="ash-card card-wizard simple transparent"
    >
      <b-card-body class="py-0 px-3 mt-4">
        <div class="appointment-list">
          <div
            class="appointment-list-item"
            v-for="(appointment, index) in reportAppointments"
            :key="'upcoming-appointment-id' + index + appointment.id"
          >
            <div class="appointment-time">
              <div class="appointment-time-day">
                {{ getDate(appointment.booked_date) }}
              </div>
              <div class="appointment-time-day">
                {{ getYear(appointment.booked_date) }}
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
                <img
                  :src="getImageUrl(appointment.doctor.photo)"
                  alt="Doctor Avatar"
                />
              </div>
              <div class="appointment-details">
                <div class="doctor-name">
                  {{ getFullName(appointment.doctor, $t("dr")) }}
                </div>
                <div class="star-container">
                  <star-rating
                    :rating="appointment.rating"
                    :read-only="true"
                    :increment="0.5"
                    :star-size="20"
                  />
                </div>
                <div class="doctor-speciality">
                  {{ appointment.doctor[getLocaleKey("speciality")] || "N/A" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <button class="btn btn-tertiary" @click="cancelEditing">
      {{ $t("back") }}
    </button>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      reportAppointments: [
        {
          id: 1,
          doctor: {
            photo: "https://via.placeholder.com/50",
            speciality: "Cardiology",
            firstName: "John",
            lastName: "Doe",
          },
          booked_date: "2024-09-15T00:00:00Z", // ISO format date
          start_time: "2024-09-15T09:30:00Z", // ISO format time
          rating: 4.5, // Doctor's rating
        },
        {
          id: 2,
          doctor: {
            photo: "https://via.placeholder.com/50",
            speciality: "Neurology",
            firstName: "Jane",
            lastName: "Smith",
          },
          booked_date: "2024-09-20T00:00:00Z",
          start_time: "2024-09-20T14:00:00Z",
          rating: 4.0,
        },
        {
          id: 3,
          doctor: {
            photo: "https://via.placeholder.com/50",
            speciality: "Pediatrics",
            firstName: "Bob",
            lastName: "Johnson",
          },
          booked_date: "2024-09-22T00:00:00Z",
          start_time: "2024-09-22T16:30:00Z",
          rating: 4.8,
        },
      ],
    };
  },
  components: {
    StarRating,
  },
  methods: {
    cancelEditing() {
      this.navigateTo("default");
    },
    getImageUrl(photoUrl) {
      return photoUrl;
    },
    getFullName(doctor, title) {
      return `${title} ${doctor.firstName} ${doctor.lastName}`;
    },
    getLocaleKey(key) {
      // Implement your locale logic here
      return key;
    },
    getDate(date) {
      const options = { day: "numeric", month: "short" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    getYear(date) {
      return new Date(date).getFullYear();
    },
    getTimeFromDate(dateTime, showAmPm) {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: showAmPm,
      };
      return new Date(dateTime).toLocaleTimeString(undefined, options);
    },
  },
};
</script>

<style scoped>
.vue-star-rating :deep(.vue-star-rating-rating-text) {
  display: none !important;
}
</style>
