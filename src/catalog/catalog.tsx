import React, { useEffect, useState } from "react";
import { Card, Col, Row, Modal, Button, Input, Select, Drawer, Slider, InputNumber } from "antd";
import { ClearOutlined, DollarOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { fetchCatalog } from "../services/catalog.service";
import { Vehicle } from "../Vehicles/Ivehicle";
import VehicleInfoModal from "./catalog.info";
import NewReservationModal from "../reservations/NewReservationModal";
import { createReservation } from "../services/reservation.service";

const { Meta } = Card;
const { Option } = Select;

const VehicleCatalog: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const getMaxValues = (vehicles: Vehicle[]) => ({
    dailyRate: Math.max(...vehicles.map(v => v.dailyRate)),
    capacity: Math.max(...vehicles.map(v => v.capacity)),
    maxSpeed: Math.max(...vehicles.map(v => v.maxSpeed)),
    doorCount: Math.max(...vehicles.map(v => v.doorCount)),
    mileage: Math.max(...vehicles.map(v => v.mileage))
  });

  const [maxValues, setMaxValues] = useState({
    dailyRate: 0,
    capacity: 0,
    maxSpeed: 0,
    doorCount: 0,
    mileage: 0
  });

  const getInitialAdvancedFilters = (maxVals: typeof maxValues) => ({
    dailyRate: [0, maxVals.dailyRate],
    capacity: [0, maxVals.capacity],
    maxSpeed: [0, maxVals.maxSpeed],
    transmission: null,
    doorCount: [0, maxVals.doorCount],
    fuelType: null,
    mileage: [0, maxVals.mileage],
    color: null,
    year: null,
    type: null
  });
  const [advancedFilters, setAdvancedFilters] = useState(getInitialAdvancedFilters(maxValues));

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await fetchCatalog();
      setVehicles(data);
      applyFilters(search, filterBrand, filterStatus, advancedFilters, data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      Modal.error({
        title: 'Error',
        content: 'No se pudieron cargar los vehículos. Por favor, intente nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadVehiclesAndSetMaxValues = async () => {
      try {
        const data = await fetchCatalog();
        const maxVals = getMaxValues(data);
        setMaxValues(maxVals);
        const initialFilters = getInitialAdvancedFilters(maxVals);
        setAdvancedFilters(initialFilters);
        setVehicles(data);
        applyFilters(search, filterBrand, filterStatus, initialFilters, data);
      } catch (error) {
        console.error("Error loading vehicles:", error);
        Modal.error({
          title: 'Error',
          content: 'No se pudieron cargar los vehículos.'
        });
      }
    };

    loadVehiclesAndSetMaxValues();
  }, []);

  const handleCardClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsInfoModalOpen(true);
    setIsReservationModalOpen(false);
  };

  const handleModalClose = () => {
    setSelectedVehicle(null);
    setIsInfoModalOpen(false);
    setIsReservationModalOpen(false);
  };

  const handleReservationModalOpen = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsReservationModalOpen(true);
    setIsInfoModalOpen(false);
  };

  const handleSaveReservation = async (reservationData: {
    reservationDate: string;
    reservationDays: number;
    totalCost: string;
    vehicleId: number;
  }) => {
    try {
      const isReservationCreated = await createReservation(reservationData);

      if (!isReservationCreated) {
        console.log("Reserva guardada con éxito.");
        handleModalClose();
        await loadVehicles();
        Modal.success({
          content: 'La reserva se ha guardado correctamente.',
        });
      } else {
        console.log("No se pudo guardar la reserva.");
        Modal.error({
          title: 'Error',
          content: 'Hubo un problema al guardar la reserva. Por favor, inténtalo nuevamente.',
        });
      }
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      Modal.error({
        title: 'Error',
        content: 'Hubo un problema al guardar la reserva. Por favor, inténtalo nuevamente.',
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    applyFilters(value, filterBrand, filterStatus, advancedFilters, vehicles);
  };

  const clearAdvancedFilters = () => {
    const initialFilters = getInitialAdvancedFilters(maxValues);
    setAdvancedFilters(initialFilters);
    applyFilters(search, filterBrand, filterStatus, initialFilters, vehicles);
  };

  const handleAdvancedFilterChange = (key: string, value: any) => {
    const newFilters = { ...advancedFilters, [key]: value };
    setAdvancedFilters(newFilters);
    applyFilters(search, filterBrand, filterStatus, newFilters, vehicles);
  };

  const handleBrandFilter = (value: string | null) => {
    setFilterBrand(value);
    applyFilters(search, value, filterStatus, advancedFilters, vehicles);
  };

  const handleStatusFilter = (value: string | null) => {
    setFilterStatus(value);
    applyFilters(search, filterBrand, value, advancedFilters, vehicles);
  };

  const toggleAdvancedFilter = () => {
    setIsAdvancedFilterOpen(!isAdvancedFilterOpen);
  };

  const applyFilters = (
    search: string,
    brand: string | null,
    type: string | null,
    advancedFilters: any,
    vehicleList: Vehicle[]
  ) => {
    const filtered = vehicleList.filter((vehicle) => {
      const matchesSearch = vehicle.model.modelName.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = !brand || vehicle.model.brand.brandName === brand;
      const matchesYear = !advancedFilters.year || vehicle.model.year === advancedFilters.year;
      const matchesType = !type || vehicle.type === type;

      const matchesDailyRate = (!advancedFilters.dailyRate[0] || vehicle.dailyRate >= advancedFilters.dailyRate[0]) &&
                              (!advancedFilters.dailyRate[1] || vehicle.dailyRate <= advancedFilters.dailyRate[1]);
      const matchesCapacity = (!advancedFilters.capacity[0] || vehicle.capacity >= advancedFilters.capacity[0]) &&
                             (!advancedFilters.capacity[1] || vehicle.capacity <= advancedFilters.capacity[1]);
      const matchesMaxSpeed = (!advancedFilters.maxSpeed[0] || vehicle.maxSpeed >= advancedFilters.maxSpeed[0]) &&
                             (!advancedFilters.maxSpeed[1] || vehicle.maxSpeed <= advancedFilters.maxSpeed[1]);
      const matchesDoorCount = (!advancedFilters.doorCount[0] || vehicle.doorCount >= advancedFilters.doorCount[0]) &&
                              (!advancedFilters.doorCount[1] || vehicle.doorCount <= advancedFilters.doorCount[1]);
      const matchesMileage = (!advancedFilters.mileage[0] || vehicle.mileage >= advancedFilters.mileage[0]) &&
                            (!advancedFilters.mileage[1] || vehicle.mileage <= advancedFilters.mileage[1]);

      return matchesSearch && matchesBrand && matchesDailyRate &&
             matchesCapacity && matchesMaxSpeed && matchesDoorCount &&
             matchesMileage && matchesYear && matchesType;
    });

    setFilteredVehicles(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <Input
          placeholder="Buscar por modelo"
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
          {Array.from(new Set(vehicles.map((v) => v.model.brand.brandName))).map((brand) => (
            <Option key={brand} value={brand}>
              {brand}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por Tipo"
          allowClear
          onChange={(value) => handleStatusFilter(value || null)}
          style={{ width: "30%" }}
        >
          {Array.from(new Set(vehicles.map((v) => v.type))).map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        <Button
          icon={<SettingOutlined />}
          onClick={toggleAdvancedFilter}
          style={{ marginLeft: 'auto' }}
        >
          Filtros Avanzados
        </Button>
      </div>

      <Drawer
        title="Filtros Avanzados"
        open={isAdvancedFilterOpen}
        onClose={toggleAdvancedFilter}
        width={400}
        extra={
          <Button
            icon={<ClearOutlined />}
            onClick={clearAdvancedFilters}
          >
            Limpiar Filtros
          </Button>
        }
      >
        <div style={{ marginBottom: "20px" }}>
          <label>Rango de tarifa diaria </label> <DollarOutlined style={{ color: '#4CAF50' }} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <InputNumber
              min={0}
              max={maxValues.dailyRate}
              value={advancedFilters.dailyRate[0]}
              onChange={(value) => handleAdvancedFilterChange('dailyRate', [value || 0, advancedFilters.dailyRate[1]])}
              style={{ width: '100%' }}
            />
            <InputNumber
              min={0}
              max={maxValues.dailyRate}
              value={advancedFilters.dailyRate[1]}
              onChange={(value) => handleAdvancedFilterChange('dailyRate', [advancedFilters.dailyRate[0], value || maxValues.dailyRate])}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Capacidad de Pasajeros</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <InputNumber
              min={0}
              max={maxValues.capacity}
              value={advancedFilters.capacity[0]}
              onChange={(value) => handleAdvancedFilterChange('capacity', [value || 0, advancedFilters.capacity[1]])}
              style={{ width: '100%' }}
            />
            <InputNumber
              min={0}
              max={maxValues.capacity}
              value={advancedFilters.capacity[1]}
              onChange={(value) => handleAdvancedFilterChange('capacity', [advancedFilters.capacity[0], value || maxValues.capacity])}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Velocidad máxima (Km/h)</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <InputNumber
              min={0}
              max={maxValues.maxSpeed}
              value={advancedFilters.maxSpeed[0]}
              onChange={(value) => handleAdvancedFilterChange('maxSpeed', [value || 0, advancedFilters.maxSpeed[1]])}
              style={{ width: '100%' }}
            />
            <InputNumber
              min={0}
              max={maxValues.maxSpeed}
              value={advancedFilters.maxSpeed[1]}
              onChange={(value) => handleAdvancedFilterChange('maxSpeed', [advancedFilters.maxSpeed[0], value || maxValues.maxSpeed])}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Numero de puertas</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <InputNumber
              min={0}
              max={maxValues.doorCount}
              value={advancedFilters.doorCount[0]}
              onChange={(value) => handleAdvancedFilterChange('doorCount', [value || 0, advancedFilters.doorCount[1]])}
              style={{ width: '100%' }}
            />
            <InputNumber
              min={0}
              max={maxValues.doorCount}
              value={advancedFilters.doorCount[1]}
              onChange={(value) => handleAdvancedFilterChange('doorCount', [advancedFilters.doorCount[0], value || maxValues.doorCount])}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>kilometraje (km)</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <InputNumber
              min={0}
              max={maxValues.mileage}
              value={advancedFilters.mileage[0]}
              onChange={(value) => handleAdvancedFilterChange('mileage', [value || 0, advancedFilters.mileage[1]])}
              style={{ width: '100%' }}
            />
            <InputNumber
              min={0}
              max={maxValues.mileage}
              value={advancedFilters.mileage[1]}
              onChange={(value) => handleAdvancedFilterChange('mileage', [advancedFilters.mileage[0], value || maxValues.mileage])}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Año del Modelo</label>
          <Select
            value={advancedFilters.year}
            onChange={(value) => handleAdvancedFilterChange('year', value)}
            style={{ width: "100%" }}
            allowClear
          >
            {Array.from(new Set(filteredVehicles.map((vehicle) => vehicle.model.year))) // Eliminar duplicados
              .sort((a, b) => b - a) // Ordenar los años en orden descendente
              .map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
          </Select>
        </div>
      </Drawer>

      <Row gutter={[16, 16]}>
        {filteredVehicles.map((vehicle) => (
          <Col xs={24} sm={12} md={8} lg={6} key={vehicle.vehicleId}>
            <Card
              hoverable
              cover={
                <img
                  alt="Vehicle"
                  src={vehicle.image}
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
                title=
                <>
                  {`${vehicle.model.brand.brandName}`}
                  <br />
                  {`Modelo: ${vehicle.model.modelName}`}
                  <br />
                  {`Año: ${vehicle.model.year}`}
                </>
                description={
                  <>
                    <DollarOutlined style={{ color: '#4CAF50' }} />
                    {"  " + vehicle.dailyRate}
                  </>
                }
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  marginTop: 10,
                  width: "100%",
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReservationModalOpen(vehicle);
                }}
              >
                Reservar
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          Cargando...
        </div>
      )}

      {selectedVehicle && (
        <VehicleInfoModal
          visible={isInfoModalOpen}
          onClose={handleModalClose}
          vehicle={selectedVehicle}
        />
      )}

      {selectedVehicle && (
        <NewReservationModal
          visible={isReservationModalOpen}
          onClose={handleModalClose}
          onSave={handleSaveReservation}
          vehicle={selectedVehicle}
          isNew={true}
        />
      )}
    </div>
  );
};

export default VehicleCatalog;