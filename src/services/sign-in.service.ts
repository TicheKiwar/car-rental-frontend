import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const createClient = async (userData: any) => {
    try {
        const response = await api.post("/user/clients", userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        throw error;
    }
};

export const createEmployee = async (userData: any) => {
    try {
        const response = await api.post("/user/employees", userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw error;
    }
};