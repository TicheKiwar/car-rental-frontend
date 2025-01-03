import React, { useState } from 'react';
import { Card, Button, Typography, Form, Input, message } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import { StorageService } from '../services/storage';
import { deposit } from '../services/payment.service';

const { Text } = Typography;

const PayPalForm = () => {
  const methodPayment = 1;
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const data = StorageService.loadFromLocalStorage('rentalData');

    const payment = {
      rentalId:data.rentalId,
      paymentType : "DEPOSIT",
      paymentMethodId: methodPayment,
      amount: +values.amount
    }
    const result = await deposit(payment)
    if (!result) {
      StorageService.removeItem('rentalData');
      window.close();
    }else{
      message.error('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
    }

  };


  return (
    <Card
      style={{
        maxWidth: 400,
        margin: '0 auto',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <WalletOutlined style={{ fontSize: '24px', color: '#0070ba' }} />
        <Text strong style={{ fontSize: '18px' }}>
          Pago con PayPal
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* Campo de correo electrónico */}
        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa tu correo electrónico de PayPal',
            },
            {
              type: 'email',
              message: 'Por favor, ingresa un correo válido',
            },
          ]}
        >
          <Input placeholder="usuario@paypal.com" />
        </Form.Item>

        {/* Campo de monto */}
        <Form.Item
          label="Monto a Pagar"
          name="amount"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa el monto a pagar',
            },
            {
              pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
              message: 'Ingresa un monto válido (ej. 100.00)',
            },
          ]}
        >
          <Input prefix="$" placeholder="0.00" />
        </Form.Item>

        {/* Campo de descripción */}
        <Form.Item
          label="Descripción"
          name="description"
          
          
        >
          <Input.TextArea
            placeholder='Pago por Alquiler de Vehiculo'
            rows={3}
            disabled = {true}
          />
        </Form.Item>

        {/* Botón de enviar */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: '#0070ba',
              borderColor: '#005ea6',
              height: '45px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Pago
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PayPalForm;
