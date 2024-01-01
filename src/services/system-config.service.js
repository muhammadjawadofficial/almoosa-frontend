import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const systemConfigService = {
    fetchConfig,
};

function fetchConfig(query) {
    return axios({
        method: apiPath.systemConfig.fetchSystemConfig(query).method,
        url: apiPath.systemConfig.fetchSystemConfig(query).url
    })
}
