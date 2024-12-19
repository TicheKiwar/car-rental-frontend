import React from 'react';
import { Form, Input, Col, Row } from 'antd';
import { validatePhone } from '../../utils/validation';

const ClientFields = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="address" label="Dirección" rules={[
        {
          validator: (_, value) =>
            value && value.trim() !== ""
              ? Promise.resolve()
              : Promise.reject(new Error("El campo no puede estar vacío")),
        }
      ]}>
        <Input placeholder="Dirección" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="phone" label="Teléfono" rules={[{ required: true, message: 'Por favor ingrese su teléfono' },
          { validator: validatePhone },]}>
        <Input placeholder="Teléfono" maxLength={10} onKeyPress={(e) => /[0-9]/.test(e.key) || e.preventDefault()}/>
      </Form.Item>
    </Col>
  </Row>
);

export default ClientFields;
