<template>
  <div class="login-dashboard">
    <div class="carousel-inner">
      <swiper class="swiper" :options="swiperOption" :slides-per-view="1">
        <swiper-slide>
          <div class="carousel-item active">
            <div class="login-dashboard-slide">
              <div class="login-dashboard-slide--content">
                Help Millions People everywhere, everytime!
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="carousel-item active">
            <div class="login-dashboard-slide">
              <div class="login-dashboard-slide--content">
                Help Millions People everywhere, everytime!
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="carousel-item active">
            <div class="login-dashboard-slide">
              <div class="login-dashboard-slide--content">
                Help Millions People everywhere, everytime!
              </div>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <div class="login-dashboard-login-section">
      <div class="row">
        <div class="col-xl-6 col-lg-12 col-md-6 content w200">
          To browse your medical file and book appointments, please login or
          register now.
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6 button-group">
          <button class="btn btn-secondary" @click="navigate('Login')">
            Login
          </button>
          <button class="btn btn-primary" @click="navigate('Register')">
            Register
          </button>
        </div>
      </div>
    </div>

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
        >
          <div v-if="item.unique" class="new-badge">
            <new-badge-svg />
          </div>
          <div class="title">{{ item.text }}</div>
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
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { mapActions } from "vuex";
export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        // autoplay: {
        //   delay: 2500,
        //   disableOnInteraction: false,
        // },
        navigation: {
          nextEl: `.next-${this.id}`,
          prevEl: `.prev-${this.id}`,
        },
      },
      dashboardItems: [
        {
          text: "Virtual Consultations",
          icon: "doctor-laptop-svg",
          unique: true,
        },
        {
          text: "On-site Consultations",
          icon: "doctor-svg",
        },
        {
          text: "Check Symptoms",
          icon: "symptom-svg",
        },
        {
          text: "Health Education",
          icon: "atom-svg",
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
        },
      ],
    };
  },
  mounted() {
    if (this.getLSRole() == 4) {
      this.navigateTo("Login");
    }
  },
  methods: {
    ...mapActions("user", ["setUserRole"]),
    navigate(name) {
      this.navigateTo(name);
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper-container {
  border-radius: 1.25rem;
  .login-dashboard-slide {
    display: flex;
    align-items: center;
    // height: 188px;
    padding: 3rem 3rem 4rem;
    background: url("../../assets/images/login/slider/slide1.png");
    background-position: top right;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    &--content {
      width: 23.625rem;
      color: white;
      font-size: 2.563rem;
      line-height: 3.063rem;
      font-weight: bold;
    }
  }
  .swiper-pagination {
    ::v-deep {
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
    left: 3rem;
    bottom: 1.75rem;
    width: fit-content;
  }
}
.login-dashboard-login-section {
  padding: 1.5rem 2.5rem;
  background: var(--theme-tertiary);
  border-radius: 1rem;
  margin-top: 2.5rem;
  .content {
    color: var(--theme-secondary);
    font-size: 1.375rem;
    line-height: 2rem;
  }
  > .row {
    align-items: center;
    .content,
    .button-group {
      padding-block: 0.5rem;
    }
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      flex-wrap: wrap;
      button {
        flex: 1;
        max-width: 12.5rem;
        padding-block: 0.75rem;
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
}
</style>