import axios from "axios";
import { Vehicle, VehicleModel } from "./Ivehicle"; // Asegúrate de que las interfaces estén importadas
import { message } from "antd";

// URL base de la API (ajústala si es necesario)
const API_URL = "http://192.168.231.128:3000";

// Función para obtener los vehículos
const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await axios.get(`${API_URL}/vehicles`);
  const data = response.data;

  // Mapea la estructura para incluir los campos necesarios
  return data.map((vehicle: any) => ({
    ...vehicle,
    key: vehicle.vehicleId,
    brand: vehicle.model.brand.brandName,
    model: vehicle.model.modelName,
  }));
};

// Función para obtener los modelos de vehículos
const fetchModels = async (): Promise<VehicleModel[]> => {
  try {
    const response = await axios.get(`${API_URL}/model`);
    const data = response.data;
    return data.map((model: any) => ({
      modelId: model.modelId,
      modelName: model.modelName,
      year: model.year,
      brand: model.brand, // Si es necesario, incluye la estructura completa del objeto 'brand'
      deletedAt: model.deletedAt || null, // Asegúrate de que 'deletedAt' esté presente
    }));
  } catch (error) {
    throw new Error("Error al obtener los modelos de vehículos");
  }
};

// Función para crear un nuevo vehículo
const createVehicle = async (vehicleData: any): Promise<Vehicle> => {
  try {
    const response = await axios.post(`${API_URL}/vehicles`, vehicleData);
    return response.data; // Retorna la respuesta de la creación del vehículo
  } catch (error) {
    throw new Error("Error al crear el vehículo");
  }
};

const deleteVehicle = async (vehicleId: number) => {
  try {
    await axios.delete(`${API_URL}/vehicles/${vehicleId}`);
    message.success("Vehículo eliminado con éxito.");
  } catch (error) {
    message.error("Error al eliminar el vehículo.");
  }
};

export { fetchVehicles, fetchModels, createVehicle, deleteVehicle };
