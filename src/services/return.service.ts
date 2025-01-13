import { api } from "./api.service";
import { InsertReturn, ReturnDetails, ReturnCosts } from "../ReturnVehicle/IReturn";

export const getRentals = async (): Promise<ReturnDetails[]> => {
    try {
        const response = await api.get("/returns");  // Ruta del backend para obtener las rentas
        return response.data; // Retorna los datos obtenidos del backend
    } catch (error) {
        console.error("Error al obtener las rentas:", error);
        throw error;
    }
};

export const postRentalReturn = async (returnData: InsertReturn): Promise<any> => {
    try {
        
        const response = await api.post("/returns", returnData);  
        return response.data; 
    } catch (error) {
        console.error("Error al enviar los datos de retorno:", error);
        throw error;  
    }
};
export const getReturnDetails = async (returnId: number): Promise<ReturnCosts> => {
    try {
        const response = await api.get(`/returns/${returnId}`);  // Usamos el parámetro returnId para hacer la petición a un retorno específico
        return response.data; // Retorna los datos obtenidos del backend
    } catch (error) {
        console.error("Error al obtener los detalles del retorno:", error);
        throw error;  
    }
};