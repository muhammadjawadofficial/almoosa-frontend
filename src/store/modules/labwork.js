import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedLabWork: null,
        selectedLabWorkReport: null,
    },
    actions: {
        setSelectedLabWork({ commit }, data) {
            commit('SET_SELECTED_LAB_WORK', data)
        },
        setSelectedLabWorkReport({ commit }, data) {
            commit('SET_SELECTED_LAB_WORK_REPORT', data)
        },
    },
    mutations: {
        SET_SELECTED_LAB_WORK(state, selectedLabWork) {
            Vue.set(state, 'selectedLabWork', selectedLabWork)
        },
        SET_SELECTED_LAB_WORK_REPORT(state, selectedLabWorkReport) {
            Vue.set(state, 'selectedLabWorkReport', selectedLabWorkReport)
        },
    },
    getters: {
        getSelectedLabWork: (state) => state.selectedLabWork,
        getSelectedLabWorkReport: (state) => state.selectedLabWorkReport,
    }
};