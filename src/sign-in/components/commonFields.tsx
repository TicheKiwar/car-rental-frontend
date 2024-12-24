import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { validateDni } from '../../utils/validation';

interface CommonFieldsProps {
  isEditing: boolean;
}

const CommonFields: React.FC<CommonFieldsProps> = ({ isEditing }) => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="dni" label="C.I." rules={[
              { required: true, message: 'Por favor ingrese su C.I.' },
              {
                validator: (_, value) =>
                  value && validateDni(value) ? Promise.resolve() : Promise.reject('Ingrese una C.I. válida'),
              },
            ]}
          >
            <Input placeholder="C.I." maxLength={10} disabled={isEditing} onKeyPress={(e) => /[0-9]/.test(e.key) || e.preventDefault()} />      
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="firstName"
        label="Nombre"
        rules={[
          { required: true, message: 'Por favor ingrese su nombre' },
          { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Ingrese un nombre válido' },
          {
            validator: (_, value) =>
              value && value.trim() !== ""
                ? Promise.resolve()
                : Promise.reject(new Error("El campo no puede estar vacío")),
          }
        ]}
      >
        <Input placeholder="Nombre" onKeyPress={(e) => /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(e.key) || e.preventDefault()}/>
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="lastName"
        label="Apellido"
        rules={[
          { required: true, message: 'Por favor ingrese su apellido' },
          { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Ingrese un apellido válido' },
          {
            validator: (_, value) =>
              value && value.trim() !== ""
                ? Promise.resolve()
                : Promise.reject(new Error("El campo no puede estar vacío")),
          }
        ]}
      >
        <Input placeholder="Apellido" onKeyPress={(e) => /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(e.key) || e.preventDefault()}/>
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="email"
        label="Correo Electrónico"
        rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo válido' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Correo Electrónico" />
      </Form.Item>
    </Col>
    {!isEditing && (
      <Col span={12}>
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'Por favor ingresa una contraseña' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            {
              validator: (_, value) =>
                value && value.trim() !== ""
                  ? Promise.resolve()
                  : Promise.reject(new Error("El campo no puede estar vacío")),
            }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>
      </Col>
    )}
  </Row>
);

export default CommonFields;
