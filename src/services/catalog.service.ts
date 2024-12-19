import { Vehicle } from "../Vehicles/Ivehicle";
import { api } from "./api.service";

export const fetchCatalog = async (): Promise<Vehicle[]> => {
  const response = await api.get(`/catalog`);
  const data = response.data;

  return data.map((vehicle: any) => ({
      ...vehicle,
      key: vehicle.vehicleId,
      model: vehicle.model,
  }));
};
