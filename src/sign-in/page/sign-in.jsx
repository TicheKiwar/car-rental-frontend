// RegistrationForm.jsx
import React, { useState } from 'react';
import { Form, Button, Radio, message, Row, Col } from 'antd';
import { createClient, createEmployee } from '../../services/sign-in.service';
import CommonFields from '../components/CommonFields';
import ClientFields from '../components/ClientFields';
import EmployeeFields from '../components/EmployeeFields';

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [userType, setUserType] = useState('cliente');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const userData = { ...values, rol: values.rol?.toLowerCase() };

      if (userType === 'empleado') {
        await createEmployee(userData);
      } else {
        await createClient(userData);
      }

      message.success('Registro exitoso');
      form.resetFields();
    } catch (error) {
      message.error('Error en el registro, intenta nuevamente.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h2>Registro</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tipo de Usuario">
          <Radio.Group onChange={handleUserTypeChange} value={userType}>
            <Radio value="cliente">Cliente</Radio>
            <Radio value="empleado">Empleado</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Campos Comunes */}
        <CommonFields />

        {/* Campos Específicos */}
        {userType === 'cliente' && <ClientFields />}
        {userType === 'empleado' && <EmployeeFields />}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationForm;
