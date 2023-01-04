import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const timelineService = {
    fetchTimelineDetails,
    fetchTimelineSessions
}

function fetchTimelineDetails(mrn, id) {
    return axios({
        method: apiPath.timeline.details(mrn, id).method,
        url: apiPath.timeline.details(mrn, id).url
    })
}

function fetchTimelineSessions(id) {
    return axios({
        method: apiPath.timeline.sessions(id).method,
        url: apiPath.timeline.sessions(id).url
    })
}
