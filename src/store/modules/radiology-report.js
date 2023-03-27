import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedRadiologyReportSession: null,
        selectedRadiologyReport: null,
    },
    actions: {
        setSelectedRadiologyReportSession({ commit }, data) {
            commit('SET_SELECTED_RADIOLOGY_REPORT_SESSION', data)
        },
        setSelectedRadiologyReport({ commit }, data) {
            commit('SET_SELECTED_RADIOLOGY_REPORT', data)
        },
    },
    mutations: {
        SET_SELECTED_RADIOLOGY_REPORT_SESSION(state, selectedRadiologyReportSession) {
            Vue.set(state, 'selectedRadiologyReportSession', selectedRadiologyReportSession)
        },
        SET_SELECTED_RADIOLOGY_REPORT(state, selectedRadiologyReport) {
            Vue.set(state, 'selectedRadiologyReport', selectedRadiologyReport)
        },
    },
    getters: {
        getSelectedRadiologyReportSession: (state) => state.selectedRadiologyReportSession,
        getSelectedRadiologyReport: (state) => state.selectedRadiologyReport,
    }
};