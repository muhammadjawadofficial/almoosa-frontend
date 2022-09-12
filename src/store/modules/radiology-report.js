import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedRadiologyReport: null,
    },
    actions: {
        setSelectedRadiologyReport({ commit }, data) {
            commit('SET_SELECTED_RADIOLOGY_REPORT', data)
        },
    },
    mutations: {
        SET_SELECTED_RADIOLOGY_REPORT(state, selectedRadiologyReport) {
            Vue.set(state, 'selectedRadiologyReport', selectedRadiologyReport)
        },
    },
    getters: {
        getSelectedRadiologyReport: (state) => state.selectedRadiologyReport,
    }
};