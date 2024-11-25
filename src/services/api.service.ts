import axios from "axios";
export const url = "http://192.168.231.128:3000"
export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});