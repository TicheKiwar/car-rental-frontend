import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Button, Row, Col } from 'antd';
import { DollarOutlined } from '@ant-design/icons';  // Importamos el ícono de dinero

const ModalFormCost = ({ visible, onCancel, reserva, handleSubmit, form }) => {
  const [totalAmount, setTotalAmount] = useState(0);  // Estado para almacenar el total

  useEffect(() => {
    if (reserva) {
      form.setFieldsValue({
        delayCost: parseFloat(reserva.cost_day_delay) || 0,
        fuelCost: parseFloat(reserva.fuel_cost) || 0,
      });
      calculateTotal();  // Calcular el total cuando se cargan los valores
    }
  }, [reserva, form]);

  const delayCostValue = parseFloat(reserva?.cost_day_delay) || 0;
  const fuelCostValue = parseFloat(reserva?.fuel_cost) || 0;

  // Función para calcular el total
  const calculateTotal = () => {
    const formValues = form.getFieldsValue();
    const {
      delayCost,
      fuelCost,
      scratchesCost,
      dentsCost,
      lightsCost,
      tiresCost,
      windshieldCost,
      mirrorsCost,
      fluidsCost,
      brakesCost,
      documentsCost,
      additionalCosts,
    } = formValues;

    const total = (delayCost || 0) + (fuelCost || 0) +
      (scratchesCost || 0) + (dentsCost || 0) + (lightsCost || 0) +
      (tiresCost || 0) + (windshieldCost || 0) + (mirrorsCost || 0) +
      (fluidsCost || 0) + (brakesCost || 0) + (documentsCost || 0) +
      (additionalCosts || 0);

    setTotalAmount(total);  // Actualizamos el total
  };

  // Función para actualizar el total cuando el usuario modifica algún campo
  const onValuesChange = () => {
    calculateTotal();
  };

  // Condición para mostrar u ocultar los campos según el valor
  const showDelayCost = delayCostValue > 0;
  const showFuelCost = fuelCostValue > 0;

  return (
    <Modal
      title="PAGOS PENDIENTES"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={handleSubmit} onValuesChange={onValuesChange}>
        <Row gutter={16}>
          <Col span={12}>
            <div>
              <p><strong>Fecha de regreso:</strong> {reserva?.return_date}</p>
              <p><strong>Observaciones:</strong> {reserva?.observations}</p>
              <p><strong>Nº Motor:</strong> {reserva?.motor_number}</p>
              <p><strong>Nº Chasis:</strong> {reserva?.chasis_number}</p>
            </div>
            <div>
              <h4>DATOS CLIENTE</h4>
              <p><strong>Cliente:</strong> {reserva?.client_first_name} {reserva?.client_last_name}</p>
              <p><strong>Cedula:</strong> {reserva?.client_dni}</p>
              <p><strong>Teléfono:</strong> {reserva?.client_phone}</p>
              <p><strong>Direccion:</strong> {reserva?.client_address}</p>
            </div>
          </Col>

          <Col span={12}>
            <div>
              <h4>PAGOS ADICIONALES</h4>

              {showDelayCost && (
                <Form.Item name="delayCost" label="Costo por retraso">
                  <Row gutter={8}>
                    <Col span={16}>
                      <InputNumber
                        min={0}
                        value={delayCostValue}
                        disabled
                      />
                    </Col>
                    <Col span={8}>
                      <span>{reserva?.cost_day_delay} $</span>
                    </Col>
                  </Row>
                </Form.Item>
              )}

              {showFuelCost && (
                <Form.Item name="fuelCost" label="Costo combustible">
                  <Row gutter={8}>
                    <Col span={16}>
                      <InputNumber
                        min={0}
                        value={fuelCostValue}
                        disabled
                      />
                    </Col>
                    <Col span={8}>
                      <span>{reserva?.fuel_cost} $</span>
                    </Col>
                  </Row>
                </Form.Item>
              )}

              {!reserva?.scratches && (
                <Form.Item name="scratchesCost" label="Costo por Rayones">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.dents && (
                <Form.Item name="dentsCost" label="Costo por Abolladuras">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.lights && (
                <Form.Item name="lightsCost" label="Costo Luces">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.tires && (
                <Form.Item name="tiresCost" label="Costo por Neumáticos">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.windshield && (
                <Form.Item name="windshieldCost" label="Costo Parabrisas">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.mirrors && (
                <Form.Item name="mirrorsCost" label="Costo Espejos">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.foreign_fluids && (
                <Form.Item name="fluidsCost" label="Costo Fluidos Extraños">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.brakes && (
                <Form.Item name="brakesCost" label="Costo por Frenos">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              {!reserva?.documents && (
                <Form.Item name="documentsCost" label="Costo documentos">
                  <InputNumber min={0} />
                </Form.Item>
              )}

              <Form.Item name="additionalCosts" label="Costos adicionales">
                <InputNumber min={0} />
              </Form.Item>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <h3><DollarOutlined /> Total a Pagar: {totalAmount} $</h3>
            </div>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Pagar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormCost;
