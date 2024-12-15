import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

const ReturnManagment = () => {
  // Filtros
  const [fecha, setFecha] = useState("");
  const [cliente, setCliente] = useState("");
  const [auto, setAuto] = useState("");
  
  // Datos de ejemplo (simulados)
  const reservas = [
    {
      estado: "Pendiente",
      auto: "ABC123",
      fecha: "2024-12-15",
      cliente: "Juan Pérez",
      empleado: "Ana Gómez",
    },
    {
      estado: "Atrasado",
      auto: "XYZ789",
      fecha: "2024-12-10",
      cliente: "Carlos López",
      empleado: "Luis Martínez",
    },
    {
      estado: "Pendiente",
      auto: "LMN456",
      fecha: "2024-12-13",
      cliente: "Maria Sánchez",
      empleado: "Paola Ruiz",
    },
  ];

  // Datos filtrados según los filtros
  const [tableData, setTableData] = useState(reservas);

  // Filtrar la tabla cuando se cambian los filtros
  useEffect(() => {
    const filteredData = reservas.filter((reserva) => {
      return (
        (fecha ? reserva.fecha.includes(fecha) : true) &&
        (cliente ? reserva.cliente.toLowerCase().includes(cliente.toLowerCase()) : true) &&
        (auto ? reserva.auto.toLowerCase().includes(auto.toLowerCase()) : true)
      );
    });
    setTableData(filteredData);
  }, [fecha, cliente, auto]);

  const columns = [
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: string) => (
        <span style={{ color: estado === "Pendiente" ? "orange" : "green" }}>
          {estado}
        </span>
      ),
    },
    {
      title: "Auto",
      dataIndex: "auto",
      key: "auto",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
    },
    {
      title: "Empleado",
      dataIndex: "empleado",
      key: "empleado",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
          />
          <Button
            icon={<InfoCircleOutlined />}
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
      <h1>Devoluciones</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input
          placeholder="Filtrar por Fecha"
          onChange={(e) => setFecha(e.target.value)}
          value={fecha}
          style={{ width: "200px" }}
        />
        <Input
          placeholder="Filtrar por Cliente"
          onChange={(e) => setCliente(e.target.value)}
          value={cliente}
          style={{ width: "200px" }}
        />
        <Input
          placeholder="Filtrar por Auto"
          onChange={(e) => setAuto(e.target.value)}
          value={auto}
          style={{ width: "200px" }}
        />
      </div>

      <Table dataSource={tableData} columns={columns} rowKey="auto" />

    </div>
  );
};

export default ReturnManagment;
