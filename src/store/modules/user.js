import Vue from "vue";

export default {
    namespaced: true,
    state: {
        loading: false,
        otp: "",
        userId: "",
        authState: "",
        userRole: "patient"
    },
    actions: {
        setLoading({ commit }, data) {
            commit('SET_LOADING', data)
        },
        setOtp({ commit }, data) {
            commit('SET_OTP', data)
        },
        setUserId({ commit }, data) {
            commit('SET_USER_ID', data)
        },
        setAuthState({ commit }, data) {
            commit('SET_AUTH_STATE', data)
        },
        setUserRole({ commit }, data) {
            commit('SET_USER_ROLE', data)
        },
    },
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_OTP(state, otp) {
            state.otp = otp;
        },
        SET_USER_ID(state, userId) {
            state.userId = userId;
        },
        SET_AUTH_STATE(state, authState) {
            state.authState = authState;
        },
        SET_USER_ROLE(state, userRole) {
            state.userRole = userRole;
        },
    },
    getters: {
        getLoading: (state) => state.loading,
        getOtp: (state) => state.otp,
        getUserId: (state) => state.userId,
        getAuthState: (state) => state.authState,
        getUserRole: (state) => state.userRole,
    }
};