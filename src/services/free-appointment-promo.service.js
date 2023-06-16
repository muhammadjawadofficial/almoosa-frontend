import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const freeAppointmentPromoService = {
    fetchFreeActiveAppointmentPromos
}

function fetchFreeActiveAppointmentPromos(query) {
    return axios({
        method: apiPath.freeAppointmentPromo.fetchActive(query).method,
        url: apiPath.freeAppointmentPromo.fetchActive(query).url,
    })
}