export interface VehicleModel {
  modelId: number;
  modelName: string;
  year: number;
  deletedAt: string | null;
  brand: {
    brandId: number;
    brandName: string;
    deletedAt: string | null;
  };
}

export interface Vehicle {
  key: number;
  vehicleId: number;
  licensePlate: string;
  type: string;
  status: string;
  dailyRate: string;
  capacity: number;
  maxSpeed: number;
  color: string;
  transmission: string;
  doorCount: number;
  fuelType: string;
  mileage: number;
  lastRevisionDate: string;
  registrationDate: string;
  costDayDelay: string;
  deletedAt: string | null;
  model: VehicleModel;
  image: string;
}
