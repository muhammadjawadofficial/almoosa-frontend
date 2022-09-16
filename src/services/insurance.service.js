import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const insuranceService = {
    fetchInsurances,
    addNewInsurace
}

function fetchInsurances(id) {
    return axios({
        method: apiPath.insurance.fetch(id).method,
        url: apiPath.insurance.fetch(id).url,
    })
}

function addNewInsurace(insurance) {
    return axios({
        method: apiPath.insurance.addNew.method,
        url: apiPath.insurance.addNew.url,
        data: insurance
    })
}