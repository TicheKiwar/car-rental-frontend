import { ModelType } from "./model.type";

export interface BrandType {
    brandId: number;
    name: string;
    models: ModelType[];
}
