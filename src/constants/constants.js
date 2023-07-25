export default {
    loginByPassword: 1,
    loginByOTP: 2,
    auth: {
        login: "authLogin",
        register: "authRegister",
        forgotPassword: "forgotPassword",
        loginOtp: "authLoginOtp"
    },
    validation: {
        iqama: {
            min: 8,
            max: 15
        },
        saudi: {
            min: 10,
            max: 10
        },
        mrn: {
            min: 7,
            max: 7
        }
    }
}