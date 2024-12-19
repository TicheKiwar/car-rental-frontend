import { api } from "./api.service";
import { Rental } from "../Rental/IRental";

export const getRentals = async (): Promise<Rental[]> => {
    try {
        const response = await api.get("/renatl");  // Ruta del backend para obtener las rentas
        return response.data; // Retorna los datos obtenidos del backend
    } catch (error) {
        console.error("Error al obtener las rentas:", error);
        throw error;
    }
};

export const postRentalReturn = async (returnData: Rental): Promise<any> => {
    try {
        
        const response = await api.post("/rental", returnData);  
        return response.data; 
    } catch (error) {
        console.error("Error al enviar los datos de retorno:", error);
        throw error;  
    }
};