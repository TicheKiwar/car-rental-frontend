import React, { useState } from "react";
import { Modal, Form, Input, Row, Col, Table, Checkbox } from "antd";
import moment from "moment";

const ModalForm = ({ visible, onCancel, form,  initialValues, handleSubmit }) => {
  const [data, setData] = useState([
    { key: 'placa', item: 'Placa', cumple: false, noCumple: false },
    { key: 'motor', item: 'Número de motor', cumple: false, noCumple: false },
    { key: 'chasis', item: 'Número de chasis', cumple: false, noCumple: false },
    { key: 'rayones', item: 'Rayones', cumple: false, noCumple: false },
    { key: 'abolladuras', item: 'Abolladuras', cumple: false, noCumple: false },
    { key: 'luces', item: 'Luces', cumple: false, noCumple: false },
    { key: 'neumaticos', item: 'Neumáticos', cumple: false, noCumple: false },
    { key: 'parabrisas', item: 'Parabrisas', cumple: false, noCumple: false },
    { key: 'espejos', item: 'Espejos', cumple: false, noCumple: false },
    { key: 'fluidosExtraños', item: 'Fluidos extraños', cumple: false, noCumple: false },
    { key: 'frenos', item: 'Frenos', cumple: false, noCumple: false },
    { key: 'documentos', item: 'Documentos', cumple: false, noCumple: false },
  ]);

  const handleCheckboxChange = (key, column) => {
    const newData = [...data];
    const index = newData.findIndex(item => item.key === key);
    if (index > -1) {
      newData[index][column] = !newData[index][column];
      if (column === 'cumple') {
        newData[index].noCumple = false;
      } else {
        newData[index].cumple = false;
      }
      setData(newData);
    }
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Cumple',
      dataIndex: 'cumple',
      key: 'cumple',
      render: (text, record) => (
        <Checkbox
          checked={record.cumple}
          onChange={() => handleCheckboxChange(record.key, 'cumple')}
        />
      ),
    },
    {
      title: 'No Cumple',
      dataIndex: 'noCumple',
      key: 'noCumple',
      render: (text, record) => (
        <Checkbox
          checked={record.noCumple}
          onChange={() => handleCheckboxChange(record.key, 'noCumple')}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Formulario de Renta de Vehículo"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Guardar"
      cancelText="Cancelar"
      width={900}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <h3>Información General</h3>
            <p><strong>Estado:</strong> {initialValues.estado}</p>
            <p><strong>Cliente:</strong> {initialValues.cliente}</p>
            <p><strong>Fecha de la renta:</strong> {moment(initialValues.fecha).format('DD/MM/YYYY')}</p>
            <h3>Información del Vehículo</h3>
            <Form.Item label="Nivel de gasolina" name="nivelGasolina">
              <Input />
            </Form.Item>
            <Form.Item label="Kilometraje final" name="kilometrajeFinal">
              <Input />
            </Form.Item>
            <Form.Item label="Costo por retraso" name="costoRetraso">
              <Input />
            </Form.Item>
            <Form.Item label="Observaciones" name="observaciones">
              <Input.TextArea />
            </Form.Item>
          </Col>

          <Col span={12}>
            <h3>Lista de Control</h3>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey="key"
              size="small"
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalForm;
