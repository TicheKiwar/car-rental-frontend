import React, { useState } from 'react';
import { Modal, Button, Row, Col, Divider, Typography, Image } from 'antd';

const { Title, Text } = Typography;

const ReturnInformacion = ({ visible, onClose, reserva }) => {
  const [imageVisible, setImageVisible] = useState(false);

  // Datos provenientes del objeto "reserva"
  const clienteInfo = {
    nombre: `${reserva.client_first_name} ${reserva.client_last_name}`,
    cedula: reserva.client_dni,
    celular: reserva.client_phone,
    direccion: reserva.client_address,
  };

  const autoInfo = {
    placa: reserva.license_plate,
    marca: reserva.brand_name,
    modelo: reserva.model_name,
    color: reserva.color,
    imagen: reserva.image,
  };

  const reservaInfo = {
    empleadoEncargado: `${reserva.employee_first_name} ${reserva.employee_last_name}`,
    cedulaEmpleado: reserva.employee_dni,
    telefonoEmpleado: reserva.employee_phone,
    fechaReservacion: reserva.reservation_date,
    diasReservacion: reserva.reservation_days,
    costoPorDia: reserva.daily_rate,
    costoPorDiaDeRetraso: reserva.cost_day_delay,
  };

  const handleImageClick = () => {
    setImageVisible(true);
  };

  return (
    <Modal
      title={<Title level={3} style={{ textAlign: 'center' }}>Información</Title>}
      visible={visible}
      onCancel={onClose}
      footer={[<Button key="close" onClick={onClose}>Cerrar</Button>]}
      width={750}
    >
      <Row gutter={[24, 24]}>
        {/* Columna 1: Información del Cliente y del Auto */}
        <Col span={12}>
          {/* Información del Cliente */}
          <Title level={4}>Información del Cliente</Title>
          <Text strong>Cliente:</Text> <Text>{clienteInfo.nombre}</Text><br />
          <Text strong>Cédula:</Text> <Text>{clienteInfo.cedula}</Text><br />
          <Text strong>Celular:</Text> <Text>{clienteInfo.celular}</Text><br />
          <Text strong>Dirección:</Text> <Text>{clienteInfo.direccion}</Text><br />

          {/* Información del Vehículo */}
          <Divider />
          <Title level={4}>Información del Vehículo</Title>
          <Row>
            <Col span={8}>
              <Image
                src={autoInfo.imagen}
                alt="Auto"
                width={100}
                height={75}
                preview={false}
                onClick={handleImageClick}
              />
            </Col>
            <Col span={16}>
              <Text strong>Placa:</Text> <Text>{autoInfo.placa}</Text><br />
              <Text strong>Marca:</Text> <Text>{autoInfo.marca}</Text><br />
              <Text strong>Modelo:</Text> <Text>{autoInfo.modelo}</Text><br />
              <Text strong>Color:</Text> <Text>{autoInfo.color}</Text><br />
            </Col>
          </Row>
        </Col>

        {/* Columna 2: Información de la Reserva y del Empleado */}
        <Col span={12}>
          {/* Información de la Reserva */}
          <Title level={4}>Información de la Reserva</Title>
          <Text strong>Fecha Reservación:</Text> <Text>{reservaInfo.fechaReservacion}</Text><br />
          <Text strong>Días de la Reservación:</Text> <Text>{reservaInfo.diasReservacion}</Text><br />
          <Text strong>Costo por Día:</Text> <Text>{reservaInfo.costoPorDia}</Text><br />
          <Text strong>Costo por Día Retraso:</Text> <Text>{reservaInfo.costoPorDiaDeRetraso}</Text><br />

          <Divider />

          {/* Información del Empleado */}
          <Title level={4}>Información del Empleado</Title>
          <Text strong>Empleado Encargado:</Text> <Text>{reservaInfo.empleadoEncargado}</Text><br />
          <Text strong>Cédula Empleado:</Text> <Text>{reservaInfo.cedulaEmpleado}</Text><br />
          <Text strong>Teléfono del Empleado:</Text> <Text>{reservaInfo.telefonoEmpleado}</Text><br />
        </Col>
      </Row>

      {/* Modal para previsualizar la imagen */}
      <Modal
        visible={imageVisible}
        footer={null}
        onCancel={() => setImageVisible(false)}
        width={600}
      >
        <Image src={autoInfo.imagen} alt="Imagen del Auto" />
      </Modal>
    </Modal>
  );
};

export default ReturnInformacion;
