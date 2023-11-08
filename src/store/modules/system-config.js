import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedSystemConfig: null,
    },
    actions: {
        setSelectedSystemConfig({ commit }, data) {
            commit('SET_SELECTED_SYSTEM_CONFIG', data)
        },
    },
    mutations: {
        SET_SELECTED_SYSTEM_CONFIG(state, selectedSystemConfig) {
            Vue.set(state, 'selectedSystemConfig', selectedSystemConfig)
        },
    },
    getters: {
        getSelectedSystemConfig: (state) => state.selectedSystemConfig,
    }
};