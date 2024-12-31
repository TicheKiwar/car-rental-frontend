import { message } from "antd";
import { api } from "./api.service";
import { IRental } from "../types/rentail";

export const fetchRental = async (): Promise<IRental[]> => {
    const token = localStorage.getItem("authToken");
    const response = await api.get(`/rental`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    const data = response.data;
    const filteredReservations = data.filter(reservation => reservation.status !== 'CANCELADO');
    return filteredReservations
};

export const createRental = async (reservation: any): Promise<boolean> => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token de autenticación no encontrado");
        }
    
        const reservationData = {
            rentalDate: reservation.reservationDate, // Fecha de inicio de la reserva
            rentalDays: reservation.reservationDays,             // Número de días de la reserva
            vehicleId: reservation.vehicleId,
            ClientID: reservation.clientID     
        };
    
        const response = await api.post(
            `/rental/employee`, // URL de la API
            reservationData,        // Datos del cuerpo de la solicitud
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Encabezado con el token de autenticación
                },
            }
        );
    
        if (response.status === 200) {
            return true; // Reserva creada con éxito
        } else {
            return false; // Si la respuesta no fue exitosa
        }
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        throw new Error("Error al crear la reserva");
    }
    
    
};

export const updateRental = async (reservationId: number, reservationData: any): Promise<any> => {
    try {
        const data ={
            rentalDate: reservationData.reservationDate,
            rentalDays: reservationData.reservationDays,
            vehicleId: reservationData.vehicleId
        }
        const token = localStorage.getItem("authToken");
        const response = await api.patch(`/rental/employee/${reservationId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error al actualizar la reserva");
    }
};
export const deleteRental = async (reservationID: number) => {
    try {
        const token = localStorage.getItem("authToken");
        await api.delete(`/rental/employee/${reservationID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
    });
        message.success("Reserva eliminado con éxito.");
    } catch (error) {
        message.error("Error al eliminar la Reserva.");
    }   
};

export const markRental = async (reservationID: number, data:any) => {
    try {
        console.log("datos",reservationID,data)
        const mark = { 
            initialFuelLevel : data
        }
        console.log(mark)
        const token = localStorage.getItem("authToken");
        await api.patch(`/rental/mark/${reservationID}`,mark, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
    });
        message.success("Salida del vehiculo marcada con éxito.");
    } catch (error) {
        message.error("Error al marcar la salida del vehiculo.");
    }   
};