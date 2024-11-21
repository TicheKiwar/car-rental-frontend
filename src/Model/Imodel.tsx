export interface Brand {
    brandId: number;
    brandName: string;
    deletedAt?: string | null;
  }
  
  export interface Model {
    modelId: number;
    modelName: string;
    year: number;
    deletedAt?: string | null;
    brand: Brand;
  }
  