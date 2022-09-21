import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedMedication: null,
        selectedMedicationSession: null,
    },
    actions: {
        setSelectedMedication({ commit }, data) {
            commit('SET_SELECTED_MEDICATION', data)
        },
        setSelectedMedicationSession({ commit }, data) {
            commit('SET_SELECTED_MEDICATION_SESSION', data)
        },
    },
    mutations: {
        SET_SELECTED_MEDICATION(state, selectedMedication) {
            Vue.set(state, 'selectedMedication', selectedMedication)
        },
        SET_SELECTED_MEDICATION_SESSION(state, selectedMedicationSession) {
            Vue.set(state, 'selectedMedicationSession', selectedMedicationSession)
        },
    },
    getters: {
        getSelectedMedication: (state) => state.selectedMedication,
        getSelectedMedicationSession: (state) => state.selectedMedicationSession,
    }
};