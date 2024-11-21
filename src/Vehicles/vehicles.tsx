import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, message, Modal } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { fetchVehicles, deleteVehicle } from "./vehicle.service";
import { Vehicle } from "./Ivehicle";
import VehicleInfoModal from "./VehicleInfo.modal";
import NewVehicleModal from "./Vehicle.modal";

const VehicleManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [tableData, setTableData] = useState<Vehicle[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isNewVehicleModalVisible, setIsNewVehicleModalVisible] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<number | null>(null);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const vehicles = await fetchVehicles();
      setAllVehicles(vehicles);
      setTableData(vehicles);
    };
    fetchData();
  }, []);

  const handleSaveVehicle = async (vehicleData: any) => {
    try {
      const vehicles = await fetchVehicles();
      setAllVehicles(vehicles);
      setTableData(vehicles);
    } catch (error) {
      message.error("Error al actualizar la lista de vehículos");
    }
  };

  const handleEdit = (vehicleId: number) => {
    alert(`Editar vehículo con ID: ${vehicleId}`);
  };

  const handleDelete = (vehicleId: number) => {
    setDeleteVehicleId(vehicleId);
    setIsConfirmDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteVehicleId !== null) {
      try {
        await deleteVehicle(deleteVehicleId);
        const updatedVehicles = allVehicles.filter(
          (vehicle) => vehicle.vehicleId !== deleteVehicleId
        );
        setAllVehicles(updatedVehicles);
        setTableData(updatedVehicles);
        message.success("Vehículo eliminado exitosamente.");
      } catch (error) {
        message.error("Error al eliminar el vehículo.");
      }
    }
    setIsConfirmDeleteModalVisible(false);
    setDeleteVehicleId(null);
  };

  const cancelDelete = () => {
    setIsConfirmDeleteModalVisible(false);
    setDeleteVehicleId(null);
  };

  const handleInfo = (vehicleId: number) => {
    const vehicle = allVehicles.find((v) => v.vehicleId === vehicleId);
    setSelectedVehicle(vehicle || null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedVehicle(null);
  };

  const handleAddVehicle = () => {
    setIsNewVehicleModalVisible(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setTableData(allVehicles);
    } else {
      setTableData(
        allVehicles.filter(
          (item) =>
            item.color.toLowerCase().includes(value) ||
            item.type.toLowerCase().includes(value)
        )
      );
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "vehicleId",
      key: "vehicleId",
    },
    {
      title: "Imagen",
      dataIndex: "image",
      key: "image",
      render: (_: any, vehicle: Vehicle) => {
        const brandName = vehicle.model?.brand?.brandName || "Sin marca";
        const modelName = vehicle.model?.modelName || "Sin modelo";
        const imageUrl = `/images/vehicles/${vehicle.licensePlate}-${modelName}-${brandName}.jpg`;
        return (
          <img
            src={imageUrl}
            alt="Vehículo"
            onError={(e) => {
              e.currentTarget.src = "images/vehicles/default.jpg"; // Imagen por defecto
            }}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        );
      },
      
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Marca",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Modelo",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Vehicle) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.vehicleId)}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.vehicleId)}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
          />
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => handleInfo(record.vehicleId)}
            shape="circle"
            size="small"
            title="Información"
            style={{ color: "green" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <h1>Administración de Vehículos</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input.Search
          placeholder="Buscar vehículos"
          onChange={handleSearch}
          value={searchTerm}
          style={{ width: "300px" }}
          enterButton
        />
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={handleAddVehicle}
        >
          Agregar Vehículo
        </Button>
      </div>
      <Table dataSource={tableData} columns={columns} />
      <VehicleInfoModal
        visible={isModalVisible}
        onClose={handleModalClose}
        vehicle={selectedVehicle}
      />
      <NewVehicleModal
        visible={isNewVehicleModalVisible}
        onClose={() => setIsNewVehicleModalVisible(false)}
        onSave={handleSaveVehicle}
      />
      <Modal
        title="Confirmación"
        visible={isConfirmDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Sí"
        cancelText="No"
      >
        <p>Este vehículo será eliminado, ¿desea continuar?</p>
      </Modal>
    </div>
  );
};

export default VehicleManagement;
