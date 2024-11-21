import axios from "axios";
import { Brand } from "./Ibrand";

const BASE_URL = "http://localhost:3000/brand"; // Cambia la URL si es necesario

const fetchBrands = async (): Promise<Brand[]> => {
  const response = await axios.get(BASE_URL);

  // Mapea los datos si la estructura no coincide
  return response.data.map((item: any) => ({
    brandId: item.brandId,
    brandName: item.brandName,
  }));
};

export default fetchBrands;
