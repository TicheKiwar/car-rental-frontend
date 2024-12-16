import { api } from "./api.service";
import { ReturnDetails } from "../ReturnVehicle/IReturn";

export const getRentals = async (): Promise<ReturnDetails[]> => {
    try {
        const response = await api.get("/returns");  // Ruta del backend para obtener las rentas
        return response.data; // Retorna los datos obtenidos del backend
    } catch (error) {
        console.error("Error al obtener las rentas:", error);
        throw error;
    }
};