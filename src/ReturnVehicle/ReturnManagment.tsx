import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, Form, Select, message } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ReturnInformacion from './RentalInfo';
import ModalForm from './ReturnForm';
import { getRentals, postRentalReturn } from "../services/return.service";
import { ReturnDetails } from "../ReturnVehicle/IReturn";

const { Option } = Select;

const ReturnManagment = () => {
  const [cliente, setCliente] = useState("");
  const [auto, setAuto] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>("TODOS");
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
      (cliente
        ? `${reserva.client_first_name} ${reserva.client_last_name}`
            .toLowerCase()
            .includes(cliente.toLowerCase())
        : true) &&
      (auto ? reserva.image.toLowerCase().includes(auto.toLowerCase()) : true) &&
      (selectedStatus === "TODOS" || reserva.rental_status.toUpperCase() === selectedStatus)
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

  const handleSubmit = async (formData) => {
    try {
      const response = await postRentalReturn(formData); // Reemplaza con tu servicio de envío
      console.log("Respuesta del servidor:", response);
      message.success("Devolución registrada correctamente.");

      // Actualiza la tabla tras el envío exitoso
      const updatedRentals = await getRentals();
      setTableData(updatedRentals);

      setVisibleEdit(false); // Cierra el modal
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      message.error("Error al registrar la devolución. Intenta de nuevo.");
    }
  };

  const getMaxReturnDate = (reservation_date: string, reservation_days: number): string => {
    const date = new Date(reservation_date);
    date.setDate(date.getDate() + reservation_days);
    return date.toLocaleDateString("es-ES"); // Formato dd/mm/yyyy
  };

  const columns = [
    {
      title: "Estado",
      dataIndex: "rental_status",
      key: "estado",
      render: (rental_status: string) => {
        const color = rental_status.toUpperCase() === "ATRASADO" ? "red" : "orange";
        return <span style={{ color }}>{rental_status.toUpperCase()}</span>;
      },
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
      title: "Fecha de reserva",
      dataIndex: "reservation_date",
      key: "reservation_date",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("es-ES"); // Formato dd/mm/yyyy
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Fecha máxima de entrega",
      key: "max_return_date",
      render: (_: any, record: ReturnDetails) => {
        const maxReturnDate = getMaxReturnDate(record.reservation_date, record.reservation_days);
        return <span>{maxReturnDate}</span>;
      },
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
            icon={<InfoCircleOutlined />}
            shape="circle"
            size="small"
            title="Información"
            style={{ color: "green" }}
            onClick={() => handleInfoClick(record)}
          />
          <Button
            icon={<EditOutlined />}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "#e65100" }}
            onClick={() => handleEditClick(record)}
            disabled={record.rental_status.toUpperCase() === "PENDIENTE"} // Deshabilitar si el estado es "PENDIENTE"
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
        <Select
          placeholder="Filtrar por Estado"
          onChange={(value) => setSelectedStatus(value)}
          allowClear
          style={{ width: "200px" }}
          value={selectedStatus}
        >
          <Option value="TODOS">TODOS</Option>
          <Option value="PENDIENTE">PENDIENTE</Option>
          <Option value="EN CURSO">EN CURSO</Option>
          <Option value="PAGADO">PAGADO</Option>
          <Option value="ATRASADO">ATRASADO</Option>
        </Select>
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
          reserva={selectedReservation}
          form={form}
        />
      )}
    </div>
  );
};

export default ReturnManagment;
