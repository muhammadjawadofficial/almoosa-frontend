<template>
  <div class="timeline-details-container page-body-container standard-width">
    <back-navigation
      :title="$t('myTimeline.details')"
      :backLink="'My Timeline List'"
    />
    <div class="row">
      <div class="col-lg-6">
        <div class="accordion mt-4" role="tablist">
          <b-card no-body class="transparent mb-2">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block variant="primary">
                <div>
                  <img src="../../assets/images/heart-beat.svg" alt="heart" />
                  Medical Type: Ortho
                </div>
                <div class="info">
                  <img src="../../assets/images/hashtag.svg" alt="heart" />
                  Token: 4A
                </div>
              </b-button>
            </b-card-header>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header
              header-tag="header"
              class="p-1 accordion-tab"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-2>
                Chief Complaint (الشكوى الرئيسية)
                <div class="icon"></div>
              </b-button>
            </b-card-header>
            <b-collapse
              id="accordion-2"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-card-text>
                  <div class="heading">PROVISIONAL DIAGNOSIS CODE</div>
                  <div class="description">
                    Z00.0 - General medical examination(Primary)
                    <div class="status">Status: Active</div>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header
              header-tag="header"
              class="p-1 accordion-tab"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-3>
                Diagnosis & Plan (التشخيص والخطة)
                <div class="icon"></div>
              </b-button>
            </b-card-header>
            <b-collapse
              id="accordion-3"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-card-text>
                  <div class="heading">PROVISIONAL DIAGNOSIS CODE</div>
                  <div class="description">
                    Z00.0 - General medical examination(Primary)
                    <div class="status">Status: Active</div>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header
              header-tag="header"
              class="p-1 accordion-tab"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-4>
                Vital Signs (علامات حيوية)
                <div class="icon"></div>
              </b-button>
            </b-card-header>
            <b-collapse
              id="accordion-4"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-card-text>
                  <div class="heading">PROVISIONAL DIAGNOSIS CODE</div>
                  <div class="description">
                    Z00.0 - General medical examination(Primary)
                    <div class="status">Status: Active</div>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="transparent mb-2">
            <b-card-header
              header-tag="header"
              class="p-1 accordion-tab"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-5>
                Medication CPOE (دواء CPOE)
                <div class="icon"></div>
              </b-button>
            </b-card-header>
            <b-collapse
              id="accordion-5"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-card-text>
                  <div class="heading">PROVISIONAL DIAGNOSIS CODE</div>
                  <div class="description">
                    Z00.0 - General medical examination(Primary)
                    <div class="status">Status: Active</div>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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