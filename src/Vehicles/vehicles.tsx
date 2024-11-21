import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import fetchVehicles from "./vehicle.service";
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

  useEffect(() => {
    const fetchData = async () => {
      const vehicles = await fetchVehicles();
      setAllVehicles(vehicles);
      setTableData(vehicles);
    };
    fetchData();
  }, []);


  const handleEdit = (vehicleId: number) => {
    alert(`Editar vehículo con ID: ${vehicleId}`);
  };

  const handleDelete = (vehicleId: number) => {
    alert(`Eliminar vehículo con ID: ${vehicleId}`);
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

  const handleSaveVehicle = (vehicleData: any) => {
    console.log("Nuevo vehículo guardado:", vehicleData);
    setAllVehicles([...allVehicles, vehicleData]);
    setTableData([...allVehicles, vehicleData]);
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
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Status",
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
            style={{ color: "orange" }}
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

    setTableData(
      allVehicles.filter(
        (item) =>
          item.model.brand.brandName.toLowerCase().includes(value) || // Corregido: accede a la marca correctamente.
          item.model.modelName.toLowerCase().includes(value)         // Usa `modelName` para buscar el modelo.
      )
    );
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

    </div>

  );
};

export default VehicleManagement;
