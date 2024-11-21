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
  const [deleteVehicleId, setDeleteVehicleId] = useState<number | null>(null); // Estado para almacenar el ID del vehículo a eliminar
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false); // Modal de confirmación

  // Fetch vehicles when the component loads
  useEffect(() => {
    const fetchData = async () => {
      const vehicles = await fetchVehicles();
      setAllVehicles(vehicles);
      setTableData(vehicles);
    };
    fetchData();
  }, []);

  // Handle saving a new vehicle
  const handleSaveVehicle = async (vehicleData: any) => {
    console.log("Nuevo vehículo guardado:", vehicleData);

    // Fetch all vehicles again to get the updated list
    try {
      const vehicles = await fetchVehicles();
      setAllVehicles(vehicles);
      setTableData(vehicles);
    } catch (error) {
      message.error("Error al actualizar la lista de vehículos");
    }
  };

  // Handle edit vehicle (example)
  const handleEdit = (vehicleId: number) => {
    alert(`Editar vehículo con ID: ${vehicleId}`);
  };

  // Handle delete vehicle
  const handleDelete = (vehicleId: number) => {
    setDeleteVehicleId(vehicleId); // Establecer el ID del vehículo a eliminar
    setIsConfirmDeleteModalVisible(true); // Mostrar el modal de confirmación
  };

  const confirmDelete = async () => {
    if (deleteVehicleId !== null) {
      try {
        await deleteVehicle(deleteVehicleId); // Llama al servicio para eliminar el vehículo
        // Actualiza la lista de vehículos después de la eliminación
        const updatedVehicles = allVehicles.filter(
          (vehicle) => vehicle.vehicleId !== deleteVehicleId
        );
        setAllVehicles(updatedVehicles);
        setTableData(updatedVehicles);
        //message.success("Vehículo eliminado exitosamente.");
      } catch (error) {
        message.error("Error al eliminar el vehículo.");
      }
    }
    setIsConfirmDeleteModalVisible(false); // Cierra el modal de confirmación
    setDeleteVehicleId(null); // Restablece el ID del vehículo a eliminar
  };

  const cancelDelete = () => {
    setIsConfirmDeleteModalVisible(false); // Cierra el modal sin eliminar
    setDeleteVehicleId(null); // Restablece el ID del vehículo a eliminar
  };

  // Handle vehicle info
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

  const columns = [
    {
      title: "No.",
      dataIndex: "vehicleId",
      key: "vehicleId",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="vehicle" style={{ width: 50, height: 50 }} />
      ),
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
            onClick={() => handleDelete(record.vehicleId)} // Llamada al servicio de eliminación
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

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "30px" }}>
        Alquiler de Vehículos
      </h1>
      <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: "24px" }}>
        Administración de Vehículos
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
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
          style={{ marginLeft: "10px" }}
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
      {/* Modal de Confirmación de Eliminación */}
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
