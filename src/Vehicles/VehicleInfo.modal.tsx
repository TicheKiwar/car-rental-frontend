import React from "react";
import { Modal, Descriptions } from "antd";
import { Vehicle } from "./Ivehicle";

interface VehicleInfoModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle: Vehicle | null; // Puede ser nulo si no hay vehículo seleccionado.
}

const VehicleInfoModal: React.FC<VehicleInfoModalProps> = ({
  visible,
  onClose,
  vehicle,
}) => {
  if (!vehicle) return null; // Si no hay vehículo, no muestra nada.

  // Generar la URL de la imagen
  const imageUrl = vehicle.image
    ? `http://localhost:3000${vehicle.image}` // Si existe una imagen personalizada
    : `http://localhost:3000/images/vehicles/default.jpg`; // Imagen por defecto

  return (
    <Modal
      title={`Información del Vehículo : ${vehicle.type}, ${vehicle.model}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Imagen del vehículo */}
        <div style={{ width: "35%", height: "200px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
          <img
            src={imageUrl}
            alt={vehicle.licensePlate}
            style={{
              width: "100%",  // Se ajusta para llenar el espacio disponible
              height: "100%", // Se ajusta para llenar el espacio disponible
              objectFit: "cover", // Asegura que la imagen no se deforme
              borderRadius: "8px", // Bordes redondeados para la imagen
            }}
          />
        </div>

        {/* Descripción del vehículo */}
        <div style={{ width: "60%" }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Matrícula">
              {vehicle.licensePlate}
            </Descriptions.Item>
            <Descriptions.Item label="Transmisión">
              {vehicle.transmission}
            </Descriptions.Item>
            <Descriptions.Item label="Capacidad">
              {vehicle.capacity} pasajeros
            </Descriptions.Item>
            <Descriptions.Item label="Velocidad Máxima">
              {vehicle.maxSpeed} km/h
            </Descriptions.Item>
            <Descriptions.Item label="Puertas">
              {vehicle.doorCount}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Combustible">
              {vehicle.fuelType}
            </Descriptions.Item>
            <Descriptions.Item label="Kilometraje">
              {vehicle.mileage} km
            </Descriptions.Item>
            <Descriptions.Item label="Última Revisión">
              {vehicle.lastRevisionDate}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha de Registro">
              {vehicle.registrationDate}
            </Descriptions.Item>
            <Descriptions.Item label="Costo por Día de Retraso">
              ${vehicle.costDayDelay}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleInfoModal;
