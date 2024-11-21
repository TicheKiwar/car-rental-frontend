import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space } from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import fetchBrands from "./brand.service";
import { Brand } from "./Ibrand";

const BrandManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSource, setDataSource] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const brands = await fetchBrands();
      setDataSource(brands);
    };
    fetchData();
  }, []);

  const handleAddBrand = () => {
    alert("Agregar nueva marca");
  };

  const handleEdit = (brandId: number) => {
    alert(`Editar marca con ID: ${brandId}`);
  };

  const handleDelete = (brandId: number) => {
    alert(`Eliminar marca con ID: ${brandId}`);
  };
  const handleInfo = (brandId: number) => {
    alert(`Mostrar información de la marca con ID: ${brandId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "brandId",
      key: "brandId",
    },
    {
      title: "Nombre de la Marca",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Brand) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.brandId)}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.brandId)}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
          />
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => handleInfo(record.brandId)}
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
      prevData.filter((item) => item.brandName.toLowerCase().includes(value))
    );
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "white", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "30px" }}>Alquiler de Vehículos</h1>
      <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: "24px" }}>Administración de Marcas</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input.Search
          placeholder="Buscar marcas"
          onChange={handleSearch}
          value={searchTerm}
          style={{ width: "300px" }}
          enterButton
        />
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={handleAddBrand}
          style={{ marginLeft: "10px" }}
        >
          Agregar Marca
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="brandId" />
    </div>
  );
};

export default BrandManagement;
