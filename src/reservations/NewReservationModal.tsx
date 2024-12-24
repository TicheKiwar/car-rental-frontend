import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputNumber, DatePicker, message, Descriptions } from "antd";
import moment from "moment";
import { IReservation } from "../types/reservation";
import { Vehicle } from "../Vehicles/Ivehicle";
import { createReservation } from "../services/reservation.service";

interface ReservationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (reservationData: {
        reservationDate: string;
        reservationDays: number;
        totalCost: string;
        vehicleId: number;  // Remove optional flag since it's required for new reservations
    }) => Promise<void>;  // Update return type to Promise<void>
    reservation?: IReservation | null;
    vehicle?: Vehicle;
    isEditable?: boolean;
    isNew?: boolean;
}
const ReservationModal: React.FC<ReservationModalProps> = ({
    visible,
    onClose,
    onSave,
    reservation,
    vehicle,
    isEditable = true,
    isNew = false
}) => {
    const [form] = Form.useForm();
    const [reservationDate, setReservationDate] = useState<moment.Moment | null>(null);
    const [reservationDays, setReservationDays] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<string>("0.00");

    useEffect(() => {
        if (visible) {
            if (reservation) {
                setReservationDate(moment(reservation.reservationDate));
                setReservationDays(reservation.reservationDays);
                setTotalCost(reservation.totalCost.toString());

                form.setFieldsValue({
                    reservationDate: moment(reservation.reservationDate),
                    reservationDays: reservation.reservationDays,
                    totalCost: reservation.totalCost
                });
            } else {
                form.resetFields();
                setReservationDate(null);
                setReservationDays(0);
                setTotalCost("0.00");
            }
        }
    }, [visible, reservation, form]);

    const calculateTotalCost = (days: number) => {
        const selectedVehicle = reservation?.vehicle || vehicle;
        if (!selectedVehicle) {
            message.error("No se encontró el vehículo para calcular el costo total.");
            return "0.00";
        }

        const pricePerDay = parseFloat(selectedVehicle.dailyRate.toString());
        if (isNaN(pricePerDay)) {
            message.error("La tarifa diaria no es válida.");
            return "0.00";
        }

        const total = days * pricePerDay;
        return total.toFixed(2);
    };

    const handleDayChange = (value: number | null) => {
        if (value === null || value < 0) {
            setReservationDays(0);
            setTotalCost("0.00");
            return;
        }

        const days = Math.floor(value); // Aseguramos que sea un número entero
        setReservationDays(days);
        const newTotalCost = calculateTotalCost(days);
        setTotalCost(newTotalCost);
        
        // Actualizar el campo del formulario
        form.setFieldsValue({ totalCost: newTotalCost });
    };
    // Update the handleSave function in ReservationModal component
    const handleSave = async () => {
        try {
            await form.validateFields();

            if (!reservationDate) {
                message.error("Por favor, selecciona una fecha de reserva.");
                return;
            }
            if (reservationDays <= 0) {
                message.error("El número de días debe ser mayor a 0.");
                return;
            }
            if (!vehicle?.vehicleId) {
                message.error("No se ha seleccionado un vehículo.");
                return;
            }

            const reservationData = {
                reservationDate: reservationDate.format("YYYY-MM-DD"),
                reservationDays,
                totalCost,
                vehicleId: vehicle.vehicleId
            };

            await onSave(reservationData);
            onClose();
        } catch (error) {
            message.error("Por favor, completa todos los campos requeridos.");
        }
    };



    const selectedVehicle = reservation?.vehicle || vehicle;
    if (!selectedVehicle) return null;

    return (
        <Modal
            title={isNew ? "Nueva Reserva" : "Detalles de la Reserva"}
            open={visible}
            onCancel={onClose}
            footer={isEditable ? [
                <Button key="back" onClick={onClose}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={handleSave}>
                    {isNew ? "Reservar" : "Actualizar"}
                </Button>,
            ] : [
                <Button key="back" onClick={onClose}>
                    Cerrar
                </Button>
            ]}
            width={700}
        >
            <Descriptions title="Información del Vehículo" bordered column={2}>
                <Descriptions.Item label="Marca">
                    {selectedVehicle.model.brand.brandName}
                </Descriptions.Item>
                <Descriptions.Item label="Modelo">
                    {selectedVehicle.model.modelName}
                </Descriptions.Item>
                <Descriptions.Item label="Tipo">
                    {selectedVehicle.type}
                </Descriptions.Item>
                <Descriptions.Item label="Placa">
                    {selectedVehicle.licensePlate}
                </Descriptions.Item>
                <Descriptions.Item label="Tarifa Diaria" span={2}>
                    ${selectedVehicle.dailyRate}
                </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: "20px" }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Fecha de Reserva"
                        name="reservationDate"
                        rules={[{ required: true, message: "Por favor selecciona una fecha" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            value={reservationDate}
                            disabled={!isEditable}
                            disabledDate={(current) => {
                                if (reservation?.reservationDate === current?.format("YYYY-MM-DD")) {
                                    return false;
                                }
                                return current && current < moment().startOf("day");
                            }}
                            onChange={(date) => setReservationDate(date)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Días de Reserva"
                        name="reservationDays"
                        rules={[{ required: true, message: "Por favor ingresa el número de días" }]}
                    >
                        <InputNumber
                            value={reservationDays}
                            onChange={handleDayChange}
                            disabled={!isEditable}
                            min={1}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Total"
                        name="totalCost"
                    >
                        <InputNumber
                            value={Number(totalCost)} // Convierte a número
                            disabled
                            style={{
                                width: "100%",
                                fontWeight: "bold",
                                fontSize: "16px",
                                color: "#4CAF50",
                            }}
                            formatter={(value) => `$ ${value}`}
                        />
                    </Form.Item>

                </Form>
            </div>
        </Modal>
    );
};

export default ReservationModal;