import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedSymptoms: null,
        survey: null
    },
    actions: {
        setSelectedSymptoms({ commit }, data) {
            commit('SET_SELECTED_SYMPTOMS', data)
        },
        setSurvey({ commit }, data) {
            commit('SET_SURVEY', data)
        },
        updateSurvey({ commit }, data) {
            commit('UPDATE_SURVEY', data)
        },
    },
    mutations: {
        SET_SELECTED_SYMPTOMS(state, selectedsymptoms) {
            Vue.set(state, 'selectedsymptoms', selectedsymptoms)
        },
        SET_SURVEY(state, survey) {
            Vue.set(state, 'survey', survey)
        },
        UPDATE_SURVEY(state, survey) {
            Vue.set(state, 'survey', {...state.survey, ...survey})
        },
    },
    getters: {
        getSelectedSymptoms: (state) => state.selectedsymptoms,
        getSurvey: (state) => state.survey,
    }
};