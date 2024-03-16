<template>
  <b-modal
    ref="changePassword"
    id="changePasswordCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
    @show="resetSelection"
  >
    <div
      class="swal2-container swal2-center swal-custom-icon-top-padding swal2-shown custom-swal2"
      style="overflow-y: auto"
    >
      <div
        aria-labelledby="swal2-title"
        aria-describedby="swal2-content"
        class="swal2-popup swal2-modal swal2-show"
        tabindex="-1"
        role="dialog"
        aria-live="assertive"
        aria-modal="true"
        style="display: flex"
      >
        <div class="swal2-header">
          <img
            class="swal2-image"
            src="../assets/images/m-info.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div class="swal2-content">
          <div id="swal2-content">
            <div class="row">
              <div class="col-md-12 text-start">
                <b-input-group class="custom-login-input-groups">
                  <b-form-input
                    v-model="oldPassword"
                    :state="oldPasswordState"
                    :placeholder="$t('header.oldPassword')"
                    type="password"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-12 text-start">
                <b-input-group class="custom-login-input-groups">
                  <b-form-input
                    v-model="newPassword"
                    :state="newPasswordState"
                    :placeholder="$t('header.newPassword')"
                    type="password"
                  ></b-form-input>
                </b-input-group>
              </div>
              <div class="col-md-12 text-start">
                <b-input-group class="custom-login-input-groups">
                  <b-form-input
                    v-model="confirmNewPassword"
                    :state="confirmNewPasswordState"
                    :placeholder="$t('header.confirmNewPassword')"
                    type="password"
                  ></b-form-input>
                </b-input-group>
              </div>
            </div>
          </div>
        </div>
        <div class="swal2-actions">
          <button
            type="button"
            class="swal2-confirm swal2-styled"
            aria-label=""
            style="
              display: inline-block;
              background-color: rgb(68, 102, 242);
              border-left-color: rgb(85, 176, 71);
              border-right-color: rgb(85, 176, 71);
            "
            @click="changePassword"
          >
            {{ $t("header.changePassword") }}
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import { authService } from "../services";
export default {
  props: [],
  data() {
    return {
      oldPassword: "",
      oldPasswordState: null,
      newPassword: "",
      newPasswordState: null,
      confirmNewPassword: "",
      confirmNewPasswordState: null,
    };
  },
  watch: {},
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {},
  methods: {
    resetSelection() {
      this.oldPassword = "";
      this.oldPasswordState = null;
      this.newPassword = "";
      this.newPasswordState = null;
      this.confirmNewPassword = "";
      this.confirmNewPasswordState = null;
    },
    validateForm() {
      this.oldPasswordState = this.oldPassword != "";
      this.newPasswordState = this.newPassword != "";
      this.confirmNewPasswordState =
        this.confirmNewPassword != "" &&
        this.confirmNewPassword == this.newPassword;
      return (
        this.oldPasswordState &&
        this.newPasswordState &&
        this.confirmNewPasswordState
      );
    },
    changePassword() {
      if (!this.validateForm()) {
        return;
      }
      authService
        .changePassword({
          id: this.getUserInfo.id,
          currentPassword: this.oldPassword,
          password: this.newPassword,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.successToast(this.$t("passwordChangedSuccessfully"));
              this.$bvModal.hide("changePasswordCustomModal");
            } else {
              this.failureToast(response.data.message);
            }
          },
          (error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.text-start {
  text-align: start;
}
</style>