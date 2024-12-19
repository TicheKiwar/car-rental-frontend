import { message } from "antd";
import { Vehicle, VehicleModel } from "../Vehicles/Ivehicle";
import { api } from "./api.service";
import { IRental } from "../types/rentail";
import { IReservation } from "../types/reservation";

export const fetchReservations = async (): Promise<IReservation[]> => {
    const token = localStorage.getItem("authToken");
    const response = await api.get(`/reservations/Client`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    const data = response.data;

    return data.map((reservation: any) => ({
        reservationId: reservation.reservationId,
        reservationDate: reservation.reservationDate,
        reservationDays: reservation.reservationDays,
        totalCost: reservation.totalCost,
        vehicle: reservation.vehicle,
        rentals: reservation.rentals,
    }));
};

export const verifyReservation = async (reservationID: number): Promise<IReservation[]> => {
    const token = localStorage.getItem("authToken");
    const response = await api.get(`/reservations/Verify/${reservationID}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    const data = response.data;

    return data.map((reservation: any) => ({
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
        const response = await api.patch(`/reservations/${reservationId}`, reservationData, {
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
        await api.delete(`/reservations/${reservationID}`);
        message.success("Reserva eliminado con éxito.");
    } catch (error) {
        message.error("Error al eliminar la Reserva.");
    }   
};