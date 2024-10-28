import { ModelType } from "./model.type";

export interface VehicleType {
    idVehiculo: number;
    matricula: string;
    tipo: string | null;
    estado: string | null;
    tarifaXDia: string | null;
    capacidad: number | null;
    calidad: string | null;
    velocidadMaxima: number | null;
    color: string | null;
    transmision: string | null;
    numeroPuertas: number | null;
    combustible: string | null;
    // reservas: Reservas[];
    idModelo: ModelType;
}
