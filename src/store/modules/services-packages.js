import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedPackage: null,
    },
    actions: {
        setSelectedPackage({ commit }, data) {
            commit('SET_SELECTED_PACKAGE', data)
        },
    },
    mutations: {
        SET_SELECTED_PACKAGE(state, selectedPackage) {
            Vue.set(state, 'selectedPackage', selectedPackage)
        },
    },
    getters: {
        getSelectedPackage: (state) => state.selectedPackage,
    }
};