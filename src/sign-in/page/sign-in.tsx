import React, { useState } from 'react';
import { Form, Button, message, Typography, Input, Modal } from 'antd';
import { checkEmailOrDni, createClient, verifyEmailCode } from '../../services/sign-in.service';
import CommonFields from '../components/commonFields';
import { useNavigate } from 'react-router-dom';
import ClientFields from '../components/clientFields';
import Link from 'antd/es/typography/Link';
import { validateEmailOrDni } from '../../utils/validation';

const { Text } = Typography;

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Control del modal
  const [email, setEmail] = useState(''); // Guarda el email para el paso de verificación
  const [verificationLoading, setVerificationLoading] = useState(false); // Carga del botón de verificación

  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, dni } = values;
      setEmail(email);

      // Verifica si el email o dni ya están registrados
      const existEmailOrDni: any = await checkEmailOrDni(email, dni, 0);
      if (validateEmailOrDni(existEmailOrDni.emailExists, existEmailOrDni.dniExists)) {
        setLoading(false);
        return;
      }

      const userData = { ...form.getFieldsValue() };
      await createClient(userData);
      
      message.info('Se ha envíado un dódigo de verificación enviado a tu correo.');
      setIsModalVisible(true);
    } catch (error) {
      message.error('Error en el registro, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async (values: any) => {
    setVerificationLoading(true);
    try {
      const { verificationCode } = values;

      await verifyEmailCode(email, verificationCode);

      message.success('Registro exitoso. Correo verificado.');
      form.resetFields();
      setIsModalVisible(false); // Cierra el modal
      navigate('/');
    } catch (error) {
      message.error('Código de verificación incorrecto o expirado.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h2>Registro</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <CommonFields isEditing={false} />
        <ClientFields />
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
            Registrarse
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Verificar Correo Electrónico"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={onVerifyCode}>
          <Form.Item
            name="verificationCode"
            label="Código de Verificación"
            rules={[{ required: true, message: 'Por favor ingresa el código de verificación' }]}
          >
            <Input placeholder="Ingresa el código enviado a tu correo" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={verificationLoading}
              disabled={verificationLoading}
            >
              Verificar Código
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Text>
          ¿Ya tienes una cuenta?{' '}
          <Link onClick={() => navigate('/')}>Inicia Sesión</Link>
        </Text>
      </div>
    </div>
  );
};

export default RegistrationForm;
