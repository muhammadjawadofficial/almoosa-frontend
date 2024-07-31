import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const systemConfigService = {
    fetchConfig,
    encryptMrn
};

function fetchConfig(query) {
    return axios({
        method: apiPath.systemConfig.fetchSystemConfig(query).method,
        url: apiPath.systemConfig.fetchSystemConfig(query).url
    })
}
function encryptMrn(mrn) {
    return axios({
        method: apiPath.systemConfig.encryptMrn(mrn).method,
        url: apiPath.systemConfig.encryptMrn(mrn).url
    })
}
