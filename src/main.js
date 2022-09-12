import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import Breadcrumbs from './components/bread_crumbs'
import BackNavigation from './components/back-navigation'
import { store } from './store';
import VueFeather from 'vue-feather';
import VueI18n from 'vue-i18n';
import VueSweetalert2 from 'vue-sweetalert2';
import Toasted from 'vue-toasted';
import VueApexCharts from 'vue-apexcharts';
import VueExcelXlsx from "vue-excel-xlsx";
import moment from 'moment'
import PerPage from "./components/per_page"
import ASHDatePicker from "./components/ash_datepicker"
import Multiselect from "vue-multiselect";
import vue2Dropzone from 'vue2-dropzone';
import "./components/svgIcons"
import OtpInput from "@bachdgvn/vue-otp-input";
import PxCard from './components/Pxcard.vue'


import VueAnalytics from 'vue-analytics';

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: 'G-TVYDCJG6GS',
  router,
  autoTracking: {
    screenview: true
  }
});

Vue.prototype.moment = moment

Vue.component("v-otp-input", OtpInput);
Vue.component(PxCard.name, PxCard)
Vue.component("vueDropzone", vue2Dropzone)
Vue.component('perpage', PerPage)
Vue.component('ash-datepicker', ASHDatePicker)
Vue.component('multiselect', Multiselect)

// Multi Language Add
import en from './locales/en.json';
import ar from './locales/ar.json';
import { defaultLocale, localeOptions } from './constants/config';

// Import Theme scss
import './assets/scss/app.scss'

import interceptor from './interceptor'
import { userService } from './services'
import { mapGetters } from 'vuex'
interceptor();

Vue.use(VueFeather);
Vue.use(BootstrapVue);
Vue.use(VueExcelXlsx);
Vue.use(VueI18n);
Vue.use(VueSweetalert2);
Vue.component('apexchart', VueApexCharts);
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});

Vue.mixin({
  data() {
    return {
      restartEnabled: false,
      checkRoleFromUser: false
    }
  },
  computed: {
    ...mapGetters("user", ["getUserRole"]),
    isDoctor() {
      let roleLS = this.getLSRole();
      let roleS = this.getUserRole;
      return (roleLS == 4 || (roleS && roleS.includes('doc')))
    },
  },
  watch: {
    "$i18n.locale": function (val) {
      moment.locale(val)
    }
  },
  methods: {
    getLSRole() {
      return !userService.isAuthenticatedUser() ? userService.getRole() : (this.checkRoleFromUser ? userService.getUserRole() : userService.getRole());
    },
    getImageUrl(profile) {
      if (profile && profile.photo) {
        return process.env.VUE_APP_SERVER + profile.photo.path;
      }
      return "/profile.png";
    },
    getLocaleKey: function (key, wordCase = "camel") {
      let postKey = this.$i18n.locale == "ar" ? "Ar" : "En";
      if (wordCase == "upper") {
        postKey = postKey.toUpperCase();
      } else if (wordCase == "lower") {
        postKey = postKey.toLowerCase();
      }
      return key + postKey;
    },
    getCurrentLang() {
      return this.$i18n.locale;
    },
    confirmModal(title, confirmText, cancelText) {
      return this.$swal({
        text: title || this.$t('areYouSure'),
        type: 'question',
        showCancelButton: true,
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
        cancelButtonText: cancelText || this.$t("cancel"),
        cancelButtonColor: "#4466f2",
      });
    },
    successModal(title, text, confirmText) {
      return this.$swal({
        title: title || this.$t('changesDone'),
        text: text || this.$t('changesDone'),
        type: 'success',
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
      });
    },
    confirmIconModal(title, text, icon = 'm-check', confirmText, cancelText) {
      const imagePath = require("./assets/images/" + icon + ".svg")
      return this.$swal({
        title: title || this.$t('areYouSure'),
        text: text || this.$t('areYouSure'),
        showCancelButton: true,
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
        cancelButtonText: cancelText || this.$t("cancel"),
        cancelButtonColor: "#4466f2",
        imageUrl: imagePath,
        customClass: {
          container: 'swal-custom-icon-top-padding theme-action-button',
        }
      });
    },
    inputIconModal(title, text, icon = 'm-check', type = 'text', confirmText, cancelText) {
      const imagePath = require("./assets/images/" + icon + ".svg")
      return this.$swal({
        input: type,
        inputPlaceholder: text,
        title: title || this.$t('areYouSure'),
        showCancelButton: true,
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
        cancelButtonText: cancelText || this.$t("cancel"),
        cancelButtonColor: "#4466f2",
        preConfirm: (inputVal) => {
          let trimInputVal = (inputVal + "").trim();
          let isValidInput = trimInputVal != '';
          if (!isValidInput) {
            this.$swal.showValidationMessage(
              this.$t('promotions.invalidPromo')
            )
          }

          return isValidInput && trimInputVal;
        },
        imageUrl: imagePath,
        customClass: {
          container: 'swal-custom-icon-top-padding theme-action-button',
        }
      });
    },
    successIconModal(title, text, icon = 'm-check', confirmText) {
      const imagePath = require("./assets/images/" + icon + ".svg")
      return this.$swal({
        title: title || this.$t('changesDone'),
        text: text || this.$t('changesDone'),
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
        imageUrl: imagePath,
        customClass: {
          container: 'swal-custom-icon-top-padding',
        }
      });
    },
    failureModal(title, confirmText) {
      this.$swal({
        text: title || this.$t('error.somethingWentWrong'),
        type: 'error',
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2"
      });
    },
    failureIconModal(title, text, icon = 'm-check', confirmText) {
      const imagePath = require("./assets/images/" + icon + ".svg")
      this.$swal({
        title: title || this.$t('error.somethingWentWrong'),
        text: text || this.$t('error.somethingWentWrong'),
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2",
        imageUrl: imagePath,
        customClass: {
          container: 'swal-custom-icon-top-padding',
        }
      });
    },
    successToast(message) {
      this.$toasted.show(message || this.$t("success"), {
        theme: "bubble",
        position: "top-right",
        type: "success",
        duration: 5000,
      });
    },
    failureToast(message) {
      this.$toasted.show(message || this.$t("error.somethingWentWrong"), {
        theme: "bubble",
        position: "top-right",
        type: "error",
        duration: 5000,
      });
    },
    setLoadingState(state) {
      this.$store.dispatch('user/setLoading', state);
    },
    download(url) {
      userService.downloadFile(url);
    },
    serverRestartRequired(flag = undefined) {
      if (flag == true) {
        localStorage.setItem('restartRequired', flag)
      } else if (flag == false) (
        localStorage.removeItem('restartRequired')
      )
      return localStorage.getItem('restartRequired')
    },
    navigateTo(name, params = null) {
      let obj = { name };
      if (params) {
        obj.params = params
      }
      this.$router.push(obj);
    },
    replaceTo(name) {
      this.$router.replace({ name })
    },
    getDate(dateString) {
      let date = moment(dateString);
      if (moment(date).isSame(new Date(), "day")) {
        return this.$t('header.today');
      } else {
        return date.format("DD MMM");
      }
    },
    getTimeFromDate(date, includeAmPm = false) {
      return moment(date).utc().format("hh:mm" + (includeAmPm ? " A" : ""));
    },
    removeSecondsFromTimeString(timeString, onlySplice = false, translate = true) {
      let timeArray = timeString.split(":");
      let hh = timeArray[0];
      let mm = timeArray[1];

      let withoutSeconds = hh + ":" + mm;
      if (onlySplice) {
        if (translate) {
          return this.translateNumber(withoutSeconds)
        }
        return withoutSeconds;
      }
      let parsedString = "";

      if (hh >= 0 && +hh < 12) {
        if (+hh == 0) {
          hh = '12';
        }
        parsedString = hh + ":" + mm + "AM"
      } else {
        if (hh > 12) {
          hh = hh - 12;
        }
        hh = '' + hh;
        if (hh.split("").length < 2) {
          hh = '0' + hh
        }
        parsedString = hh + ":" + mm + "PM"
      }
      return this.translateNumber(parsedString);
    },
    dateFormatter(date, format = 'MMMM Do YYYY, h:mm A', utc = false) {
      if (utc) {
        return moment(date).utc().format(format);
      }
      return moment(date).format(format);
    },
    formatLongDayDateFromDate(date, utc = true) {
      return this.dateFormatter(date, 'dddd, MMMM DD', utc);
    },
    formatDate(date) {
      return this.dateFormatter(date, "DD-MM-YYYY")
    },
    getLongMonthDayFromDate(date) {
      return this.dateFormatter(date, 'MMMM, D dddd')
    },
    getLongDateFromDate(date) {
      return this.dateFormatter(date, 'D MMMM YYYY')
    },
    getLongDateAndTimeFromDate(date, utc = false) {
      return this.dateFormatter(date, 'DD MMMM YYYY - hh:mm A', utc)
    },
    getShortDateFromDate(date, separator = "-") {
      return this.dateFormatter(date, "YYYY" + separator + "MM" + separator + "DD")
    },
    formatNotificationTime(date, utc = false) {
      return this.dateFormatter(date, 'MMMM YYYY - hh:mm A', utc)
    },
    isDateSame(date1, date2) {
      let fdate1 = this.formatDate(new Date(date1));
      let fdate2 = this.formatDate(new Date(date2));
      return fdate1 == fdate2;
    },
    getYears(date) {
      return moment().diff(date, 'years')
    },
    translateNumber(num) {
      let strNum = num + '';
      // e.g., 12:00AM
      if (this.getCurrentLang() == "ar") {
        let ar = '٠١٢٣٤٥٦٧٨٩'.split('');
        let en = '0123456789'.split('');
        if (strNum.includes("PM")) {
          strNum = strNum.replace("PM", "")
          strNum = "م" + strNum;
        }
        if (strNum.includes("AM")) {
          strNum = strNum.replace("AM", "")
          strNum = "ص" + strNum;
        }
        let strArray = strNum.split("");
        let translateString = "";
        strArray.forEach(character => {
          if (en.includes(character)) {
            translateString += ar[en.indexOf(character)]
          } else {
            translateString += character;
          }
        })
        return translateString;
        // return translateString.split("").reverse().join("");
      }
      return strNum;
    },
    isAllowedToCall(date, start, end) {
      let minutes = 1000 * 60;

      let startTime = start.split(":");
      let endTime = end.split(":");

      let now = new Date().getTime();
      let bookDate = new Date(date);
      let bookDateWithStartTime = bookDate.setHours(startTime[0], startTime[1]);
      let bookDateWithEndTime = bookDate.setHours(endTime[0], endTime[1]);

      let bookDateWithStartTimeMili = new Date(bookDateWithStartTime).getTime();
      let bookDateWithEndTimeMili = new Date(bookDateWithEndTime).getTime();

      let allowedStartLimit = bookDateWithStartTimeMili - (15 * minutes);
      let allowedEndLimit = bookDateWithEndTimeMili;

      return now > allowedStartLimit && now < allowedEndLimit;
    }
  },
})

Vue.component('Breadcrumbs', Breadcrumbs)
Vue.component('back-navigation', BackNavigation)

const messages = { en: en, ar: ar };
const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true
});

// config for firebase
import firebaseMessaging from './firebase'
Vue.prototype.$messaging = firebaseMessaging

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')