import React, { useEffect, useState } from "react";
import { Card, Col, Row, Modal, Button, Input, Select,Typography } from "antd";
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
  const { Title, Text } = Typography;

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
    return (
      <Option key={status} value={status}>
        {status}
      </Option>
    );
  })}
</Select>

      </div>

      {/* Catálogo de Vehículos */}
      <Row gutter={[16, 16]}>
        {filteredVehicles.map((vehicle) => {
          const imageUrl = `${url}/${vehicle.image}`;
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

      {selectedVehicle && (
        <Modal
          title={<Title level={3}>{`Detalles del Vehículo - ${selectedVehicle.licensePlate}`}</Title>}
          open={isModalOpen}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" type="primary" onClick={handleModalClose} size="large">
              Cerrar
            </Button>,
          ]}
          width={600} // Puedes ajustar el ancho del modal
          style={{ top: 20 }} // Agregar un pequeño margen superior si es necesario
        >
          <Row gutter={16}>
            <Col span={12}>
              <p>
                <strong>Tipo:</strong>
                <Text>{selectedVehicle.type}</Text>
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Estado:</strong>
                <Text>{selectedVehicle.status}</Text>
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Color:</strong>
                <Text>{selectedVehicle.color}</Text>
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Número de puertas:</strong>
                <Text>{selectedVehicle.doorCount}</Text>
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Modelo:</strong>
                <Text>{selectedVehicle.model.name}</Text>
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Marca:</strong>
                <Text>{selectedVehicle.model.brand.name}</Text>
              </p>
            </Col>
          </Row>
        </Modal>
      )}
    </div>
  );
};

export default VehicleCatalog;
