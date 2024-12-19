import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputNumber, DatePicker, message, Descriptions } from "antd";
import moment from "moment";
import { IReservation } from "../types/reservation";
import { Vehicle } from "../Vehicles/Ivehicle";

interface ReservationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (reservationData: {
        reservationId?: number;
        reservationDate: string;
        reservationDays: number;
        totalCost: string;
        vehicleId?: number;
    }) => void;
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
    const [totalCost, setTotalCost] = useState<string>("");

    useEffect(() => {
        if (visible) {
            if (reservation) {
                setReservationDate(moment(reservation.reservationDate));
                setReservationDays(reservation.reservationDays);
                calculateTotalCost(reservation.reservationDays);
                
                form.setFieldsValue({
                    reservationDate: moment(reservation.reservationDate),
                    reservationDays: reservation.reservationDays,
                });
            } else {
                form.resetFields();
                setReservationDate(null);
                setReservationDays(0);
                setTotalCost("");
            }
        }
    }, [visible, reservation, form]);

    // Asegurarse de que el cálculo se realice cuando cambie el número de días
    useEffect(() => {
        calculateTotalCost(reservationDays);
    }, [reservationDays]);

    const calculateTotalCost = (days: number) => {
        const selectedVehicle = reservation?.vehicle || vehicle;
        if (selectedVehicle && days > 0) {
            const pricePerDay = selectedVehicle.dailyRate;
            const total = days * pricePerDay;
            setTotalCost(total.toFixed(2));
            form.setFieldValue('totalCost', total.toFixed(2));
        } else {
            setTotalCost("0.00");
            form.setFieldValue('totalCost', "0.00");
        }
    };

    const handleDayChange = (value: number | null) => {
        const days = value || 0;
        setReservationDays(days);
        // El cálculo se realizará automáticamente por el useEffect
    };

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

            const reservationData = {
                
                reservationDate: reservationDate.format("YYYY-MM-DD"),
                reservationDays,
                totalCost,
                
            };

            onSave(reservationData);
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
                {/* <Descriptions.Item label="Placa">
                    {selectedVehicle.licensePlate}
                </Descriptions.Item> */}
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
                            value={totalCost}
                            disabled
                            style={{
                                width: "100%",
                                fontWeight: "bold",
                                fontSize: "16px",
                                color: "#4CAF50",
                            }}
                            prefix="$"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ReservationModal;