import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedSystemConfig: null,
        contactNumbers: {}
    },
    actions: {
        setSelectedSystemConfig({ commit }, data) {
            commit('SET_SELECTED_SYSTEM_CONFIG', data)
        },
        setContactNumbers({ commit }, data) {
            commit('SET_CONTACT_NUMBERS', data)
        },
    },
    mutations: {
        SET_SELECTED_SYSTEM_CONFIG(state, selectedSystemConfig) {
            Vue.set(state, 'selectedSystemConfig', selectedSystemConfig)
        },
        SET_CONTACT_NUMBERS(state, contactNumbers) {
            Vue.set(state, 'contactNumbers', contactNumbers)
        },
    },
    getters: {
        getSelectedSystemConfig: (state) => state.selectedSystemConfig,
        getContactNumbers: (state) => state.contactNumbers,
    }
};