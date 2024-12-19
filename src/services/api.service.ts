import axios from "axios";
// export const url = "http://192.168.231.130:3000"
export const url = "http://192.168.231.130:3000"
export const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
});