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
import Multiselect from "vue-multiselect";
import vue2Dropzone from 'vue2-dropzone';
import "./components/svgIcons"
import OtpInput from "@bachdgvn/vue-otp-input";
import PxCard from './components/Pxcard.vue'

Vue.prototype.moment = moment

Vue.component("v-otp-input", OtpInput);
Vue.component(PxCard.name, PxCard)
Vue.component("vueDropzone", vue2Dropzone)
Vue.component('perpage', PerPage)
Vue.component('multiselect', Multiselect)

// Multi Language Add
import en from './locales/en.json';
import ar from './locales/ar.json';
import { defaultLocale, localeOptions } from './constants/config';

// Import Theme scss
import './assets/scss/app.scss'

import interceptor from './interceptor'
import { userService } from './services'
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
      restartEnabled: false
    }
  },
  methods: {
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
    successModal(title, confirmText) {
      this.$swal({
        text: title || this.$t('changesDone'),
        type: 'success',
        confirmButtonText: confirmText || this.$t("ok"),
        confirmButtonColor: "#4466f2"
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
    navigateTo(name) {
      this.$router.push({ name })
    },
    replaceTo(name) {
      this.$router.replace({ name })
    },
    getDate(dateString) {
      let date = moment(dateString);
      if (moment(date).isSame(new Date(), "day")) {
        return "Today";
      } else {
        return date.format("DD MMM");
      }
    },
    getTime(dateString) {
      return moment(dateString).format("HH:mm");
    },
    removeSeconds(timeString) {
      return timeString.slice(0, -3);
    },
    formatDate(date) {
      return moment(date).format('MMMM Do YYYY, h:mm A');
    },
    formatOnlyDate(date) {
      return moment(date).format('MMMM, D dddd');
    },
    formatDateForFindSpecialist(date) {
      return moment(date).format("YYYY-MM-DD")
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

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')