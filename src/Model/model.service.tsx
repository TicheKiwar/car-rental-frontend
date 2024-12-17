import { Brand, Model } from "./Imodel"; // Importa las interfaces necesarias
import { api } from "../services/api.service";


// Función para obtener los modelos
const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await api.get(`/model`);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await api.get(`/brand`);  
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

const createModel = async (model: { modelName: string; year: number; brandId: number }): Promise<void> => {
  try {
    await api.post(`/model`, model);
  } catch (error) {
    console.error("Error creando el modelo:", error);
    throw error; 
  }
};

// Servicio para eliminar un modelo
const deleteModel = async (id: number): Promise<void> => {
  try {
    await api.delete(`/model/${id}`);
  } catch (error) {
    console.error("Error eliminando el modelo:", error);
    throw error; 
  }
};

// Función para actualizar un modelo
const updateModel = async (id: number, modelData: { modelName: string, year: number, brandId: number }): Promise<void> => {
  try {
    await api.put(`/model/${id}`, modelData);
  } catch (error) {
    console.error("Error al actualizar el modelo:", error);
    throw error;  
  }
};

export { fetchModels, fetchBrands, createModel, deleteModel, updateModel }; 
