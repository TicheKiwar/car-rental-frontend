import { message } from "antd";
import { Vehicle, VehicleModel } from "../Vehicles/Ivehicle";
import { api } from "./api.service";

export const fetchVehicles = async (): Promise<Vehicle[]> => {
    const response = await api.get(`/vehicles`);
    const data = response.data;

    return data.map((vehicle: any) => ({
        ...vehicle,
        key: vehicle.vehicleId,
        model: vehicle.model,
    }));
};

export const fetchModels = async (): Promise<VehicleModel[]> => {
    try {
        const response = await api.get(`/model`);
        const data = response.data;
        return data.map((model: any) => ({
            modelId: model.modelId,
            modelName: model.modelName,
            year: model.year,
            brand: model.brand,
            deletedAt: model.deletedAt || null,
        }));
    } catch (error) {
        throw new Error("Error al obtener los modelos de vehículos");
    }
};

export const createVehicle = async (vehicleData: any): Promise<Vehicle> => {
    try {
        const response = await api.post(`/vehicles`, vehicleData);
        return response.data;
    } catch (error) {
        throw new Error("Error al crear el vehículo");
    }
};

export const updateVehicle = async (vehicleId: number, vehicleData: any): Promise<Vehicle> => {
    try {
        const response = await api.put(`/vehicles/${vehicleId}`, vehicleData);
        return response.data;
    } catch (error) {
        throw new Error("Error al crear el vehículo");
    }
};

export const deleteVehicle = async (vehicleId: number) => {
    try {
        await api.delete(`/vehicles/${vehicleId}`);
        message.success("Vehículo eliminado con éxito.");
    } catch (error) {
        message.error("Error al eliminar el vehículo.");
    }
};