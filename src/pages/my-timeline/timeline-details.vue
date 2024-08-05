<template>
  <div class="timeline-details-container page-body-container standard-width">
    <back-navigation
      :title="$t('myTimeline.details')"
      :backLink="'My Timeline List'"
    />
    <div class="row">
      <div class="col-lg-6">
        <div
          class="accordion mt-4"
          role="tablist"
          v-if="getSelectedTimeline || sections"
        >
          <b-card no-body class="transparent mb-2" v-if="getSelectedTimeline">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block variant="primary">
                <div>
                  <img src="../../assets/images/heart-beat.svg" alt="heart" />
                  {{ $t("appointmentDetail.medicalType") }}:
                  {{ getSelectedTimeline[getLocaleKey("department")] }}
                </div>
                <div class="info">
                  <img src="../../assets/images/hashtag.svg" alt="heart" />
                  {{ $t("appointmentDetail.token") }}:
                  {{ getSelectedTimeline.visit_no }}
                </div>
              </b-button>
            </b-card-header>
          </b-card>
          <template v-if="sections">
            <b-card
              no-body
              class="transparent mb-2"
              v-for="(section, index) in sections"
              :key="'section-' + index"
            >
              <b-card-header
                header-tag="header"
                class="p-1 accordion-tab"
                role="tab"
              >
                <b-button block v-b-toggle="'accordion-' + index">
                  {{ section.title || "N/A" }}
                  <div class="icon"></div>
                </b-button>
              </b-card-header>
              <b-collapse
                :id="'accordion-' + index"
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <template v-if="section.value.length">
                    <b-card-text
                      v-for="(subSections, sindex) in section.value"
                      :key="'sub-' + sindex"
                    >
                      <div
                        v-for="(subSection, index) in subSections"
                        :key="'value-' + index + subSection"
                      >
                        <div class="heading">{{ subSection.key }}</div>
                        <div class="description">
                          {{
                            subSection.key &&
                            subSection.key.toLowerCase().includes("date")
                              ? getLongDateAndTimeFromDate(subSection.value)
                              : subSection.value
                          }}
                        </div>
                      </div>
                    </b-card-text>
                  </template>
                  <template v-else>
                    <b-card-text>
                      <div class="description">
                        {{ $t("noData") }}
                      </div>
                    </b-card-text>
                  </template>
                </b-card-body>
              </b-collapse>
            </b-card>
            <b-card
              no-body
              class="transparent mb-2"
              v-if="
                sections &&
                sections.length &&
                getSelectedTimeline.episode_status == 'IP'
              "
            >
              <b-card-header
                header-tag="header"
                class="p-1 accordion-tab"
                role="tab"
              >
                <a
                  block
                  v-b-toggle="'accordion-9999'"
                  class="btn btn-primary"
                  v-if="dischargeSummaryAvailable"
                  :href="
                    reportUrl(
                      'discharge-summary',
                      dischargeReportParams(getSelectedTimeline)
                    )
                  "
                >
                  {{ $t("myTimeline.dischargeSummary") }}
                  <div class="icon"></div>
                </a>
                <a
                  block
                  v-b-toggle="'accordion-9999'"
                  class="btn btn-primary"
                  @click="showModal"
                  v-else
                >
                  {{ $t("myTimeline.dischargeSummary") }}
                  <div class="icon"></div>
                </a>
              </b-card-header>
            </b-card>
          </template>
        </div>
        <div v-else class="no-data mt-5">
          {{ $t("noData") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { medicalReportsService, timelineService } from "../../services";
export default {
  data() {
    return {
      timelineDetails: null,
      parsedDetails: null,
      sections: null,
      dischargeSummaryAvailable: false,
    };
  },
  computed: {
    ...mapGetters("myTimeline", ["getSelectedTimeline"]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    if (!this.getSelectedTimeline) {
      this.navigateTo("My Timeline List");
      return;
    }
    this.fetchTimelineDetails();
    if (this.getSelectedTimeline.episode_status == "IP") {
      this.checkDischargeSummary();
    }
  },
  methods: {
    checkDischargeSummary() {
      medicalReportsService
        .checkDischargeSummaryAvailability(
          `?${this.dischargeReportParams(this.getSelectedTimeline)}`
        )
        .then(
          (response) => {
            if (response.data.status) {
              this.dischargeSummaryAvailable = true;
            } else {
              this.dischargeSummaryAvailable = false;
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
    showModal() {
      this.failureIconModal(
        this.$t("myTimeline.dischargeSummaryNATitle"),
        this.$t("myTimeline.dischargeSummaryNAText"),
        "m-info"
      );
    },
    fetchTimelineDetails() {
      timelineService
        .fetchTimelineDetails(
          this.getUserInfo.mrn_number,
          this.getSelectedTimeline.id
        )
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              this.timelineDetails = data;
              if (data) {
                let sections = [];
                let excludeKeys = ["value", "treatment plan"];
                let parseHeading = (heading) => {
                  let parsed = heading || "";
                  parsed = heading.replaceAll("_", " ");

                  if (excludeKeys.includes(parsed.toLowerCase())) {
                    parsed = "";
                  }

                  return parsed;
                };
                data.forEach((item) => {
                  let section = {
                    title: item.title,
                    title_ar: item.title_ar,
                    value: [],
                  };
                  if (item.data.length) {
                    let sectionDataItemKeys = Object.keys(item.data[0]);
                    item.data.forEach((dataItem) => {
                      let subSection = [];
                      sectionDataItemKeys.forEach((key) => {
                        subSection.push({
                          key: parseHeading(key),
                          value: dataItem[key],
                        });
                      });
                      section.value.push(subSection);
                    });
                  }
                  sections.push(section);
                });
                this.sections = sections;
              }
            } else {
              this.failureToast(response.data.messsage);
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
    dischargeReportParams(timeline) {
      return `visit_no=${timeline.visit_no}&reportName=${timeline.episode_status}_${timeline.visit_no}_Discharge Summary`;
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion {
  .card {
    &:has(.not-collapsed) {
      .accordion-tab {
        .btn {
          background-color: var(--theme-secondary) !important;
          border-color: var(--theme-secondary) !important;
          color: var(--theme-tertiary);
          font-family: "DiodrumArabicSemiBold";
          .icon {
            transform: rotateZ(90deg);
          }
        }
      }
    }
    .card-header {
      .btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        gap: 1rem;
        border-radius: 12px;
        font-family: "DiodrumArabicSemiBold";
        cursor: default;
        > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }
    .accordion-tab {
      border-bottom: none;
      .btn {
        background-color: var(--theme-tertiary) !important;
        border-color: var(--theme-tertiary) !important;
        color: var(--theme-secondary);
        &.btn-primary {
          background-color: var(--theme-default) !important;
          border-color: var(--theme-default) !important;
          color: var(--white);
        }
        font-family: "DiodrumArabicMedium";
        cursor: pointer;
        .icon {
          &::before {
            content: "\F054";
          }
          transition: 0.2s transform;
          display: inline-block;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: 0.75em;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
        }
      }
    }
    .card-body {
      padding-block: 1rem;
      padding-inline: 1rem;
      .card-text {
        .heading {
          font-size: 1rem;
          color: var(--theme-default);
        }
        .description {
          font-size: 1rem;
          color: black;
          line-height: 1.2em;
          margin-bottom: 0.5em;
        }
      }
    }
  }
}
</style>