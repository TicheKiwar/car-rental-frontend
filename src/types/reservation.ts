import { Vehicle } from "../Vehicles/Ivehicle";
import { IRental } from "./rentail";

export interface IReservation {
    reservationId: number;
    reservationDate: string;
    reservationDays: number;
    totalCost: string;
    vehicle: Vehicle;
    rentals: IRental [];
  }