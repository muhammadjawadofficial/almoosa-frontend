import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    getUpcomingAppointemnts,
}

function getUpcomingAppointemnts(id) {
    return axios({
        method: apiPath.appointment.upcoming(id).method,
        url: apiPath.appointment.upcoming(id).url
    })
}