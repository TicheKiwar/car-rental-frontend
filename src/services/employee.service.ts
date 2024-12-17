import { api } from "./api.service";
import { Employee } from '../types/Employee';

export const getEmployees = async (): Promise<Employee[]> => {
    try {
        const response = await api.get('/employees');
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los empleados`, error);
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

export const updateEmployee = async (id: number, data: any): Promise<any> => {
    try {
        const response = await api.patch(`/employees/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el empleado con ID ${id}`, error);
        throw error;
    }
};

export const deleteEmployee = async (id: number): Promise<void> => {
    try {
        await api.delete(`/employees/${id}`);
    } catch (error) {
        console.error(`Error al eliminar el empleado con ID ${id}`, error);
        throw error;
    }
};
