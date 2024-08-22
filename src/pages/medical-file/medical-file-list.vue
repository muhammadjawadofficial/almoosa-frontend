<template>
  <div class="timeline-details-container page-body-container standard-width">
    <back-navigation :title="$t('medicalFile')" />
    <div class="row">
      <div class="col-lg-6">
        <div class="accordion mt-4" role="tablist">
          <b-card
            no-body
            class="transparent mb-2"
            v-for="(item, index) in items"
            :key="'medical-file-item-' + index"
          >
            <b-card-header
              header-tag="header"
              class="p-1 accordion-tab"
              role="tab"
            >
              <a
                block
                v-b-toggle="'accordion-9999'"
                class="btn btn-tertiary"
                @click="
                  item.link
                    ? navigateTo(item.link, item.param, item.external)
                    : navigateTo('Coming Soon')
                "
              >
                {{ $t("modules." + item.text) }}
                <div class="icon"></div>
              </a>
            </b-card-header>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: "My Timelines",
          icon: "timeline-svg",
          link: "My Timeline",
          guardianComponents: true,
        },
        {
          text: "My Medications",
          icon: "medical-jar-svg",
          link: "My Medication",
          guardianComponents: true,
        },
        {
          text: "Lab Works",
          icon: "lab-svg",
          link: "Lab Works",
          guardianComponents: true,
        },
        {
          text: "Radiology Reports",
          icon: "user-report-svg",
          link: "Radiology Report",
          guardianComponents: true,
        },
        {
          text: "Upcoming Appointment",
          icon: "calendar-svg",
          link: "Upcoming Appointment",
          param: { method: "onsite" },
          guardianComponents: true,
        },
        {
          text: "Medical Insurance",
          icon: "health-shield-svg",
          link: "Medical Insurance",
          guardianComponents: true,
        },
      ],
    };
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