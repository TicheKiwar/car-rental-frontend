import React, { useState } from 'react';
import { Modal, Form, Input, Button, InputNumber } from 'antd';

const FuelLevelModal = ({ visible, onClose, onSubmit,reservation }) => {
  const [form] = Form.useForm();

  
  const handleSubmit = async (values) => {
    await onSubmit(values.initialFuelLevel,reservation.rentalId);
    form.resetFields(); // Limpiar los campos después de enviar
    onClose(); // Cerrar el modal
  };

  return (
    <Modal
      title="Nivel Inicial de Combustible"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ initialFuelLevel: '' }}
      >
        {/* Campo para el nivel inicial de combustible */}
        <Form.Item
          label="Nivel Inicial de Combustible"
          name="initialFuelLevel"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el nivel inicial de combustible',
            },
            {
              pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
              message: 'Ingresa un número válido (ej. 10.5)',
            },
          ]}
        >
          <InputNumber placeholder="0.00" />
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
              fontWeight: 'bold',
            }}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FuelLevelModal;
