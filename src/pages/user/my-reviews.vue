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
            v-for="(appointment, index) in doctorAppointment"
            :key="'upcoming-appointment-id' + index + appointment.id"
          >
            <div class="appointment-time">
              <div class="appointment-time-day">
                {{ getDate(appointment.created_at) }}
              </div>
              <div class="appointment-time-day">
                {{ getYear(appointment.created_at) }}
              </div>
              <div class="appointment-time-time">
                {{
                  getTimeFromDate(appointment.created_at) || "N/A"
                }}
              </div>
            </div>
            <div class="appointment-card default">
              <div class="doctor-avatar">
                <img
                  :src="getImageUrl(appointment.rater_user)"
                  alt="Doctor Avatar"
                />
              </div>
              <div class="appointment-details">
                <div class="doctor-name">
                  {{ getFullName(appointment.rater_user) }}
                </div>
                <div class="star-container">
                  <div class="value">
                <div class="rating-container disable-hover m-0">
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div
                    class="rating-filled"
                    :style="
                      'width: ' +
                      ((appointment.rating_value || 0) / 5) * 100 +
                      '%'
                    "
                  >
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <div class="btn-container d-flex">
      <button class="btn btn-tertiary" @click="cancelEditing">
        {{ $t("back") }}
      </button>
      <button
        v-if="canLoadMore"
        class="btn btn-tertiary"
        @click="fetchRatings()"
      >
        {{ $t("loadMore") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService, userService } from "../../services";
export default {
  data() {
    return {
      canLoadMore: true,
      currentPage: 1,
      currentLimit: 4,
      totalRecords: 0,
      doctorAppointment: [],
    };
  },
  mounted() {
    this.fetchRatings();
  },
  methods: {
    fetchRatings() {
      const query = `?page=${this.currentPage++}&limit=${this.currentLimit}`;
      appointmentService.fetchCurrentDoctorRating(query).then(
        (res) => {
          let response = res.data;
          this.doctorAppointment = [
            ...this.doctorAppointment,
            ...response.data.items,
          ];
          this.totalRecords = response.data.total_records;

          if (this.doctorAppointment.length >= this.totalRecords) {
            this.canLoadMore = false;
          }
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    loadMore() {
      if (this.doctorAppointment.length < this.totalRecords) {
        this.fetchRatings(); 
      }
    },
    cancelEditing() {
      this.navigateTo("default");
    },
  },
};
</script>

<style scoped>
.vue-star-rating :deep(.vue-star-rating-rating-text) {
  display: none !important;
}

.btn-container {
  justify-content: flex-start;
  gap: 1rem;
}


.rating-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: auto;
    position: relative;
    .star {
        width: 2rem;
        height: 2rem;
        min-width: 2rem;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #d8d8d8;
    }
    &:not(.disable-hover) {
        &:hover .star {
            color: #55b047;
        }
        .star:hover ~ .star {
            color: #d8d8d8;
        }
    }
    .star.active {
        color: #55b047;
    }
}

.rating-container {
  .star {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    font-size: 1.5rem;
  }

  .rating-filled {
    position: absolute;
    display: flex;
    overflow: hidden;
    left: 0;
  }
}

.rtl .rating-filled {
  flex-direction: row-reverse;
}
</style>
