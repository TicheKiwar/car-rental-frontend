import axios from "axios";
import { Vehicle } from "./Ivehicle";

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await axios.get("http://localhost:3000/vehicles");
  const data = response.data;

  // Mapea la estructura para incluir los campos necesarios
  return data.map((vehicle: any) => ({
    ...vehicle,
    key: vehicle.vehicleId,
    brand: vehicle.model.brand.brandName,
    model: vehicle.model.modelName,
    image: "", // Puedes ajustar esto según tu lógica
  }));
};

export default fetchVehicles;
