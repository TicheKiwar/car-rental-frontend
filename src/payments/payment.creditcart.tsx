import React, { useState } from 'react';
import { Card, Input, Button, Typography, Form, message } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { StorageService } from '../services/storage';
import { deposit } from '../services/payment.service';

const { Title } = Typography;

const CreditCardForm = () => {
  const [form] = Form.useForm();
  const methodPayment = 2
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

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
      title={
        <div className="flex items-center gap-2">
          <CreditCardOutlined style={{ color: '#1890ff', fontSize: '1.5rem' }} />
          <Title level={4}>Pago con Tarjeta</Title>
        </div>
      }
      bordered={true}
      style={{ maxWidth: 400, margin: '0 auto', padding: '16px' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Número de Tarjeta"
          name="cardNumber"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa el número de tarjeta',
            },
            {
              pattern: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
              message: 'Ingresa un número de tarjeta válido',
            },
          ]}
        >
          <Input
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            onChange={(e) => {
              form.setFieldsValue({
                cardNumber: formatCardNumber(e.target.value),
              });
            }}
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            label="Fecha de Expiración"
            name="expiry"
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa la fecha de expiración',
              },
              {
                pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                message: 'Formato válido: MM/YY',
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input
              placeholder="MM/YY"
              maxLength={5}
              onChange={(e) => {
                form.setFieldsValue({
                  expiry: formatExpiry(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa el CVV',
              },
              {
                pattern: /^\d{3,4}$/,
                message: 'Ingresa un CVV válido',
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input
              placeholder="123"
              maxLength={4}
              type="password"
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Nombre en la Tarjeta"
          name="name"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa el nombre en la tarjeta',
            },
            {
              pattern: /^[A-Za-z\s]+$/,
              message: 'El nombre solo debe contener letras y espacios',
            },
          ]}
        >
          <Input placeholder="NOMBRE APELLIDO" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Pagar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreditCardForm;
