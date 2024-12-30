import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, message, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { deleteReservation, fetchReservations, verifyReservation, updateReservation } from "../services/reservation.service";
import { IReservation } from "../types/reservation";

const ReservationManagement = () => {
  const [allReservations, setAllReservations] = useState<IReservation[]>([]);
  const [tableData, setTableData] = useState<IReservation[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);
  const [deleteReservationId, setDeleteReservationId] = useState<number | null>(null);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservations = await fetchReservations();
        setAllReservations(reservations);
        setTableData(reservations);
      } catch (error) {
       console.log("Error al cargar las reservas.");
      }
    };
    fetchData();
  }, []);

  const verifyReservationStatus = async (reservationId: number): Promise<boolean> => {
    try {
      const verificationResult = await verifyReservation(reservationId);
      return verificationResult.length === 0;
    } catch (error) {
      message.error("Error al verificar el estado de la reserva.");
      return false;
    }
  };

  const handleSaveReservation = async (reservationData: any) => {
    try {
      if (selectedReservation) {
        // Update existing reservation
        await updateReservation(selectedReservation.reservationId, reservationData);
        message.success("Reserva actualizada exitosamente");
      }

      // Refresh the reservations list
      const updatedReservations = await fetchReservations();
      setAllReservations(updatedReservations);
      setTableData(updatedReservations);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error al guardar los datos de la reserva.");
    } finally {
      setSelectedReservation(null);
    }
  };

  const handleEdit = async (reservationId: number) => {
    try {
      const canEdit = await verifyReservationStatus(reservationId);
      if (!canEdit) {
        message.warning("Esta reserva no puede ser modificada porque tiene rentas asociadas.");
        return;
      }

      const reservationToEdit = allReservations.find(
        (reservation) => reservation.reservationId === reservationId
      );
      if (reservationToEdit) {
        setSelectedReservation(reservationToEdit);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error("Error al verificar la reserva.");
    }
  };

  const handleDelete = async (reservation: IReservation) => {
    try {
      const canDelete = await verifyReservationStatus(reservation.reservationId);
      if (!canDelete) {
        message.warning("Esta reserva no puede ser eliminada porque tiene rentas asociadas.");
        return;
      }

      setDeleteReservationId(reservation.reservationId);
      setIsConfirmDeleteModalVisible(true);
    } catch (error) {
      message.error("Error al verificar la reserva.");
    }
  };

  const confirmDelete = async () => {
    if (deleteReservationId !== null) {
      try {
        await deleteReservation(deleteReservationId);
        const updatedReservations = allReservations.filter(
          (reservation) => reservation.reservationId !== deleteReservationId
        );
        setAllReservations(updatedReservations);
        setTableData(updatedReservations);
      } catch (error) {
        message.error("Error al eliminar la reserva.");
      }
    }
    setIsConfirmDeleteModalVisible(false);
    setDeleteReservationId(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      setTableData(allReservations);
    } else {
      setTableData(
        allReservations.filter((item) =>
          item.vehicle.licensePlate.toLowerCase().includes(value)
        )
      );
    }
  };

  const ActionButtons: React.FC<{ record: IReservation }> = ({ record }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [canModify, setCanModify] = useState(false);

    useEffect(() => {
      const checkReservation = async () => {
        setIsVerifying(true);
        const result = await verifyReservationStatus(record.reservationId);
        setCanModify(result);
        setIsVerifying(false);
      };
      checkReservation();
    }, [record.reservationId]);

    return (
      <Space size="middle">
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record.reservationId)}
          shape="circle"
          size="small"
          title="Editar"
          disabled={isVerifying || !canModify || allReservations.length === 0}
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
          shape="circle"
          size="small"
          title="Eliminar"
          disabled={isVerifying || !canModify || allReservations.length === 0}
        />
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => setSelectedReservation(record)}
          shape="circle"
          size="small"
          title="Información"
        />
      </Space>
    );
  };

  const columns = [
    {
      title: "Vehiculo",
      key: "vehicleImage",
      render: (_: any, record: IReservation) => (
        <img
          src={record.vehicle.image}
          alt={record.vehicle.model.modelName}
          style={{ width: "150px", height: "100px" }}
        />
      ),
    },
    {
      title: "Modelo",
      key: "vehicleModel",
      render: (_: any, record: IReservation) => <span>{record.vehicle.model.modelName}</span>,
    },
    {
      title: "Marca",
      key: "vehicleBrand",
      render: (_: any, record: IReservation) => <span>{record.vehicle.model.brand.brandName}</span>,
    },
    {
      title: "Tipo",
      key: "vehicleType",
      render: (_: any, record: IReservation) => <span>{record.vehicle.type}</span>,
    },
    {
      title: "Costo Dia",
      key: "DailyRate",
      render: (_: any, record: IReservation) => <span>{record.vehicle.dailyRate}</span>,
    },
    {
      title: "Fecha de Reserva",
      dataIndex: "reservationDate",
      key: "reservationDate",
    },
    {
      title: "Días de Reserva",
      dataIndex: "reservationDays",
      key: "reservationDays",
    },
    {
      title: "Costo Total",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: string) => `$${cost}`,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: IReservation) => <ActionButtons record={record} />,
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <h1>Administración de Reservas</h1>
      {/* <Input.Search
        placeholder="Buscar reservas"
        onChange={handleSearch}
        style={{ width: "300px", marginBottom: "20px" }} */}
      {/* /> */}
      <Table
        dataSource={tableData.map((item) => ({ ...item, key: item.reservationId }))}
        columns={columns}
      />
      {/* <ReservationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveReservation}
        reservation={selectedReservation}
        isEditable={true}
      /> */}
      <Modal
        title="Confirmación"
        open={isConfirmDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsConfirmDeleteModalVisible(false)}
        okText="Sí"
        cancelText="No"
      >
        <p>¿Estás seguro de que deseas Canselar esta renta?</p>
      </Modal>
    </div>
  );
};

export default ReservationManagement;
