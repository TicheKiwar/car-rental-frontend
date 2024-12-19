import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Col, Row, Modal, Button, Input, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { fetchCatalog } from "../services/catalog.service";
import { Vehicle } from "../Vehicles/Ivehicle";
import VehicleInfoModal from "./catalog.info";
import NewReservationModal from "../reservations/NewReservationModal";
import { createReservation } from "../services/reservation.service";

const { Meta } = Card;
const { Option } = Select;

const ITEMS_PER_PAGE = 8; // Number of items to load each time

const VehicleCatalog: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVehicleElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadVehicles = async () => {
    try {
      const data = await fetchCatalog();
      setVehicles(data);
      applyFilters(search, filterBrand, filterStatus, data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      Modal.error({
        title: 'Error',
        content: 'No se pudieron cargar los vehículos. Por favor, intente nuevamente.',
      });
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    const newDisplayedVehicles = filteredVehicles.slice(start, end);
    setDisplayedVehicles(newDisplayedVehicles);
    setHasMore(end < filteredVehicles.length);
  }, [page, filteredVehicles]);

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

  const handleSaveReservation = async (reservationData: { reservationDate: string; reservationDays: number; totalCost: string; vehicleId: number }) => {
    try {
      const isReservationCreated = await createReservation(reservationData);

      if (!isReservationCreated) {
        console.log("Reserva guardada con éxito.");
        handleModalClose();
        
        // Reload vehicles after successful reservation
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
    setPage(1); // Reset page when searching
    applyFilters(value, filterBrand, filterStatus, vehicles);
  };

  const handleBrandFilter = (value: string | null) => {
    setFilterBrand(value);
    setPage(1); // Reset page when filtering
    applyFilters(search, value, filterStatus, vehicles);
  };

  const handleStatusFilter = (value: string | null) => {
    setFilterStatus(value);
    setPage(1); // Reset page when filtering
    applyFilters(search, filterBrand, value, vehicles);
  };

  const applyFilters = (search: string, brand: string | null, status: string | null, vehicleList: Vehicle[]) => {
    const filtered = vehicleList.filter((vehicle) => {
      const matchesSearch = vehicle.model.modelName.toLowerCase().includes(search) ||
        vehicle.licensePlate.toLowerCase().includes(search);
      const matchesBrand = brand ? vehicle.model.brand.brandName === brand : true;
      const matchesStatus = status ? vehicle.status === status : true;

      return matchesSearch && matchesBrand && matchesStatus;
    });

    setFilteredVehicles(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
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
          {Array.from(new Set(vehicles.map((v) => v.model.brand.brandName))).map((brand) => (
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
          {Array.from(new Set(vehicles.map((v) => v.status))).map((status) => (
            <Option key={status} value={status}>
              {status || "Estado desconocido"}
            </Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {displayedVehicles.map((vehicle, index) => {
          const imageUrl = vehicle.image;
          const isLastElement = index === displayedVehicles.length - 1;

          return (
            <Col 
              span={6} 
              key={vehicle.vehicleId}
              ref={isLastElement ? lastVehicleElementRef : null}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt="Vehicle"
                    src={imageUrl}
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
                  title={`${vehicle.model.brand.brandName} ${vehicle.model.modelName}`}
                  description={vehicle.licensePlate}
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
          );
        })}
      </Row>

      {loading && <div style={{ textAlign: 'center', margin: '20px 0' }}>Cargando...</div>}

      {selectedVehicle && (
        <VehicleInfoModal
          visible={isInfoModalOpen}
          onClose={handleModalClose}
          vehicle={selectedVehicle}
        />
      )}

      {selectedVehicle && (
        <NewReservationModal
          show={isReservationModalOpen}
          handleClose={handleModalClose}
          handleSave={handleSaveReservation}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};

export default VehicleCatalog;