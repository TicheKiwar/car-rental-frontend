import axios from "axios";
import { Brand, Model } from "./Imodel"; // Importa las interfaces necesarias

// URL de la API
const API_URL = "http://localhost:3000"; // Cambia esta URL según sea necesario

// Función para obtener los modelos
const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await axios.get<Model[]>(`${API_URL}/model`);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

// Función para obtener las marcas
const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await axios.get<Brand[]>(`${API_URL}/brand`);  // Cambia esta URL según sea necesario
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

const createModel = async (model: { modelName: string; year: number; brandId: number }): Promise<void> => {
  try {
    await axios.post(`${API_URL}/model`, model);
  } catch (error) {
    console.error("Error creando el modelo:", error);
    throw error; // Lanza el error para manejarlo en el frontend
  }
};

// Servicio para eliminar un modelo
const deleteModel = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/model/${id}`);
  } catch (error) {
    console.error("Error eliminando el modelo:", error);
    throw error; // Lanza el error para manejarlo en el frontend
  }
};

// Función para actualizar un modelo
const updateModel = async (id: number, modelData: { modelName: string, year: number, brandId: number }): Promise<void> => {
  try {
    await axios.put(`${API_URL}/model/${id}`, modelData);
  } catch (error) {
    console.error("Error al actualizar el modelo:", error);
    throw error;  // Lanza el error para manejarlo en el frontend
  }
};

export { fetchModels, fetchBrands, createModel, deleteModel, updateModel };  // Exportamos ambas funciones
