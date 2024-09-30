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
import moment from 'moment-timezone'
import PerPage from "./components/per_page"
import ASHDatePicker from "./components/ash_datepicker"
import Multiselect from "vue-multiselect";
import vue2Dropzone from 'vue2-dropzone';
import "./components/svgIcons"
import OtpInput from "@bachdgvn/vue-otp-input";
import PxCard from './components/Pxcard.vue'
import "@lottiefiles/lottie-player";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ar';
import 'vue2-datepicker/locale/en';
// import SocketPlugin from './plugins/socket';
import socket from './plugins/socket';
socket.install(Vue)

import VueAnalytics from 'vue-analytics';

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
  router,
  autoTracking: {
    screenview: true
  }
});
// Vue.use(SocketPlugin);

Vue.prototype.moment = moment

Vue.component("v-otp-input", OtpInput);
Vue.component(PxCard.name, PxCard)
Vue.component("vueDropzone", vue2Dropzone)
Vue.component('perpage', PerPage)
Vue.component('ash-datepicker', ASHDatePicker)
Vue.component('date-picker', DatePicker)
Vue.component('multiselect', Multiselect)

// Multi Language Add
import en from './locales/en.json';
import ar from './locales/ar.json';
import { defaultLocale, localeOptions } from './constants/config';

// Import Theme scss
import './assets/scss/app.scss'

import interceptor from './interceptor'
interceptor(store);

Vue.use(VueFeather);
Vue.use(BootstrapVue);
Vue.use(VueExcelXlsx);
Vue.use(VueI18n);
Vue.use(VueSweetalert2);
Vue.component('apexchart', VueApexCharts);
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});

import GlobalMixin from './mixins/_global-mixin'

Vue.mixin(GlobalMixin)

Vue.component('Breadcrumbs', Breadcrumbs)
Vue.component('back-navigation', BackNavigation)

const messages = { en: en, ar: ar };
const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'ar',
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