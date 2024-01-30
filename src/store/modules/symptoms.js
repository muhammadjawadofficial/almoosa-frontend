import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedSymptoms: null,
    },
    actions: {
        setSelectedSymptoms({ commit }, data) {
            commit('SET_SELECTED_SYMPTOMS', data)
        },
    },
    mutations: {
        SET_SELECTED_SYMPTOMS(state, selectedsymptoms) {
            Vue.set(state, 'selectedsymptoms', selectedsymptoms)
        },
    },
    getters: {
        getSelectedSymptoms: (state) => state.selectedsymptoms,
    }
};