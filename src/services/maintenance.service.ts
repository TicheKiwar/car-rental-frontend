import { IMaintenance } from "../types/Maintenances";
import { api } from "./api.service";

export const getMaintenances = async (): Promise<IMaintenance[]> => {
    const response = await api.get(`/maintenances`);
    return response.data;
};

export const createMaintenance = async (maintenanceData: any) => {
    try {
        const response = await api.post(`/maintenances`, maintenanceData);
        return response.data;
    } catch (error) {
        throw new Error("Error al crear el vehículo");
    }
};

export const updateMaintenance = async (maintenanceId: number, maintenanceData: any) => {
    try {
        const response = await api.patch(`/maintenances/${maintenanceId}`, maintenanceData);
        return response.data;
    } catch (error) {
        throw new Error("Error al crear el vehículo");
    }
};