// CommonFields.jsx
import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const CommonFields = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="nombre"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingresa tu nombre' }, { pattern: /^[a-zA-Z\s]+$/, message: 'El nombre solo puede contener letras' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nombre" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="apellido"
        label="Apellido"
        rules={[{ required: true, message: 'Por favor ingresa tu apellido' }, { pattern: /^[a-zA-Z\s]+$/, message: 'El apellido solo puede contener letras' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Apellido" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="correo"
        label="Correo Electrónico"
        rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo válido' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Correo Electrónico" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="contraseña"
        label="Contraseña"
        rules={[{ required: true, message: 'Por favor ingresa una contraseña' }, { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
      </Form.Item>
    </Col>
  </Row>
);

export default CommonFields;
