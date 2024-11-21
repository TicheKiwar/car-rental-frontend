const fetchVehicles = async () => {
    try {
      const response = await fetch("http://localhost:3000/vehicles"); // Cambia la URL según tu configuración
      if (!response.ok) {
        throw new Error(`Error al obtener vehículos: ${response.statusText}`);
      }
      const vehicles = await response.json();
      return vehicles.map((vehicle) => ({
        key: vehicle.vehicleId,
        vehicleId: vehicle.vehicleId,
        brand: vehicle.model.brand.brandName,
        model: vehicle.model.modelName,
        type: vehicle.type,
        color: vehicle.color,
        status: vehicle.status,
        image: "", // Puedes generar una imagen basada en la marca o mantenerlo vacío
      }));
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }
  };
  
  export default fetchVehicles;
  