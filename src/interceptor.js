import axios from 'axios';
import { userService } from './services';
import router from './router';

export default function setup() {
    axios.interceptors.request.use(function (config) {
        const token = userService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, function (err) {
        return Promise.reject(err);
    });
    axios.interceptors.response.use(function (response) {
        if(response.status == 401){
            userService.removeLoginInfo();
            router.push({name: "Login Dashboard"})
        }
        return response;
    }, function (error) {
        if(error.response.status == 401){
            userService.removeLoginInfo();
            router.push({name: "Login Dashboard"})
        }
        return Promise.reject(error);
    })
}