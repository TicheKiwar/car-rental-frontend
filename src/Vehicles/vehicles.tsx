import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, message, Modal } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Vehicle } from "./Ivehicle";
import VehicleInfoModal from "./VehicleInfo.modal";
import NewVehicleModal from "./Vehicle.modal";
import { deleteVehicle, fetchVehicles } from "../services/vehicle.service";

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
      const updatedVehicles = await fetchVehicles();
      setAllVehicles(updatedVehicles);
      setTableData(updatedVehicles);
    } catch (error) {
      message.error("Error al guardar los datos del vehículo");
    } finally {
      setIsNewVehicleModalVisible(false);
      setSelectedVehicle(null);
    }
  };
  

  const handleEdit = (vehicleId: number) => {
    const vehicleToEdit = allVehicles.find((vehicle) => vehicle.vehicleId === vehicleId);
    if (vehicleToEdit) {
      setSelectedVehicle(vehicleToEdit);
      setIsNewVehicleModalVisible(true);
    }
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsNewVehicleModalVisible(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    if(vehicle.status !== 'Disponible'){
      message.warning("El vehículo no puede ser eliminado porque se encuentra ocupado o en mantenimiento")
      return
    }
    setDeleteVehicleId(vehicle.vehicleId
    );
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
        message.success("Vehículo eliminado correctamente");
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setTableData(allVehicles);
    } else {
      setTableData(
        allVehicles.filter(
          (item) =>
            item.model.brand.brandName.toLowerCase().includes(value) ||
            item.model.modelName.toLowerCase().includes(value)
        )
      );
    }
  };

  const columns = [
    {
      title: "Placa",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Imagen",
      key: "image",
      render: (_: any, record) => {
        const imageUrl = record.image
          ? `${record.image}`
          : `http://localhost:3000/images/vehicles/default.jpg`;

        return (
          <img
            src={imageUrl}
            alt={record.licensePlate}
            style={{
              width: "140px",
              height: "auto",
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
      dataIndex: ["model", "brand", "brandName"],
      key: "brand",
    },
    {
      title: "Modelo",
      dataIndex: ["model", "modelName"],
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
            id={`edit-${record.licensePlate}`}
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            shape="circle"
            size="small"
            id={`delete-${record.licensePlate}`}
            title="Eliminar"
            style={{ color: "red" }}
          />
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => handleInfo(record.vehicleId)}
            shape="circle"
            size="small"
            id={`info-${record.licensePlate}`}
            title="Información"
            style={{ color: "green" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "white", position: "relative" }}>
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
          id="add-vehicle"
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
        onClose={() => setIsNewVehicleModalVisible(false)}
        visible={isNewVehicleModalVisible}
        onSave={handleSaveVehicle}
        vehicle={selectedVehicle}
      />
      <Modal
        title="Confirmación"
        open={isConfirmDeleteModalVisible}
        onOk= {confirmDelete}
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
