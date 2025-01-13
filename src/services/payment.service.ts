import { api } from "./api.service";

export const deposit = async (payment: any): Promise<boolean> => {
    try {
    console.log(payment)
        const response = await api.post(
            `/payment/deposit`, 
            payment
        );
    
        if (response.status === 200) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        throw new Error("Error al crear la reserva");
    }
    
    
};