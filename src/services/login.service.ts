import { api } from "./api.service";

export const login = async (values: any) => {
    try {
        const response = await api.post('/auth/login', values);
        return response.data;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw error;
    }
};