import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedLabWork: null,
    },
    actions: {
        setSelectedLabWork({ commit }, data) {
            commit('SET_SELECTED_LAB_WORK', data)
        },
    },
    mutations: {
        SET_SELECTED_LAB_WORK(state, selectedLabWork) {
            Vue.set(state, 'selectedLabWork', selectedLabWork)
        },
    },
    getters: {
        getSelectedLabWork: (state) => state.selectedLabWork,
    }
};