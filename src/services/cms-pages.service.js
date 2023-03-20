import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const cmsPagesService = {
    fetchCmsPages,
}

function fetchCmsPages(query) {
    return axios({
        method: apiPath.cmsPages.fetch(query).method,
        url: apiPath.cmsPages.fetch(query).url,
    })
}