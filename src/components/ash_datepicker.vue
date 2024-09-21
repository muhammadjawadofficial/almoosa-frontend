<template>
  <div
    class="custom-login-input-groups ash-datetime-container"
    :class="className"
  >
    <b-form-datepicker
      ref="custom-datepicker"
      :id="id || 'datepicker-placeholder'"
      :placeholder="placeholder || 'Select Date'"
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
      :date-disabled-fn="disableDateFunction"
      class="w200"
      @input="handleInput"
      @change="handleChange"
      @shown="datePickerOpened"
    >
      <template #button-content>
        <img src="../assets/images/datepicker.svg" alt="" />
      </template>
      <template #nav-prev-month>
        <div class="w-100" @click="emitViewChange">
          <i class="fa fa-angle-left"></i>
        </div>
      </template>
      <template #nav-next-month>
        <div class="w-100" @click="emitViewChange">
          <i class="fa fa-angle-right"></i>
        </div>
      </template>
      <template #nav-prev-year>
        <div class="w-100" @click="emitViewChange">
          <i class="fa fa-angle-double-left"></i>
        </div>
      </template>
      <template #nav-next-year>
        <div class="w-100" @click="emitViewChange">
          <i class="fa fa-angle-double-right"></i>
        </div>
      </template>
      <template #nav-this-month>
        <div class="w-100" @click="emitViewChange">
          <i class="fa fa-circle"></i>
        </div>
      </template>
    </b-form-datepicker>
  </div>
</template>

<script>
export default {
  props: [
    "date",
    "className",
    "placeholder",
    "id",
    "disableDate",
    "dateToCompare",
  ],
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
    dateToCompare(val) {
      this.disableCustomDates(val);
    },
  },
  methods: {
    disableCustomDates(val) {
      if (this.disableDate !== "custom") return;
      const currentDate = this.removeDateTime(new Date());
      const allDateElements = document.querySelectorAll("[data-date]");
      allDateElements.forEach((dateElement) => {
        const dateAttr = dateElement.getAttribute("data-date");
        if (dateAttr) {
          const isPastDate = dateAttr < currentDate;
          if (isPastDate) {
            dateElement.setAttribute("past-date", "true");
          } else {
            dateElement.removeAttribute("past-date");
          }
          const item = val.find((item) => item.date === dateAttr);
          if (item) {
            if (!item.availability) {
              dateElement.setAttribute("unavailable-date", "true");
            } else {
              dateElement.removeAttribute("unavailable-date");
            }
          } else {
            dateElement.removeAttribute("unavailable-date");
          }
        }
      });
    },
    handleInput(date) {
      this.$emit("input", date);
    },
    handleChange(date) {
      this.$emit("change", date);
    },
    getCurrentViewMonthYear() {
      const refValue = this.$refs["custom-datepicker"];
      const currentCalendarView = refValue.calendarYM;
      const datePartsArr = currentCalendarView.split("-");
      return {
        month: datePartsArr[1],
        year: datePartsArr[0],
      };
    },
    emitViewChange() {
      setTimeout(() => {
        const dateParts = this.getCurrentViewMonthYear();
        this.$emit("month-change", dateParts);
      }, 0);
    },
    isLTR() {
      return this.currentAppLang == "en";
    },
    isRTL() {
      return this.currentAppLang != "ar";
    },
    setLocale(locale) {
      let currentLocale = this.locales.find((x) => x.value.includes(locale));
      if (currentLocale) {
        this.locale = currentLocale.value;
      }
    },
    disableDateFunction(ymd, date) {
      let today = new Date();
      if (
        this.dateToCompare &&
        this.disableDate !== "custom" &&
        this.dateToCompare != ""
      ) {
        today = new Date(this.dateToCompare);
      }
      // 👇️ OPTIONAL!
      // This line sets the hour of the current date to midnight
      // so the comparison only returns `true` if the passed in date
      // is at least yesterday
      today.setHours(0, 0, 0, 0);
      if (this.disableDate == "forward") {
        return date < today;
      } else if (this.disableDate == "backward") {
        return date > today;
      } else if (this.disableDate == "custom") {
        if (!this.dateToCompare || !this.dateToCompare.length) {
          return true;
        }

        let findDate = this.dateToCompare.find((x) => {
          let dateItem = new Date(x.date);
          dateItem.setHours(0, 0, 0, 0);
          return dateItem.toISOString() == date.toISOString();
        });
        return findDate ? !findDate.availability : true;
      }
      return true;
    },
    datePickerOpened() {
      if (this.disableDate == "custom") {
        if (this.dateToCompare.length) {
          let date = this.dateToCompare[0].date;
          let dateParts = this.getMonthAndYear(date);

          let currentViewDateParts = this.getCurrentViewMonthYear();

          if (dateParts.month != currentViewDateParts.month) {
            this.emitViewChange();
          }
        } else {
          this.emitViewChange();
        }

        this.disableCustomDates(this.dateToCompare);
      }
    },
  },
};
</script>

<style lang="scss">
div[unavailable-date="true"] > span.btn.disabled {
  background-color: #f9d7d7 !important;
  box-shadow: none !important;
}
div[past-date="true"] > span.btn.disabled {
  background-color: #a9a9a9 !important;
  box-shadow: none !important ;
}
span.btn.disabled.focus {
  box-shadow: none !important;
}

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
        font-size: 1.25rem;
        padding: 0;
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
