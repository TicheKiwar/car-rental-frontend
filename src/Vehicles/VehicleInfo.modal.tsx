import React from "react";
import { Modal, Descriptions } from "antd";
import { Vehicle } from "./Ivehicle";

interface VehicleInfoModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const VehicleInfoModal: React.FC<VehicleInfoModalProps> = ({
  visible,
  onClose,
  vehicle,
}) => {
  if (!vehicle) return null;

  const imageUrl = vehicle.image
    ? `${vehicle.image}`
    : `http://localhost:3000/images/vehicles/default.jpg`;

  return (
    <Modal
      title={`Información del Vehículo : ${vehicle.licensePlate}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: "35%", height: "200px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
          <img
            src={imageUrl}
            alt={vehicle.licensePlate}
            style={{
              width: "300px",
              height: "auto",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ width: "60%" }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Modelo">
             {vehicle.model.brand.brandName} {vehicle.model.modelName} ({vehicle.model.year})
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">
             {vehicle.type}
            </Descriptions.Item>
            <Descriptions.Item label="Tarifa Diaria">
             ${vehicle.dailyRate}
            </Descriptions.Item>
            <Descriptions.Item label="Costo por Día de Retraso">
              ${vehicle.costDayDelay}
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
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleInfoModal;
