import { api } from "./api.service";
import { Client } from '../types/Client';

export const getClients = async (): Promise<Client[]> => {
    try {
        const response = await api.get('/clients');
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los clientes`, error);
        throw error;
    }
};

export const createClient = async (userData: any) => {
    try {
        const response = await api.post("/clients", userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        throw error;
    }
};

export const updateClient = async (id: number, data: any): Promise<any> => {
    try {
        const response = await api.patch(`/clients/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el cliente con ID ${id}`, error);
        throw error;
    }
};

export const deleteClient = async (id: number): Promise<void> => {
    try {
        await api.delete(`/clients/${id}`);
    } catch (error) {
        console.error(`Error al eliminar el cliente con ID ${id}`, error);
        throw error;
    }
};
