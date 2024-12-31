import React from 'react';
import { Modal, Space } from 'antd';
import { DollarOutlined, CreditCardOutlined, WalletOutlined } from '@ant-design/icons';

const PaymentButton = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 mb-3 rounded-lg border hover:bg-gray-50 transition-all"
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-3 text-lg">{text}</span>
    </div>
    <span className="text-gray-400">→</span>
  </button>
);

const FormaPagoModal = ({ visible, onClose }) => {
  const handlePaymentSelect = (method) => {
    window.open(`/payment/${method}`, '_blank', 'width=500,height=600');
  };

  return (
    <Modal
      title="Selecciona una forma de pago"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Space direction="vertical" className="w-full">
        <PaymentButton
          icon={<CreditCardOutlined style={{ fontSize: '24px', color: '#4F46E5' }} />}
          text="Tarjeta de Crédito"
          onClick={() => handlePaymentSelect('card')}
        />
        <PaymentButton
          icon={<WalletOutlined style={{ fontSize: '24px', color: '#2563EB' }} />}
          text="PayPal"
          onClick={() => handlePaymentSelect('paypal')}
        />
        <PaymentButton
          icon={<DollarOutlined style={{ fontSize: '24px', color: '#059669' }} />}
          text="Efectivo"
          onClick={() => handlePaymentSelect('cash')}
        />
      </Space>
    </Modal>
  );
};

export default FormaPagoModal;