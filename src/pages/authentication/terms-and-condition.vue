<template>
  <div class="login-card">
    <div class="heading w600">Privacy Policy</div>
    <div class="sub-heading w200">
      You must agree with the policies to use the App
    </div>
    <div class="text">
      It is a long established fact that a reader will be distracted by the
      readable content of a page when looking at its layout. The point of using
      Lorem Ipsum is that it has a more-or-less normal distribution of letters,
      as opposed to using 'Content here, content here', making it look like
      readable English. Many desktop publishing packages and web page editors
      now use Lorem Ipsum as their default model text, and a search for 'lorem
      ipsum' will uncover many web sites still in their infancy. Various
      versions have evolved over the years, sometimes by accident, sometimes on
      purpose (injected humour and the like).
    </div>
    <div class="text">
      It is a long established fact that a reader will be distracted by the
      readable content of a page when looking at its layout. The point of using
      Lorem Ipsum is that it has a more-or-less normal distribution of letters,
      as opposed to using 'Content here, content here', making it.
    </div>
    <div class="text">
      It is a long established fact that a reader will be distracted by the
      readable content of a page when looking at its layout. The point of using
      Lorem Ipsum is that it has a more-or-less normal distribution of letters,
      as opposed to using 'Content here, content here', making it look like
      readable English. Many desktop publishing packages and web page editors
      now use Lorem Ipsum as their default model text, and a search for 'lorem
      ipsum' will uncover many web sites still in their infancy. Various
      versions have evolved over the years, sometimes by accident, sometimes on
      purpose (injected humour and the like).
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
          I accept the terms and use
        </b-form-checkbox>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 button-group">
        <button class="btn btn-primary" @click="acceptTerms">Confinue</button>
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
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    this.setUserInfo(userService.currentUser());
  },
  methods: {
    ...mapActions("user", ["removeUserInfo"]),
    ...mapActions("user", ["updateUserInfo", "setUserInfo"]),
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
      userService.updateProfile(data).then(
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
          this.failureToast();
          console.error(error);
        }
      );
    },
    logout() {
      this.$root.$refs.appointmentModule &&
        this.$root.$refs.appointmentModule.destroyObjects();
      this.removeUserInfo();
      this.$messaging.deleteToken();
      this.navigateTo({ name: "Login Dashboard" });
    },
  },
};
</script>

<style lang="scss" scoped>
.heading {
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