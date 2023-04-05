<template>
  <div class="appointment-detail-container page-body-container standard-width">
    <back-navigation
      backLink="Radiology Reports"
      :title="$t('reportDetails')"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card
          header-tag="div"
          no-body
          class="ash-card bg-tertiary card-rounded"
        >
          <b-card-body class="mt-0" v-if="details">
            <div class="appointment-detail">
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ details.title }}
                </div>
                <div class="appointment-detail--value">
                  {{ details.report_text }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("appointmentDetail.dateTime") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getLongDateAndTimeFromDate(details.dated, true) }}
                </div>
              </div>
              <div
                class="appointment-detail--action-buttons"
                v-if="details.result"
              >
                <button class="btn btn-info appointment-detail--status">
                  {{ details.result }}
                </button>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons" v-if="details.report_url">
          <button class="btn btn-outline-primary" @click="viewReport">
            {{ $t("viewReport") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      details: null,
    };
  },
  mounted() {
    this.details = this.getSelectedRadiologyReport;
    if (!this.details) {
      this.navigateTo("Radiology Reports");
    }
  },
  computed: {
    ...mapGetters("radiologyReport", ["getSelectedRadiologyReport"]),
  },
  methods: {
    viewReport(report) {
      window.open(this.details.report_url, "_blank");
    },
  },
};
</script>

<style scoped>
@media (min-width: 768px) {
  .appointment-detail {
    padding-inline-end: 8rem;
  }
}
</style>