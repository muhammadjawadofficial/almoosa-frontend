import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const promotionService = {
    fetchPromotions,
    applyPromotions,
    removePromo
}

function fetchPromotions(query = '') {
    return axios({
        method: apiPath.promotions.assigned(query).method,
        url: apiPath.promotions.assigned(query).url,
    })
}
function applyPromotions(data) {
    return axios({
        method: apiPath.promotions.apply.method,
        url: apiPath.promotions.apply.url,
        data,
    })
}
function removePromo() {
    return axios({
        method: apiPath.promotions.removePromo.method,
        url: apiPath.promotions.removePromo.url,
    })
}