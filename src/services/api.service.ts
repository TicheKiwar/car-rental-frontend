import axios from "axios";
// export const url = "http://192.168.231.130:3000"
const isDocker = process.env.REACT_APP_DOCKER_ENV === "true";
export const url = isDocker ? "http://backend:3000" : "http://192.168.231.130:3000";

export const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
});
