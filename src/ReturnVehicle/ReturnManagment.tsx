import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, Form } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ReturnInformacion from './ReturnInfo'; 
import ModalForm from './ReturnForm'; 
import { getRentals } from "../services/return.service";
import { ReturnDetails } from "../ReturnVehicle/IReturn";

const ReturnManagment = () => {
  const [fecha, setFecha] = useState("");
  const [cliente, setCliente] = useState("");
  const [auto, setAuto] = useState("");
  const [tableData, setTableData] = useState<ReturnDetails[]>([]);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReturnDetails | null>(null);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const rentals = await getRentals();
        setTableData(rentals);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchData();
  }, []);

  const filteredData = tableData.filter((reserva) => {
    return (
      (fecha ? reserva.reservation_date.includes(fecha) : true) &&
      (cliente
        ? `${reserva.client_first_name} ${reserva.client_last_name}`
            .toLowerCase()
            .includes(cliente.toLowerCase())
        : true) &&
      (auto ? reserva.image.toLowerCase().includes(auto.toLowerCase()) : true)
    );
  });

  const handleInfoClick = (record: ReturnDetails) => {
    setSelectedReservation(record);
    setVisibleInfo(true);
  };

  const handleEditClick = (record: ReturnDetails) => {
    setSelectedReservation(record);
    setVisibleEdit(true);
    form.setFieldsValue(record);
  };

  const handleSubmit = () => {
    console.log("Formulario enviado");
    setVisibleEdit(false);
  };

  const columns = [
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: () => (
        <span style={{ color: "orange" }}>
          Pendiente
        </span>
      ),
    },
    {
      title: "Auto",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="Auto" style={{ width: "100px", height: "60px", objectFit: "cover" }} />
      ),
    },
    {
      title: "Fecha",
      dataIndex: "reservation_date",
      key: "reservation_date",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      render: (_: any, record: ReturnDetails) =>
        `${record.client_first_name} ${record.client_last_name}`,
    },
    {
      title: "Empleado",
      dataIndex: "empleado",
      key: "empleado",
      render: (_: any, record: ReturnDetails) =>
        `${record.employee_first_name} ${record.employee_last_name}`,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: ReturnDetails) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
            onClick={() => handleEditClick(record)}
          />
          <Button
            icon={<InfoCircleOutlined />}
            shape="circle"
            size="small"
            title="Información"
            style={{ color: "green" }}
            onClick={() => handleInfoClick(record)}
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

      <Table dataSource={filteredData} columns={columns} rowKey="rental_id" />

      {selectedReservation && (
        <ReturnInformacion
          visible={visibleInfo}
          onClose={() => setVisibleInfo(false)}
          reserva={selectedReservation}
        />
      )}

      {selectedReservation && (
        <ModalForm
          visible={visibleEdit}
          onCancel={() => setVisibleEdit(false)}
          handleSubmit={handleSubmit}
          initialValues={selectedReservation}
          form={form}
        />
      )}
    </div>
  );
};

export default ReturnManagment;
