import Vue from "vue";
import { userService } from '../../services'

export default {
    namespaced: true,
    state: {
        loading: false,
        otp: "",
        userId: "",
        authState: "",
        userRole: "patient",
        notification: [],
        userInfo: null,
        isGuest: true,
        mainBanner: null
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
        setNotification({ commit }, data) {
            commit('SET_NOTIFICATION', data)
        },
        setUserInfo({ commit }, data) {
            commit('SET_USER_INFO', data)
        },
        removeUserInfo({ commit }) {
            commit('REMOVE_USER_INFO')
            commit('SET_IS_GUEST', true)
        },
        updateUserInfo({ commit }, data) {
            commit('UPDATE_USER_INFO', data)
        },
        setIsGuest({ commit }, data) {
            commit('SET_IS_GUEST', data)
        },
        setMainBanner({ commit }, data) {
            commit('SET_MAIN_BANNER', data)
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
        SET_NOTIFICATION(state, notification) {
            Vue.set(state, 'notification', [...state.notification, notification])
        },
        SET_USER_INFO(state, userInfo) {
            state.isGuest = userInfo == null;
            if (userService.getGuardianInfo()) {
                userInfo.isDependent = true;
            }
            Vue.set(state, 'userInfo', userInfo);
            userService.storeUserInfo(userInfo);
        },
        REMOVE_USER_INFO(state) {
            userService.removeBooking();
            userService.removeLoginInfo();
            userService.removeGuardianInfo();
            localStorage.removeItem("doctor");
            Vue.set(state, 'userInfo', null);
        },
        UPDATE_USER_INFO(state, userInfo) {
            Vue.set(state, 'userInfo', { ...state.userInfo, ...userInfo, id: state.userInfo.id });
            userService.storeUserInfo(state.userInfo);
        },
        SET_IS_GUEST(state, isGuest) {
            state.isGuest = isGuest
        },
        SET_MAIN_BANNER(state, mainBanner) {
            state.mainBanner = mainBanner
        },
    },
    getters: {
        getLoading: (state) => state.loading,
        getOtp: (state) => state.otp,
        getUserId: (state) => state.userId,
        getAuthState: (state) => state.authState,
        getUserRole: (state) => state.userRole,
        getNotification: (state) => state.notification,
        getUserInfo: (state) => state.userInfo,
        getIsGuest: (state) => state.isGuest,
        getMainBanner: (state) => state.mainBanner,
    }
};