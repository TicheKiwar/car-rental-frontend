// ClientFields.jsx
import React from 'react';
import { Form, Input, Col, Row } from 'antd';

const ClientFields = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="direccion" label="Dirección" rules={[/* Reglas de validación */]}>
        <Input placeholder="Dirección" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="telefono" label="Teléfono" rules={[/* Reglas de validación */]}>
        <Input placeholder="Teléfono" />
      </Form.Item>
    </Col>
  </Row>
);

export default ClientFields;
