import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const insuranceService = {
    fetchInsurances,
    fetchInsuranceServices,
    addNewInsurace
}

function fetchInsurances(id) {
    return axios({
        method: apiPath.insurance.fetch(id).method,
        url: apiPath.insurance.fetch(id).url,
    })
}
function fetchInsuranceServices() {
    return axios({
        method: apiPath.insurance.servies.method,
        url: apiPath.insurance.servies.url,
    })
}

function addNewInsurace(insurance) {
    return axios({
        method: apiPath.insurance.addNew.method,
        url: apiPath.insurance.addNew.url,
        data: insurance
    })
}