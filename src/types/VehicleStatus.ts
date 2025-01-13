import { Vehicle } from "../Vehicles/Ivehicle";

export interface IVehicleStatus {
    vehicle: Vehicle
    dents?: boolean;
    lights?: boolean;
    tires?: boolean;
    windshield?: boolean;
    mirrors?: boolean;
    foreign_fluids?: boolean;
    brakes?: boolean;
    documents?: boolean;
}