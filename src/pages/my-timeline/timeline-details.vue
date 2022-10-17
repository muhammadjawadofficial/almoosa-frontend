<template>
  <div class="timeline-details-container page-body-container standard-width">
    <back-navigation
      :title="$t('myTimeline.details')"
      :backLink="'My Timeline List'"
    />
    <div class="row">
      <div class="col-lg-6">
        <div class="accordion mt-4" role="tablist" v-if="parsedDetails">
          <b-card no-body class="transparent mb-2" v-if="parsedDetails.heading">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block variant="primary">
                <div>
                  <img src="../../assets/images/heart-beat.svg" alt="heart" />
                  {{ $t("appointmentDetail.medicalType") }}:
                  {{ parsedDetails.heading["Medical Type"] }}
                </div>
                <div class="info">
                  <img src="../../assets/images/hashtag.svg" alt="heart" />
                  {{ $t("appointmentDetail.token") }}:
                  {{ parsedDetails.heading["Token"] }}
                </div>
              </b-button>
            </b-card-header>
          </b-card>
          <template v-if="parsedDetails.sections">
            <b-card
              no-body
              class="transparent mb-2"
              v-for="(section, index) in parsedDetails.sections"
              :key="'section-' + index"
            >
              <b-card-header
                header-tag="header"
                class="p-1 accordion-tab"
                role="tab"
              >
                <b-button block v-b-toggle="'accordion-' + index">
                  {{ section.title }}
                  <div class="icon"></div>
                </b-button>
              </b-card-header>
              <b-collapse
                :id="'accordion-' + index"
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <b-card-text>
                    <div class="heading">{{ section.key }}</div>
                    <div class="description">
                      {{ section.value }}
                    </div>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
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
import { timelineService } from "../../services";
export default {
  data() {
    return {
      timelineDetails: null,
      parsedDetails: null,
    };
  },
  computed: {
    ...mapGetters("myTimeline", ["getSelectedTimeline"]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    this.fetchTimelineDetails();
  },
  methods: {
    fetchTimelineDetails() {
      this.setLoadingState(true);
      timelineService.fetchTimelineDetails(this.getSelectedTimeline.id).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items[0];
            this.timelineDetails = data;
            if (data) {
              let topHeading = data.sections[0];
              let bottomSections = data.sections[1].data;

              let parsedTopHeading = Object.keys(topHeading).map((x) => {
                return {
                  key: x,
                  value: topHeading[x],
                };
              });
              this.parsedDetails = {
                heading: topHeading,
                sections: bottomSections,
              };
            }
          } else {
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        () => {
          this.setLoadingState(false);
          this.failureToast();
        }
      );
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
      padding-block: 1.25rem 2rem;
      padding-inline: 1rem;
      .card-text {
        .heading {
          font-size: 1.25rem;
          color: var(--theme-default);
        }
        .description {
          font-size: 1rem;
          color: black;
          line-height: 1.2em;
          margin-top: 0.5em;
        }
      }
    }
  }
}
</style>