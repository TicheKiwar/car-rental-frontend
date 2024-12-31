import React, { useState } from 'react';
import { Card, Button, Alert, Input } from 'antd';
import { Banknote } from 'lucide-react';

const CashEmployeForm = () => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <Card title={
      <div className="flex items-center gap-2">
        <Banknote className="text-green-600" />
        <span>Pago en Efectivo</span>
      </div>
    }>
      <Alert
        message="Acuda a la sucursal más cercana para realizar el pago."
        type="info"
        className="mb-4"
      />

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 text-center rounded">
          <div className="text-2xl font-mono mb-2">ABC-123456-789</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Vigencia:</span>
            <span>48 horas</span>
          </div>
          <div className="flex justify-between">
            <span>Establecimientos Autorizados:</span>
            <span>Auto Pick</span>
          </div>
          <div className="flex justify-between">
            <span>Ubicación:</span>
            <span>Calle Bolívar y Rocafuerte, Ambato, Tungurahua, Ecuador.</span>
          </div>
        </div>

        <div className="space-y-2">
          <span>Ingrese el monto en efectivo</span>
          <Input
            value={amount}
            onChange={handleAmountChange}
            placeholder="Ingrese monto"
            type="number"
            min={0}
          />
        </div>

        <Button block>Descargar Instrucciones</Button>
      </div>
    </Card>
  );
};

export default CashEmployeForm;
