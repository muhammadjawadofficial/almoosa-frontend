import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const patientService = {
    fetchCriticalCare,
    fetchInPatients
}

function fetchCriticalCare(query) {
    return axios({
        method: apiPath.patient.criticalCare(query).method,
        url: apiPath.patient.criticalCare(query).url,
    })
}

function fetchInPatients(id) {
    return axios({
        method: apiPath.patient.inPatients(id).method,
        url: apiPath.patient.inPatients(id).url,
    })
}