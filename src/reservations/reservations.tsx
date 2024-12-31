import React, { useState, useEffect } from "react";
import {  Table, Button, Space, message, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,

  DollarOutlined,
  
} from "@ant-design/icons";
import { deleteReservation, fetchReservations, updateReservation, verifyReservation } from "../services/reservation.service";
import ReservationModal from "./reservation.modal";
import { IRental } from "../types/rentail";
import { IVerify } from "../types/Verify";

const ReservationManagement = () => {
  const [allReservations, setAllReservations] = useState<IRental[]>([]);
  const [tableData, setTableData] = useState<IRental[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IRental | null>(null);
  const [deleteReservationId, setDeleteReservationId] = useState<number | null>(null);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservations = await fetchReservations();
        const filteredReservations = reservations.filter(reservation => reservation.status !== 'CANCELADO');
        setAllReservations(filteredReservations);
        setTableData(filteredReservations);
      } catch (error) {
       console.log("Error al cargar las reservas.");
      }
    };
    fetchData();
  }, []);

  const verifyReservationStatus = async (verify:IVerify): Promise<boolean> => {
    try {
      const verificationResult = await verifyReservation(verify);
      return verificationResult.verifyDate||verificationResult.verifyHour
    } catch (error) {
      return false;
    }
  };

  const handleSaveReservation = async (reservationData: any) => {
    try {
      console.log("Reservation Data", reservationData);
      if (selectedReservation) {
        // Update existing reservation
        console.log("Updating reservation", selectedReservation.rentalId);
        await updateReservation(selectedReservation.rentalId, reservationData);
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
      console.log("Edit reservation", reservationId);
      const reservationToEdit = allReservations.find((reservation) => reservation.rentalId === reservationId);
  
      if (!reservationToEdit) {
        message.error("Reserva no encontrada.");
        return;
      }
  
      const canEdit = await verifyReservationStatus({
        createdAt: reservationToEdit.createdAt,
        rentalDate: reservationToEdit.rentalDate,
      });
  
      if (!canEdit) {
        return;
      }
  
      setSelectedReservation(reservationToEdit);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Error al verificar la reserva.");
    }
  };
  
  const handleDelete = async (reservation: IRental) => {
    console.log("Can delete ", (reservation.status === "En curso"));
    try {
      const canDelete = (reservation.status === "En curso");
      if (canDelete) {
        return;
      }
      setDeleteReservationId(reservation.rentalId);
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
          (reservation) => reservation.rentalId !== deleteReservationId
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


  const ActionButtons: React.FC<{ record: IRental }> = ({ record }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [canModify, setCanModify] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
  
    useEffect(() => {
      const checkReservation = async () => {
        setIsVerifying(true);
        const result = await verifyReservationStatus({
          createdAt: record.createdAt,
          rentalDate: record.rentalDate,
        });
        const canCancel = (record.status === "En curso");
        if (canCancel) {
          setCanDelete(false);
        }
        setCanDelete(true);
        setCanModify(result);
        setIsVerifying(false);
      };
      checkReservation();
    }, [record]);

    return (
      <Space size="middle">
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record.rentalId)}
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
          title="Cancelar"
          disabled={!canDelete}
        />
        <Button
          icon={<DollarOutlined style={{color:"green",}}/>}
          onClick={() => setSelectedReservation(record)}
          shape="circle"
          size="small"
          title="Pagar"
        />
      </Space>
    );
  };

  const columns = [
    {
      title: "Vehiculo",
      key: "vehicleImage",
      render: (_: any, record: IRental) => (
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
      render: (_: any, record: IRental) => <span>{record.vehicle.model.modelName}</span>,
    },
    {
      title: "Marca",
      key: "vehicleBrand",
      render: (_: any, record: IRental) => <span>{record.vehicle.model.brand.brandName}</span>,
    },
    {
      title: "Tipo",
      key: "vehicleType",
      render: (_: any, record: IRental) => <span>{record.vehicle.type}</span>,
    },
    {
      title: "Costo Dia",
      key: "DailyRate",
      render: (_: any, record: IRental) => <span>{record.vehicle.dailyRate}</span>,
    },
    {
      title: "Fecha de Alquiler",
      dataIndex: "reservationDate",
      key: "reservationDate",
      render: (_: any, record: IRental) => <span>{record.rentalDate}</span>,
    },
    {
      title: "Días",
      dataIndex: "reservationDays",
      key: "reservationDays",
      render: (_: any, record: IRental) => <span>{record.rentalDays}</span>,
    },
    {
      title: "Estado Renta",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: IRental) => <span>{record.status}</span>,
    },
    {
      title: "Costo",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (_: any, record: IRental) => <span style={{color:"green"}}> $ {record.rentalDays*record.vehicle.dailyRate}</span>,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: IRental) => <ActionButtons record={record} />,
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <h1>Administración de Reservas</h1>

      <Table
        dataSource={tableData.map((item) => ({ ...item, key: item.rentalId }))}
        columns={columns}
      />
      <ReservationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveReservation}
        reservation={selectedReservation}
        isEditable={true}
      />
      <Modal
        title="Confirmación"
        open={isConfirmDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsConfirmDeleteModalVisible(false)}
        okText="Sí"
        cancelText="No"
      >
        <p>¿Estás seguro de que deseas Cancelar esta reserva?</p>
      </Modal>
    </div>
  );
};

export default ReservationManagement;
