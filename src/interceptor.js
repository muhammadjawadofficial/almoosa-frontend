import { axios, controller, source } from './services/axios';
import { userService } from './services';
import router from './router';


export default function setup({ dispatch }) {
    let requestsPending = 0;
    const req = {
        pending: () => {
            requestsPending++;
            dispatch(`user/setLoading`, true);
        },
        done: () => {
            requestsPending--;
            if (requestsPending <= 0) {
                dispatch(`user/setLoading`, false);
            }
        }
    };
    axios.interceptors.request.use(function (config) {
        req.pending();
        const token = userService.getToken();
        config.signal = controller.signal;
        config.cancelToken = source.token;
        config.headers['Accept-Language'] = userService.getStoredLang();
        config.headers['bypass-ash-deprecated-version'] = "true";
        config.headers['platform'] = "web"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (process.env.NODE_ENV !== "production") {
            config.headers['bypass-tunnel-reminder'] = true
        }
        return config;
    }, function (err) {
        req.done();
        return Promise.reject(err);
    });
    axios.interceptors.response.use(function (response) {
        req.done();
        checkAccess(response);
        return response;
    }, function (error) {
        req.done();
        checkAccess(error.response);
        return Promise.reject(error);
    })
}
function checkAccess(response) {
    if (response && response.status == 401 && !router.currentRoute.path.includes('auth')) {
        userService.removeLoginInfo();
        userService.removeGuardianInfo();
        router.push({ name: "Login Dashboard" })
    }
}