import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedHealthEducation: null,
    },
    actions: {
        setSelectedHealthEducation({ commit }, data) {
            commit('SET_SELECTED_HEALTH_EDUCATION', data)
        },
    },
    mutations: {
        SET_SELECTED_HEALTH_EDUCATION(state, selectedHealthEducation) {
            Vue.set(state, 'selectedHealthEducation', selectedHealthEducation)
        },
    },
    getters: {
        getSelectedHealthEducation: (state) => state.selectedHealthEducation,
    }
};