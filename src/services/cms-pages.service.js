import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const cmsPagesService = {
  fetchCmsPages,
  fetchCmsContentFields,
}

function fetchCmsPages(query) {
  return axios({
    method: apiPath.cmsPages.fetch(query).method,
    url: apiPath.cmsPages.fetch(query).url,
  })
}
function fetchCmsContentFields(id) {
  return axios({
    method: apiPath.cmsPages.cmsContentFields(id).method,
    url: apiPath.cmsPages.cmsContentFields(id).url,
  })
}