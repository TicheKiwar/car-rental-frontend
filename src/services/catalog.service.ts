import { VehicleType } from "../common/vehicle.type";
import { api } from "./api.service";

let data: VehicleType[] = [];

async function fetchData(): Promise<void> {
  try {
    const response = await api.get("/catalog");

    const responseData = await response.data;
    data = responseData.map((item: any) => ({
      vehicleId: item.vehicleId,
      licensePlate: item.licensePlate,
      type: item.type ?? "Unknown",
      status: item.status ?? "Not specified",
      dailyRate: item.dailyRate ?? "50.00",
      capacity: item.capacity ?? 5,
      quality: item.quality ?? "High",
      maxSpeed: item.maxSpeed ?? 200,
      color: item.color ?? "White",
      transmission: item.transmission ?? "Manual",
      doorCount: item.doorCount ?? 4,
      fuelType: item.fuelType ?? "Gasoline",
      image: item.image,
      model: {
        modelId: item.model.modelId,
        name: item.model.modelName ?? "Unknown model",
        year: item.model.year ?? 2023,
        brand: {
          brandId: item.model.brand.brandId,
          name: item.model.brand.brandName ?? "Unknown brand",
        },
        vehicles: [],
      },
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    data = [];
  }
}

export function getData(): VehicleType[] {
  return data;
}

export { fetchData };
