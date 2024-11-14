import React from 'react';
import { Form, Button, message } from 'antd';
import { createClient } from '../../services/sign-in.service';
import CommonFields from '../components/commonFields';
import { useNavigate } from 'react-router-dom';
import ClientFields from '../components/clientFields';

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const userData = { ...values};
      await createClient(userData);
      message.success('Registro exitoso');
      form.resetFields();
      navigate('/');
    } catch (error) {
      message.error('Error en el registro, intenta nuevamente.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h2>Registro</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <CommonFields />
        <ClientFields />
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
