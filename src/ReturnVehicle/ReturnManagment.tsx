import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, Form, Select, message } from "antd";
import { DollarCircleOutlined, EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ReturnInformacion from './RentalInfo';
import ModalForm from './ReturnForm';
import { getRentals, getReturnDetails,  postRentalReturn, payRental } from "../services/return.service";
import { ReturnDetails, ReturnCosts } from "../ReturnVehicle/IReturn";
import ModalFormCost from "./ReturnPayment";

const { Option } = Select;

const ReturnManagment = () => {
  const [cliente, setCliente] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>("TODOS");
  const [tableData, setTableData] = useState<ReturnDetails[]>([]);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReturnDetails | null>(null);
  const [visiblePaymentModal, setVisiblePaymentModal] = useState(false); // Estado para el modal de pago
  const [paymentDetails, setPaymentDetails] = useState<ReturnCosts | null>(null); // Datos del retorno
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
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
      (selectedStatus === "TODOS" || reserva.rental_status.toUpperCase() === selectedStatus)
    );
  });

  const handlePaymentClick = async (record: ReturnDetails) => {
    try {
      console.log("Datos: ", record);
      const details = await getReturnDetails(record.rental_id);
      setPaymentDetails(details); // Guarda los detalles en el estado
      setVisiblePaymentModal(true); // Muestra el modal
    } catch (error) {
      console.error("Error al obtener detalles de pago:", error);
      message.error("No se pudo cargar la información de pago. Intenta de nuevo.");
    }
  };

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

  const handlePayDetailsSubmit = async (formData) => {
    try {
      const response = await payRental(formData); // Reemplaza con tu servicio de envío
      console.log("Respuesta del servidor:", formData);
      message.success("Se registro su pago");
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
        let color = "";
        switch (rental_status.toUpperCase()) {
          case "ATRASADO":
            color = "red";
            break;
          case "EN CURSO":
            color = "blue";
            break;
          case "PAGADO":
            color = "green";
            break;
          case "PENDIENTE":
            color = "orange";
            break;
          default:
            color = "black"; // Default color if the status doesn't match
        }
        return <span style={{ color }}>{rental_status.toUpperCase()}</span>;
      },
    },
    {
      title: "Vehículo",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="Auto" style={{ width: "100px", height: "60px", objectFit: "cover" }} />
      ),
    },
    {
      title: "Fecha de reserva",
      dataIndex: "rental_date",
      key: "rental_date",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("es-ES"); // Formato dd/mm/yyyy
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Fecha máxima de entrega",
      key: "max_return_date",
      render: (_: any, record: ReturnDetails) => {
        const maxReturnDate = getMaxReturnDate(record.rental_date, record.rental_days);
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
      render: (_: any, record: ReturnDetails) => {
        const estado = record.rental_status.toUpperCase();
        return (
          <Space size="middle">
            <Button
              icon={<InfoCircleOutlined />}
              shape="circle"
              size="small"
              title="Información"
              style={{ color: "green" }}
              onClick={() => handleInfoClick(record)}
            />
            {/* Ícono de Edición */}
            {estado === "EN CURSO" && (
              <Button
                icon={<EditOutlined />}
                shape="circle"
                size="small"
                title="Editar"
                style={{ color: "#e65100" }}
                onClick={() => handleEditClick(record)}
              />
            )}

            {estado === "PENDIENTE" && (
              <Button
                icon={<DollarCircleOutlined />}
                shape="circle"
                size="small"
                title="Registrar Pago"
                style={{ color: "#1976d2" }}
                onClick={() => handlePaymentClick(record)} 
              />
            )}
          </Space>
        );
      },
    }
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

      {paymentDetails && (
        <ModalFormCost
          visible={visiblePaymentModal}
          onCancel={() => setVisiblePaymentModal(false)}
          reserva={paymentDetails}
          handleSubmit={handlePayDetailsSubmit}
          form={form}
        />
      )}
    </div>
  );
};

export default ReturnManagment;
