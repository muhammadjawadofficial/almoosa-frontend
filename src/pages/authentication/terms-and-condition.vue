<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("termsAndConditions.privacyPolicy") }}</div>
    <div class="sub-heading w200">
      {{ $t("termsAndConditions.mustAgree") }}
    </div>
    <div
      class="text"
      v-for="(terms, termIndex) in agreement"
      :key="getTitle(termIndex)"
    >
      <div class="text-heading" v-if="terms.title">
        {{ $t(getTitle(termIndex)) }}
      </div>
      <template v-if="terms.description">
        {{ $t(getDescription(termIndex)) }}
      </template>
      <template v-if="terms.points">
        <ul>
          <li
            v-for="(point, pointIndex) in terms.points"
            :key="getPoint(termIndex, pointIndex)"
          >
            {{ $t(getPoint(termIndex, pointIndex)) }}
            <ul v-if="point.sub">
              <li
                v-for="subPoint in point.sub"
                :key="getSubPoint(termIndex, pointIndex, subPoint)"
              >
                {{ $t(getSubPoint(termIndex, pointIndex, subPoint)) }}
              </li>
            </ul>
          </li>
        </ul>
      </template>
    </div>
    <div class="agree-terms">
      <div class="mt-5">
        <b-form-checkbox
          id="rememberMe"
          v-model="agreeTerms"
          :state="!submitted || agreeTerms == true"
          name="rememberMe"
          class="mt-3 custom-checkbox"
        >
          {{ $t("termsAndConditions.iAgree") }}
        </b-form-checkbox>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 button-group">
        <button class="btn btn-primary" @click="acceptTerms">
          {{ $t("continue") }}
        </button>
        <!-- <button class="btn btn-secondary" @click="logout">Logout</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { userService } from "../../services";
export default {
  data() {
    return {
      agreeTerms: false,
      submitted: false,
      agreement: [
        {
          description: "description",
        },
        {
          title: "title",
          points: [{ sub: 0 }, { sub: 3 }],
        },
        {
          title: "title",
          points: [{ sub: 0 }, { sub: 4 }, { sub: 0 }, { sub: 0 }, { sub: 0 }],
        },
        {
          title: "title",
          points: [{ sub: 4 }, { sub: 0 }, { sub: 0 }],
        },
        {
          title: "title",
          description: "description",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    this.setUserInfo(userService.currentUser());
    if (userService.currentUser().is_privacy_agreed || this.isDoctor) {
      this.navigateTo("default");
    }
  },
  methods: {
    ...mapActions("user", ["removeUserInfo"]),
    ...mapActions("user", ["updateUserInfo", "setUserInfo"]),
    getTitle(index) {
      return "termsAndConditions.sections.section" + index + ".title";
    },
    getDescription(index) {
      return "termsAndConditions.sections.section" + index + ".description";
    },
    getPoint(index, pointIndex) {
      return (
        "termsAndConditions.sections.section" +
        index +
        ".points.point" +
        (pointIndex + 1)
      );
    },
    getSubPoint(index, pointIndex, subPointIndex) {
      return (
        "termsAndConditions.sections.section" +
        index +
        ".points.point" +
        (pointIndex + 1) +
        "-" +
        subPointIndex
      );
    },
    validateFields() {
      return !!this.agreeTerms;
    },
    acceptTerms() {
      this.submitted = true;
      if (!this.validateFields()) {
        this.failureToast("Please Accept Privacy Policy");
        return;
      }
      this.updateProfileInfo({ is_privacy_agreed: true });
    },

    updateProfileInfo(data) {
      if (!this.getUserInfo) {
        this.navigateTo("Login Dashboard");
        return;
      }
      this.setLoadingState(true);
      userService.updateV1Profile(data).then(
        (res) => {
          if (res.data.status) {
            this.updateUserInfo({ ...data });
            this.navigateTo("default");
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },
    logout() {
      this.$root.$refs.appointmentModule &&
        this.$root.$refs.appointmentModule.destroyObjects();
      this.removeUserInfo();

      if (this.$messaging) {
        this.$messaging.deleteToken();
      }
      this.navigateTo({ name: "Login Dashboard" });
    },
  },
};
</script>

<style lang="scss" scoped>
.heading {
  text-transform: uppercase;
  font-size: 2.938rem;
  color: var(--theme-default);
  margin-bottom: 1rem;
  font-family: "DiodrumArabicSemiBold";
}
.sub-heading {
  font-size: 1.625rem;
  font-family: "DiodrumArabicSemiBold";
  color: black;
}
.text {
  font-size: 1rem;
  line-height: 2em;
  font-family: "DiodrumArabicMedium";
  color: black;
  margin-top: 1rem;
  .text-heading {
    font-size: 1.25rem;
    font-family: "DiodrumArabicBold";
    color: var(--theme-default);
    text-decoration: underline;
  }
  ul,
  ol {
    list-style: revert;
    padding-inline-start: 2rem;
  }
}
@media (max-width: 991px) {
  .login-card {
    padding-top: 1.25rem;
  }
  .heading {
    font-size: 1.5rem;
  }
  .sub-heading {
    font-size: 1rem;
  }
  .text {
    font-size: 0.938rem;
  }
}
@media (max-width: 525px) {
  .heading {
    font-size: 2rem;
  }
  .sub-heading {
    font-size: 1.25rem;
  }
  .text {
    font-size: 1.1rem;
  }
  .button-group {
    button {
      max-width: 100%;
      border-radius: 9px;
    }
  }
}
.button-group {
  margin-top: 3rem;
}
.custom-checkbox {
  :deep {
    input:checked {
      ~ label {
        &::before {
          border-color: var(--theme-default);
          background-color: var(--theme-default);
          border-radius: 3px;
        }
      }
    }
    label {
      font-size: 1rem;
      color: var(--theme-default);
      margin-inline-start: 0.5rem;
      cursor: pointer;
      &::after,
      &::before {
        width: 1.563rem;
        height: 1.563rem;
        top: 0;
        bottom: 0;
        left: -2rem;
        margin: auto;
        border-color: var(--theme-default) !important;
      }
    }
  }
}
</style>