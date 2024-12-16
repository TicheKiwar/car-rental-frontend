import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Col, Row, Input, message } from 'antd';
import { getPositions } from '../../services/positions.service';
import { Position } from '../../types/Position';
import { validatePhone } from '../../utils/validation';

const { Option } = Select;

interface EmployeeFieldsProps {
  isEditing: boolean;
}

const EmployeeFields: React.FC<EmployeeFieldsProps> = ({ isEditing }) =>{
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 

  const loadPositions = async () => {
  setLoading(true);
  try {
    const response = await getPositions(); // Llama al servicio
    setPositions(response); // Almacena los datos
  } catch (error) {
    message.error('Error al cargar las posiciones'); // Maneja el error
  } finally {
    setLoading(false); // Desactiva la carga
  }
};

  useEffect(() => {
    loadPositions(); // Cargar posiciones cuando el componente se monte
  }, []);

  const disabledFutureDate = (current) => {
    return current && current > new Date();
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="position"
          label="Cargo"
          rules={[{ required: true, message: 'Por favor selecciona un cargo' }]}
        >
          <Select placeholder="Selecciona un cargo" 
          loading={loading} 
          labelInValue
          >
            {positions.map((position) => (
              <Option key={position.positionId} value={position.positionId}>
              {position.position}
            </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {!isEditing && (
      <Col span={12}>
        <Form.Item
          name="hireDatee"
          label="Fecha de Contratación"
          rules={[{ required: true, message: 'Por favor selecciona una fecha de contratación' }]}
        >
          <DatePicker style={{ width: '100%' }} disabledDate={disabledFutureDate} />
        </Form.Item>
      </Col>
      )}
      <Col span={12}>
        <Form.Item name="phone" label="Teléfono" rules={[{ required: true, message: 'Por favor ingrese su teléfono' },
          { validator: validatePhone },]}>
          <Input placeholder="Teléfono" />
        </Form.Item>
      </Col>

      <Col span={12}>
      <Form.Item
        name="salary"
        label="Salario"
        rules={[
          { required: true, message: 'Por favor ingresa el salario' },
          {
            validator(_, value) {
              if (value && value < 450) {
                return Promise.reject(new Error("El salario debe ser igual o mayor al salario mínimo"));
              }
              return Promise.resolve();
            },
          }
        ]}
      >
        <Input prefix="$" placeholder="Ingresa el salario" type="number" />
      </Form.Item>
      </Col>
    </Row>
  );
};

export default EmployeeFields;
