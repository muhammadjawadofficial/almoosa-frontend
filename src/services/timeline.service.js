import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const timelineService = {
    fetchTimelineDetails
}

function fetchTimelineDetails(id) {
    return axios({
        method: apiPath.timeline.details(id).method,
        url: apiPath.timeline.details(id).url
    })
}
