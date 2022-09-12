import Vue from "vue";
import Vuex from "vuex";
// import 'es6-promise/auto';
import layout from './modules/layout'
import menu from './modules/menu'
import user from './modules/user'
import appointment from './modules/appointment'
import promotion from './modules/promotion'
import labwork from './modules/labwork'
import radiologyReport from './modules/radiology-report'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    layout,
    menu,
    user,
    appointment,
    promotion,
    labwork,
    radiologyReport
  }
});

