import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const insuranceService = {
    fetchInsurances,
    fetchInsuranceServices,
    addNewInsurace
}

function fetchInsurances(id, type) {
    return axios({
        method: apiPath.insurance.fetch(id, type).method,
        url: apiPath.insurance.fetch(id, type).url,
    })
}
function fetchInsuranceServices(id) {
    return axios({
        method: apiPath.insurance.services(id).method,
        url: apiPath.insurance.services(id).url,
    })
}

function addNewInsurace(insurance) {
    return axios({
        method: apiPath.insurance.addNew.method,
        url: apiPath.insurance.addNew.url,
        data: insurance
    })
}