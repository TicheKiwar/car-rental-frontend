import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space } from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import fetchModels from "./model.service";
import { Model } from "./Imodel";

const ModelManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSource, setDataSource] = useState<Model[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const models = await fetchModels();
      setDataSource(models);
    };
    fetchData();
  }, []);

  const handleAddModel = () => {
    alert("Agregar nuevo modelo");
  };

  const handleEdit = (modelId: number) => {
    alert(`Editar modelo con ID: ${modelId}`);
  };

  const handleDelete = (modelId: number) => {
    alert(`Eliminar modelo con ID: ${modelId}`);
  };

  const handleInfo = (modelId: number) => {
    alert(`Mostrar información del modelo con ID: ${modelId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "modelId",
      key: "modelId",
    },
    {
      title: "Modelo",
      dataIndex: "modelName",
      key: "modelName",
    },
    {
      title: "Año",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Marca",
      dataIndex: ["brand", "brandName"], // Accede al nombre de la marca
      key: "brandName",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Model) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.modelId)}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.modelId)}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
          />
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => handleInfo(record.modelId)}
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
    setDataSource((prevData) =>
      prevData.filter((item) =>
        item.modelName.toLowerCase().includes(value) ||
        item.brand.brandName.toLowerCase().includes(value)
      )
    );
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "white", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "30px" }}>Alquiler de Vehículos</h1>
      <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: "24px" }}>Administración de Modelos</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input.Search
          placeholder="Buscar modelos"
          onChange={handleSearch}
          value={searchTerm}
          style={{ width: "300px" }}
          enterButton
        />
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={handleAddModel}
          style={{ marginLeft: "10px" }}
        >
          Añadir Modelo
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="modelId" />
    </div>
  );
};

export default ModelManagement;
