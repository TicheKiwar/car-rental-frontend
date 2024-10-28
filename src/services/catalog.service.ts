import { VehicleType } from "../common/vehicle.type";

let datos: VehicleType[] = [];

async function fetchData(): Promise<void> {
  try {
    const response = await fetch(`http://192.168.231.128:3000/catalog`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    datos = responseData.map((item: any) => ({
      idVehiculo: item.idVehiculo,
      matricula: item.matricula,
      tipo: item.tipo ?? "Desconocido",
      estado: item.estado ?? "No especificado",
      tarifaXDia: item.tarifaXDia ?? "50.00",
      capacidad: item.capacidad ?? 5,
      calidad: item.calidad ?? "Alta",
      velocidadMaxima: item.velocidadMaxima ?? 200,
      color: item.color ?? "Blanco",
      transmision: item.transmision ?? "Manual",
      numeroPuertas: item.numeroPuertas ?? 4,
      combustible: item.combustible ?? "Gasolina",
      idModelo: {
        idModelo: item.idModelo.idModelo,
        nombre: item.idModelo.nombre ?? "Modelo desconocido",
        aO: item.idModelo.aO ?? 2023,
        idMarca: {
          idMarca: item.idModelo.idMarca.idMarca,
          nombre: item.idModelo.idMarca.nombre ?? "Marca desconocida",
        },
        vehiculos: [],
      },
    }));
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    datos = [];
  }
}

export function getDatos(): VehicleType[] {
  return datos;
}

export { fetchData };
