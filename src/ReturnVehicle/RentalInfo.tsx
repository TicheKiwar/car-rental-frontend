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
      title={<Title level={3} style={{ fontSize: '24px', textAlign: 'center' }}>Información</Title>} // Título aumentado y centrado
      visible={visible}
      onCancel={onClose}
      footer={[<Button key="close" onClick={onClose}>Cerrar</Button>]}
      width={750} // Aumenté el tamaño del modal
    >
      <Row gutter={[24, 24]}> {/* Más espacio entre las columnas */}
        {/* Columna 1: Información del Cliente y del Auto */}
        <Col span={12}>
          {/* Información del Cliente */}
          <Title level={4} style={{ fontSize: '18px' }}>Información del Cliente</Title>
          <Text strong style={{ fontSize: '16px' }}>Cliente:</Text> <Text style={{ fontSize: '16px' }}>{clienteInfo.nombre}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Cédula:</Text> <Text style={{ fontSize: '16px' }}>{clienteInfo.cedula}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Celular:</Text> <Text style={{ fontSize: '16px' }}>{clienteInfo.celular}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Dirección:</Text> <Text style={{ fontSize: '16px' }}>{clienteInfo.direccion}</Text><br />
          
          {/* Información del Vehículo */}
          <Divider style={{ margin: '20px 0' }} />
          <Title level={4} style={{ fontSize: '18px' }}>Información del Vehículo</Title>
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
              <Text strong style={{ fontSize: '16px' }}>Placa:</Text> <Text style={{ fontSize: '16px' }}>{autoInfo.placa}</Text><br />
              <Text strong style={{ fontSize: '16px' }}>Marca:</Text> <Text style={{ fontSize: '16px' }}>{autoInfo.marca}</Text><br />
              <Text strong style={{ fontSize: '16px' }}>Modelo:</Text> <Text style={{ fontSize: '16px' }}>{autoInfo.modelo}</Text><br />
              <Text strong style={{ fontSize: '16px' }}>Color:</Text> <Text style={{ fontSize: '16px' }}>{autoInfo.color}</Text><br />
            </Col>
          </Row>
        </Col>

        {/* Columna 2: Información de la Reserva y del Empleado */}
        <Col span={12}>
          {/* Información de la Reserva */}
          <Title level={4} style={{ fontSize: '18px' }}>Información de la Reserva</Title>
          <Text strong style={{ fontSize: '16px' }}>Fecha Reservación:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.fechaReservacion}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Días de la Reservación:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.diasReservacion}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Costo por Día:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.costoPorDia}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Costo por Día Retraso:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.costoPorDiaDeRetraso}</Text><br />

          <Divider style={{ margin: '20px 0' }} />

          {/* Información del Empleado */}
          <Title level={4} style={{ fontSize: '18px' }}>Información del Empleado</Title>
          <Text strong style={{ fontSize: '16px' }}>Empleado Encargado:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.empleadoEncargado}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Cédula Empleado:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.cedulaEmpleado}</Text><br />
          <Text strong style={{ fontSize: '16px' }}>Teléfono del Empleado:</Text> <Text style={{ fontSize: '16px' }}>{reservaInfo.telefonoEmpleado}</Text><br />
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
