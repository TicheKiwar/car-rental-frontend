import { IVehicleStatus } from "./VehicleStatus";

export interface IMaintenance {
    maintenanceId: number;
    description: string;
    status: string;
    createDate: string;
    updateDate: string;
    vehicle: IVehicleStatus
}