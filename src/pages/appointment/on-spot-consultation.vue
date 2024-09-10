<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation
      :backLink="'default'"
      :title="$t('doctorList.instructions')"
    />

    <div class="instruction-card-container py-5">
      <!-- <p>{{ $t('doctorList.instructions') }}</p> -->
      <p class="instruction-text">
        Please take a moment to thoroughly review the following instructions
        before proceeding. We highly encourage you to understand all the
        guidelines to ensure a smooth and seamless experience. By agreeing to
        these terms, you acknowledge that you are fully informed and prepared
        for the next steps. Keep in mind that this process is designed to
        provide you with a personalized, on-spot consultation call with one of
        our medical professionals. This call will offer expert advice and
        guidance tailored to your specific needs.
        <br /><br />
        It is important to note that by agreeing to the terms and conditions,
        you are confirming your commitment to the consultation process and
        agreeing to follow the protocols set forth. Failure to comply with these
        terms may result in delays or interruptions to your consultation. Should
        you have any questions or need further clarification, please feel free
        to contact our support team before proceeding.
        <br /><br />
        Your participation in this consultation call signifies your
        understanding of and agreement to these conditions. The purpose of this
        agreement is to facilitate a productive and beneficial consultation that
        meets your healthcare needs. Thank you for your cooperation and for
        taking the time to carefully review the terms. Please check the box
        below to confirm your agreement and proceed to schedule your
        consultation.
      </p>

      <b-form-checkbox
        id="agree-checkbox"
        v-model="agree"
        class="instruction-checkbox pb-4"
      >
        {{ $t("doctorList.agree") }}
      </b-form-checkbox>

      <button
        class="btn btn-primary make-appointment"
        :disabled="!agree"
        @click="openOnSpotModal()"
      >
        {{ $t("continue") }}
      </button>
    </div>

    <on-spot-modal @close="hideOnSpotModal" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService } from "../../services";
import onSpotModal from "./on-spot-modal.vue";
export default {
  data() {
    return {
      agree: false, 
    };
  },
  components: {
    "on-spot-modal": onSpotModal,
  },
  computed: {},
  mounted() {},
  watch: {},
  methods: {
    openOnSpotModal() {
      this.$bvModal.show("onSpotCustomModal");
    },
    hideOnSpotModal() {
      this.$bvModal.hide("onSpotCustomModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.instruction-text {
  font-size: 1rem;
  font-weight: 400 !important;
}
::v-deep .instruction-checkbox > .custom-control-label {
  font-size: 1rem !important;
  font-weight: 400 !important;
}
</style>
