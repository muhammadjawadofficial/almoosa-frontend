<template>
  <div
    class="custom-login-input-groups ash-datetime-container"
    :class="className"
  >
    <b-form-datepicker
      id="datepicker-placeholder"
      :placeholder="placeholder || 'Add DOB'"
      calendar-width="100%"
      v-model="content"
      v-bind="labels[locale] || {}"
      :locale="locale"
      :right="isLTR()"
      :isRTL="isRTL()"
      :date-format-options="{
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }"
      :hide-header="true"
      :date-disabled-fn="previousDateDisabled"
      show-decade-nav
      class="w200"
      @input="handleInput"
      @change="handleChange"
    >
      <template #button-content>
        <img src="../assets/images/datepicker.svg" alt="" />
      </template>
    </b-form-datepicker>
  </div>
</template>

<script>
export default {
  props: ["date", "className", "placeholder"],
  model: {
    prop: "date",
    event: "dateChanged",
  },
  data() {
    return {
      content: this.date,
      locales: [
        { value: "en-US", text: "English US (en-US)" },
        { value: "ar-EG", text: "Arabic Egyptian (ar-EG)" },
      ],
      locale: "en-US",
      labels: {
        "ar-EG": {
          weekdayHeaderFormat: "narrow",
          labelPrevDecade: "العقد السابق",
          labelPrevYear: "العام السابق",
          labelPrevMonth: "الشهر السابق",
          labelCurrentMonth: "الشهر الحالي",
          labelNextMonth: "الشهر المقبل",
          labelNextYear: "العام المقبل",
          labelNextDecade: "العقد القادم",
          labelToday: "اليوم",
          labelSelected: "التاريخ المحدد",
          labelNoDateSelected: "لم يتم اختيار تاريخ",
          labelCalendar: "التقويم",
          labelNav: "الملاحة التقويم",
          labelHelp: "استخدم مفاتيح المؤشر للتنقل في التواريخ",
        },
      },
    };
  },
  mounted() {
    this.setLocale(this.$i18n.locale);
  },
  watch: {
    date(val) {
      this.content = val;
    },
    content(val) {
      this.$emit("dateChanged", val);
    },
    "$i18n.locale": function (val) {
      this.setLocale(val);
    },
  },
  methods: {
    handleInput(date) {
      this.$emit("input", date);
    },
    handleChange(date) {
      this.$emit("change", date);
    },
    isLTR() {
      return this.getCurrentLang() == "en";
    },
    isRTL() {
      return this.getCurrentLang() != "ar";
    },
    setLocale(locale) {
      let currentLocale = this.locales.find((x) => x.value.includes(locale));
      if (currentLocale) {
        this.locale = currentLocale.value;
      }
    },
    previousDateDisabled(ymd, date) {
      const today = new Date();

      // 👇️ OPTIONAL!
      // This line sets the hour of the current date to midnight
      // so the comparison only returns `true` if the passed in date
      // is at least yesterday
      today.setHours(0, 0, 0, 0);

      return date < today;
    },
  },
};
</script>

<style lang="scss">
.ash-datetime-container {
  max-width: 22rem;
  z-index: 1;
  &.full-width {
    max-width: 100%;
  }
  &::before {
    opacity: 1;
  }
  .b-calendar {
    .b-calendar-inner {
      min-width: 15.625rem;
    }
    .b-calendar-grid-weekdays {
      font-size: 0.8rem;
      small {
        text-align: center;
      }
    }
    .b-calendar-grid-body .col[data-date] .btn {
      width: 2rem;
      height: 2rem;
      font-size: 0.875rem;
      line-height: 1;
      margin: 0.188rem auto;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .b-calendar-nav {
      button {
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 1rem;
            height: 1rem;
          }
        }
      }
    }
  }
}
body {
  &:not(.rtl) {
    .b-calendar {
      .b-calendar-nav {
        --test: 123;
        button:nth-last-child(-n + 3) {
          svg {
            g {
              g {
                transform: translate(0, 0) scale(-1);
              }
            }
          }
        }
      }
    }
  }
  &.rtl {
    .b-calendar {
      .b-calendar-nav {
        --test: 123;
        button:nth-child(-n + 3) {
          svg {
            g {
              g {
                transform: translate(0, 0) scale(-1);
              }
            }
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 575.98px) {
  .ash-datetime-container {
    max-width: 100%;
  }
}
</style>
