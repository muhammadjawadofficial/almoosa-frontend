import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const promotionService = {
    fetchPromotions,
    applyPromotions
}

function fetchPromotions() {
    return axios({
        method: apiPath.promotions.assigned.method,
        url: apiPath.promotions.assigned.url,
    })
}
function applyPromotions(data) {
    return axios({
        method: apiPath.promotions.apply.method,
        url: apiPath.promotions.apply.url,
        data,
    })
}