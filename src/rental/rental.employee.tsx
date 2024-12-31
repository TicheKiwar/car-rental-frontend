import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputNumber, DatePicker, message, Descriptions, Input } from "antd";
import moment from "moment";
import { Vehicle } from "../Vehicles/Ivehicle";
import { IRental } from "../types/rentail";
import { Client } from "../types/Client";
import { getClientByDni } from "../services/client.service";

interface ReservationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (reservationData: {
        reservationDate: string;
        reservationDays: number;
        clientID: number;
        vehicleId?: number;
    }) => Promise<void>;
    reservation?: IRental | null;
    vehicle?: Vehicle;
    isEditable?: boolean;
    isNew?: boolean;
}

const ReservationEmployeeModal: React.FC<ReservationModalProps> = ({
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
    const [client, setClient] = useState<Client | null>(null);
    const [isLoadingClient, setIsLoadingClient] = useState<boolean>(false);

    // Efecto para cargar los datos iniciales
    useEffect(() => {
        if (visible) {
            if (reservation) {
                // Convertir la fecha usando moment
                const reservationMoment = moment(reservation.rentalDate);
                
                // Actualizar los estados
                setReservationDate(reservationMoment);
                setReservationDays(reservation.rentalDays);
                setClient(reservation.client || null);
                
                // Calcular el costo total
                const cost = (reservation.rentalDays * reservation.vehicle.dailyRate).toFixed(2);
                setTotalCost(cost);

                // Actualizar todos los campos del formulario
                form.setFieldsValue({
                    dni: reservation.client?.dni || '',
                    name: `${reservation.client?.firstName || ''} ${reservation.client?.lastName || ''}`.trim(),
                    reservationDate: reservationMoment,
                    reservationDays: reservation.rentalDays,
                    totalCost: cost
                });
            } else {
                // Resetear el formulario y los estados para una nueva reserva
                form.resetFields();
                setReservationDate(null);
                setReservationDays(0);
                setTotalCost("0.00");
                setClient(null);
            }
        }
    }, [visible, reservation, form]);
    
    const handleDniChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const dni = event.target.value.trim();
        form.setFieldsValue({ name: '' });
        setClient(null);

        if (dni.length >= 10) {
            setIsLoadingClient(true);
            try {
                const clientData = await getClientByDni(dni);
                if (clientData) {
                    setClient(clientData);
                    form.setFieldsValue({ 
                        name: `${clientData.firstName} ${clientData.lastName}`
                    });
                    message.success("Cliente encontrado");
                }
            } catch (error) {
                message.error("No se encontró un cliente con esa cédula");
                form.setFieldsValue({ name: '' });
                setClient(null);
            } finally {
                setIsLoadingClient(false);
            }
        }
    };

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

        const days = Math.floor(value);
        setReservationDays(days);
        const newTotalCost = calculateTotalCost(days);
        setTotalCost(newTotalCost);
        form.setFieldsValue({ totalCost: newTotalCost });
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
            
            if (!client?.clientId) {
                message.error("Por favor, seleccione un cliente válido.");
                return;
            }

            const reservationData = {
                reservationDate: reservationDate.format("YYYY-MM-DD"),
                reservationDays,
                clientID: client.clientId
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
                        label="Cedula de Cliente"
                        name="dni"
                        rules={[{ required: true, message: "Por favor ingresa un numero de cedula valido" }]}
                    >
                        <Input
                            onChange={handleDniChange}
                            disabled={!isNew || !isEditable}
                            minLength={10}
                            maxLength={13}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nombre del Cliente"
                        name="name"
                    >
                        <Input
                            disabled={true}
                            style={{ width: "100%" }}
                            loading={isLoadingClient}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Fecha de Reserva"
                        name="reservationDate"
                        rules={[{ required: true, message: "Por favor selecciona una fecha" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            disabled={!isEditable}
                            disabledDate={(current) => {
                                if (reservation?.rentalDate) {
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
                            disabled={!isEditable}
                            min={1}
                            style={{ width: "100%" }}
                            onChange={handleDayChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Total"
                        name="totalCost"
                    >
                        <InputNumber
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

export default ReservationEmployeeModal;