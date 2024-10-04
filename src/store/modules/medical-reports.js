import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedTimeline: null,
    },
    actions: {
        setSelectedTimeline({ commit }, data) {
            commit('SET_SELECTED_TIMELINE', data)
        },
    },
    mutations: {
        SET_SELECTED_TIMELINE(state, selectedTimeline) {
            Vue.set(state, 'selectedTimeline', selectedTimeline)
        },
    },
    getters: {
        getSelectedTimeline: (state) => state.selectedTimeline,
    }
};