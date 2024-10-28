import { BrandType } from "./brand.type";
import { VehicleType } from "./vehicle.type";

export interface ModelType {
    idModelo: number;
    nombre: string;
    aO: number | null;
    idMarca: BrandType;
    vehiculos: VehicleType[];
}