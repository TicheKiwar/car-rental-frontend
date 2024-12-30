import { Vehicle } from "../Vehicles/Ivehicle";

export interface IRental {
    rentalId: number;
    initialFuelLevel: number | null;
    totalDays: number | null;
    status: string;
    rentalDate: string;
    rentalDays: number;
    createdAt: string;
    vehicle: Vehicle;
  }