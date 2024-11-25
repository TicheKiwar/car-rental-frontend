import { ModelType } from "./model.type";

export interface VehicleType {
    vehicleId: number;
    licensePlate: string;
    type: string | null;
    status: string | null;
    dailyRate: string | null;
    capacity: number | null;
    quality: string | null;
    maxSpeed: number | null;
    color: string | null;
    transmission: string | null;
    doorCount: number | null;
    fuelType: string | null;
    // reservations: Reservations[];
    model: ModelType;
    image: string|null
    
}
