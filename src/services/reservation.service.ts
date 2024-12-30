import { message } from "antd";
import { api } from "./api.service";
import { IRental } from "../types/rentail";
import { IVerify, IVerifyResponse } from "../types/Verify";

export const fetchReservations = async (): Promise<IRental[]> => {
    const token = localStorage.getItem("authToken");
    const response = await api.get(`/rental/client`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    const data = response.data;

    return data.map((reservation: any) => ({
        rentalID: reservation.rentalId,
        rentalDate: reservation.rentalDate,
        rentalDays: reservation.rentalDays,
        vehicle: reservation.vehicle,
        createdAt: reservation.createdAt,
        status: reservation.status,
    }));
};

export const verifyReservation = async (verify:IVerify): Promise<IVerifyResponse> => {
    const token = localStorage.getItem("authToken");
    const response = await api.get(`/rental/verify`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    const data = response.data;

    return data.map((verify: any) => ({
        verifyHour: verify.verifyHour,
        verifyDate: verify.verifyDate,
        verifyMark: verify.verifyMark,
    }));
};

export const createReservation = async (reservation: any): Promise<boolean> => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token de autenticación no encontrado");
        }
    
        const reservationData = {
            reservationDate: reservation.reservationDate, // Fecha de inicio de la reserva
            reservationDays: reservation.reservationDays,             // Número de días de la reserva
            totalCost: reservation.totalCost,           // Costo total de la reserva
            vehicleId: reservation.vehicleId,                // ID del vehículo
        };
    
        const response = await api.post(
            `/reservations/Client`, // URL de la API
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

export const updateReservation = async (reservationId: number, reservationData: any): Promise<any> => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await api.patch(`/rental/${reservationId}`, reservationData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error al actualizar la reserva");
    }
};
export const deleteReservation = async (reservationID: number) => {
    try {
        await api.delete(`/rental/${reservationID}`);
        message.success("Reserva eliminado con éxito.");
    } catch (error) {
        message.error("Error al eliminar la Reserva.");
    }   
};