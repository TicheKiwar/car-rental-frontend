import axios from "axios";
import { Model } from "./Imodel";

const API_URL = "http://localhost:3000/model"; // Cambiar por la URL de tu API

const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await axios.get<Model[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

export default fetchModels;
