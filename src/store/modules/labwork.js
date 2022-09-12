import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedLabWork: null,
    },
    actions: {
        setSelectedLabWork({ commit }, data) {
            commit('SET_SELECTED_PROMOTION', data)
        },
    },
    mutations: {
        SET_SELECTED_PROMOTION(state, selectedLabWork) {
            Vue.set(state, 'selectedLabWork', selectedLabWork)
        },
    },
    getters: {
        getSelectedLabWork: (state) => state.selectedLabWork,
    }
};