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

export const forgotPasswordEmail = async (email: string) => {
    await api.post(`/auth/recover-password`, { email });
}

export const recoverPassword = async (token: string, newPassword: string) => {
    await api.post(`/auth/reset-password`, { token, newPassword });
}