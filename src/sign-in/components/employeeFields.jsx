// EmployeeFields.jsx
import React from 'react';
import { Form, Select, DatePicker, Col, Row } from 'antd';

const { Option } = Select;

const EmployeeFields = () => {
  // Función para desactivar fechas futuras
  const disabledFutureDate = (current) => {
    // Verifica si la fecha es después de hoy
    return current && current > new Date();
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="puesto" label="Puesto" rules={[{ required: true, message: 'Por favor selecciona tu puesto' }]}>
          <Select placeholder="Selecciona un puesto">
            <Option value="gerente">Gerente</Option>
            <Option value="agente_de_alquiler">Agente de Alquiler</Option>
            <Option value="coordinador">Coordinador</Option>
            <Option value="mantenimiento">Mantenimiento</Option>
            <Option value="recepcionista">Recepcionista</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="fechaContratacion"
          label="Fecha de Contratación"
          rules={[{ required: true, message: 'Por favor selecciona una fecha de contratación' }]}
        >
          {/* Desactiva fechas futuras en el DatePicker */}
          <DatePicker style={{ width: '100%' }} disabledDate={disabledFutureDate} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Por favor selecciona un rol' }]}>
          <Select placeholder="Selecciona un rol">
            <Option value="empleado">Empleado</Option>
            <Option value="administrador">Administrador</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default EmployeeFields;
