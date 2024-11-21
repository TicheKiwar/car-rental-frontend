import { BrandType } from "./brand.type";
import { VehicleType } from "./vehicle.type";

export interface ModelType {
    modelId: number;
    name: string;
    year: number | null;
    brand: BrandType;
    vehicles: VehicleType[];
}
