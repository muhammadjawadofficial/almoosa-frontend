import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedPromotion: null,
        promotionsList: null,
    },
    actions: {
        setSelectedPromotion({ commit }, data) {
            commit('SET_SELECTED_PROMOTION', data)
        },
        setPromotionsList({ commit }, data) {
            commit('SET_PROMOTIONS_LIST', data)
        },
    },
    mutations: {
        SET_SELECTED_PROMOTION(state, selectedPromotion) {
            Vue.set(state, 'selectedPromotion', selectedPromotion)
        },
        SET_PROMOTIONS_LIST(state, promotionsList) {
            Vue.set(state, 'promotionsList', promotionsList)
        },
    },
    getters: {
        getSelectedPromotion: (state) => state.selectedPromotion,
        getPromotionsList: (state) => state.promotionsList,
    }
};