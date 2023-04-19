import { axios, controller, source } from './services/axios';
import { userService } from './services';
import router from './router';


export default function setup() {
    axios.interceptors.request.use(function (config) {
        const token = userService.getToken();
        config.signal = controller.signal;
        config.cancelToken = source.token;
        config.headers['Accept-Language'] = userService.getStoredLang();
        config.headers['bypass_ash_deprecated_version'] = 'true';
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (process.env.NODE_ENV !== "production") {
            config.headers['bypass-tunnel-reminder'] = true
        }
        return config;
    }, function (err) {
        return Promise.reject(err);
    });
    axios.interceptors.response.use(function (response) {
        checkAccess(response);
        return response;
    }, function (error) {
        checkAccess(error.response);
        return Promise.reject(error);
    })
}
function checkAccess(response) {
    if (response && response.status == 401 && !router.currentRoute.path.includes('auth')) {
        userService.removeLoginInfo();
        router.push({ name: "Login Dashboard" })
    }
}