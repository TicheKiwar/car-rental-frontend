import { Position } from "../types/Position";
import { api } from "./api.service";

export const getPositions = async (): Promise<Position[]> => {
    try {
        const response = await api.get<Position[]>('/positions');
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los cargos`, error);
        throw error;
    }
};
