import { ModelType } from "./model.type";

export interface BrandType {
    idMarca: number;
    nombre: string;
    modelos: ModelType[];
}