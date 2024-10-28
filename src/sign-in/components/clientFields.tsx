import React from 'react';
import { Form, Input, Col, Row } from 'antd';
import { validatePhone } from '../../utils/validation';

const ClientFields = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="direccion" label="Dirección" rules={[]}>
        <Input placeholder="Dirección" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: 'Por favor ingrese su teléfono' },
          { validator: validatePhone },]}>
        <Input placeholder="Teléfono" />
      </Form.Item>
    </Col>
  </Row>
);

export default ClientFields;
