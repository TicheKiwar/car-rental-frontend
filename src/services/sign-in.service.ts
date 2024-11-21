import { api } from "./api.service";

export const createClient = async (userData: any) => {
    try {
        const response = await api.post("/clients", userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        throw error;
    }
};

export const createEmployee = async (userData: any) => {
    try {
        const response = await api.post("/employees", userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw error;
    }
};

export const checkEmailOrDni = async (email: string, dni: string, id: number) => {
    const response = await api.post(`/users/validate/${id}`, { email, dni });
    return response.data;
};