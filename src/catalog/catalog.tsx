import React, { useEffect, useState } from "react";
import { Card, Col, Row, Modal, Button, Input, Select } from "antd";
import { VehicleType } from "../common/vehicle.type";
import { fetchData, getData } from "../services/catalog.service";
import { url } from "../services/api.service";

const { Meta } = Card;
const { Option } = Select;

const VehicleCatalog: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleType[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      await fetchData();
      const data = getData();
      setVehicles(data);
      setFilteredVehicles(data);
    };

    loadVehicles();
  }, []);

  const handleCardClick = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedVehicle(null);
    setIsModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    applyFilters(value, filterBrand, filterStatus);
  };

  const handleBrandFilter = (value: string | null) => {
    setFilterBrand(value);
    applyFilters(search, value, filterStatus);
  };

  const handleStatusFilter = (value: string | null) => {
    setFilterStatus(value);
    applyFilters(search, filterBrand, value);
  };

  const applyFilters = (search: string, brand: string | null, status: string | null) => {
    const filtered = vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.model.name.toLowerCase().includes(search) ||
        vehicle.licensePlate.toLowerCase().includes(search);
      const matchesBrand = brand ? vehicle.model.brand.name === brand : true;
      const matchesStatus = status ? vehicle.status === status : true;

      return matchesSearch && matchesBrand && matchesStatus;
    });

    setFilteredVehicles(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Filtros */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Input
          placeholder="Buscar por modelo o placa"
          value={search}
          onChange={handleSearch}
          style={{ width: "30%" }}
        />
        <Select
          placeholder="Filtrar por marca"
          allowClear
          onChange={(value) => handleBrandFilter(value || null)}
          style={{ width: "30%" }}
        >
          {Array.from(new Set(vehicles.map((v) => v.model.brand.name))).map((brand) => (
            <Option key={brand} value={brand}>
              {brand}
            </Option>
          ))}
        </Select>
        <Select
  placeholder="Filtrar por estado"
  allowClear
  onChange={(value) => handleStatusFilter(value || null)}
  style={{ width: "30%" }}
>
  {Array.from(new Set(vehicles.map((v) => v.status))).map((status) => {
    const statusMap: Record<string, string> = {
      Available: "Disponible",
      Unavailable: "No Disponible",
    };
    return (
      <Option key={status} value={status}>
        {statusMap[status] || "Estado desconocido"}
      </Option>
    );
  })}
</Select>

      </div>

      {/* Catálogo de Vehículos */}
      <Row gutter={[16, 16]}>
        {filteredVehicles.map((vehicle) => {
          const imageUrl = `${url}/${vehicle.image}`;
          console.log(imageUrl)
          return (
            <Col span={6} key={vehicle.vehicleId}>
              <Card
                hoverable
                cover={
                  <img
                    alt="Vehicle"
                    src={imageUrl}
                    onError={(e) => {
                      e.currentTarget.src = `${url}/images/vehicles/default.jpg`;
                    }}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                }
                onClick={() => handleCardClick(vehicle)}
              >
                <Meta
                  title={`${vehicle.model.brand.name} ${vehicle.model.name}`}
                  description={vehicle.licensePlate}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal */}
      {selectedVehicle && (
        <Modal
          title={`Detalles del Vehículo - ${selectedVehicle.licensePlate}`}
          open={isModalOpen}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Cerrar
            </Button>,
          ]}
        >
          <p>
            <strong>Tipo:</strong> {selectedVehicle.type}
          </p>
          <p>
            <strong>Estado:</strong> {selectedVehicle.status}
          </p>
          <p>
            <strong>Color:</strong> {selectedVehicle.color}
          </p>
          <p>
            <strong>Número de puertas:</strong> {selectedVehicle.doorCount}
          </p>
          <p>
            <strong>Modelo:</strong> {selectedVehicle.model.name}
          </p>
          <p>
            <strong>Marca:</strong> {selectedVehicle.model.brand.name}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default VehicleCatalog;
