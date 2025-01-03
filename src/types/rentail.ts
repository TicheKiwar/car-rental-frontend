import { Vehicle } from "../Vehicles/Ivehicle";
import { Client } from "./Client";

export interface IRental {
    rentalId: number;
    initialFuelLevel: number | null;
    totalDays: number | null;
    status: string;
    rentalDate: Date;
    rentalDays: number;
    createdAt: Date;
    vehicle: Vehicle;
    client: Client;
  }