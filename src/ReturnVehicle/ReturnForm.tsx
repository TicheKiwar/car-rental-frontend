import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, Table, Checkbox, message, InputNumber } from "antd"; // Importar message
import moment from "moment";

const ModalForm = ({ visible, onCancel, form, reserva, handleSubmit }) => {
  const [data, setData] = useState([
    { key: 'motor', item: `# Motor: ${reserva.motor_number || 'Cargando...'}`, cumple: false, noCumple: false },
    { key: 'chasis', item: `# Chasis: ${reserva.chasis_number || 'Cargando...'}`, cumple: false, noCumple: false },
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

  const [costDayDelay, setCostDayDelay] = useState(0); // Estado para almacenar el costo por tardanza
  const [diasAtrasados, setDiasAtrasados] = useState(0); // Estado para los días de retraso

  useEffect(() => {
    const today = moment();
    const rentalEndDate = moment(reserva.rental_date).add(reserva.rental_days, 'days');
    const calculatedCostDayDelay = today.isBefore(rentalEndDate)
      ? 0
      : today.diff(rentalEndDate, 'days') * reserva.cost_day_delay;
    const calculatedDiasAtrasados = today.isBefore(rentalEndDate)
      ? 0
      : today.diff(rentalEndDate, 'days');

    setCostDayDelay(calculatedCostDayDelay);
    setDiasAtrasados(calculatedDiasAtrasados); // Actualizamos los días de retraso
  }, [reserva]);

  const handleCheckboxChange = (key, column) => {
    const newData = [...data];
    const index = newData.findIndex(item => item.key === key);
    if (index > -1) {
      newData[index][column] = !newData[index][column];
      if (column === 'cumple') {
        newData[index].noCumple = false; // Desmarcar "Problemas" cuando "Todo OK" se marca
      } else {
        newData[index].cumple = false; // Desmarcar "Todo OK" cuando "Problemas" se marca
      }
      setData(newData);
    }
  };

  const handleSelectAll = (checked) => {
    const newData = data.map(item => ({
      ...item,
      cumple: checked,
      noCumple: false,  // Asegurarse de desmarcar "Problemas" cuando "Todo OK" se desmarque
    }));
    setData(newData);
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Todo OK
        </Checkbox>
      ),
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
      title: 'Problemas',
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

  const onFinish = (values) => {
    const returnDate = moment().format('YYYY-MM-DD');
    const returnTime = moment().format('HH:mm:ss');
    const observations = values.observaciones || 'Sin observaciones';
    const finalMileage = values.finalMileage ? Number(values.finalMileage) : 0;
    const finalFuelLevel = values.finalFuelLevel ? Number(values.finalFuelLevel) : 0;

    const fuelCost = finalFuelLevel < reserva.initial_fuel_level
    ? (reserva.initial_fuel_level - finalFuelLevel) * 2
    : 0;
    console.log("final:", finalFuelLevel, "inicial :", reserva.initial_fuel_level)
    //console.log("tipo:",typeof reserva.initial_fuel_level)
    const costPerDamages = 0;
    //const totalDays = moment().diff(moment(reserva.rental_date), "days");
    const vehicleStatus = data.some(item => item.noCumple) ? 'No Disponible' : 'Disponible';
    const allOk = data.every(item => item.cumple);
    const rentalStatus = fuelCost === 0 && costDayDelay === 0 && allOk ? 'pagado' : 'pendiente';


    const insertReturn = {
      rentalId: reserva.rental_id,
      employeeId: reserva.employe_rental_id,
      vehicleId: reserva.vehicle_id,
      returnDate,
      returnTime,
      observations,
      finalMileage,
      //totalDays,
      rentalStatus, // Actualización aquí
      finalFuelLevel,
      vehicleStatus,
      fuelCost,
      costDayDelay,
      costPerDamages,
      // Aquí se añaden los valores de los checkboxes
      scratches: !(data.find(item => item.key === 'rayones')?.noCumple ?? false),
      dents: !(data.find(item => item.key === 'abolladuras')?.noCumple ?? false),
      lights: !(data.find(item => item.key === 'luces')?.noCumple ?? false),
      tires: !(data.find(item => item.key === 'neumaticos')?.noCumple ?? false),
      windshield: !(data.find(item => item.key === 'parabrisas')?.noCumple ?? false),
      mirrors: !(data.find(item => item.key === 'espejos')?.noCumple ?? false),
      foreign_fluids: !(data.find(item => item.key === 'fluidosExtraños')?.noCumple ?? false),
      brakes: !(data.find(item => item.key === 'frenos')?.noCumple ?? false),
      documents: !(data.find(item => item.key === 'documentos')?.noCumple ?? false),
    };

    console.log("Datos preparados para enviar al backend:", insertReturn);
    // Muestra el modal de confirmación
    Modal.confirm({
      title: '¿Está seguro de que desea registrar esta devolución?',
      content: 'Una vez registrada, no se podrá modificar.',
      onOk: () => handleSubmit(insertReturn), // Si confirma, se llama a handleSubmit
    });
  };

  return (
    <Modal
      title="Formulario de Devolución de Vehículo"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Guardar"
      cancelText="Cancelar"
      width={900}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={reserva}
      >
        <Row gutter={16}>
          <Col span={12}>
            <h3>Información General</h3>
            <p style={{ margin: '2px 0' }}><strong>Cliente:</strong> {`${reserva.client_first_name} ${reserva.client_last_name}`}</p>
            <p style={{ margin: '2px 0' }}><strong>Fecha de la renta:</strong> {moment(reserva.rental_date).format('DD/MM/YYYY')}</p>
            <p style={{ margin: '2px 0' }}><strong>Nivel de Combustible Inicial:</strong> {reserva?.initial_fuel_level ?? 'Cargando...'} gal</p>
            <p style={{ margin: '2px 0' }}><strong>Costo por dia de Retraso:</strong> {reserva.cost_day_delay}</p>
            <p style={{ margin: '2px 0' }}><strong>Días de retraso:</strong> {diasAtrasados}</p>
            <p style={{ margin: '2px 0' }}><strong>Costo por tardanza:</strong> {costDayDelay ?? 'Cargando...'} $</p>

            <h3>Información del Vehículo</h3>
            <Form.Item
              label="Nivel de Combsutible"
              name="finalFuelLevel"
              rules={[{ required: true, message: 'Por favor ingrese el kilometraje final' }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Kilometraje Final"
              name="finalMileage"
              rules={[
                { required: true, message: "El kilometraje final es obligatorio" },
                {
                  validator: (_, value) => {
                    if (value <= 0) {
                      return Promise.reject("El kilometraje final debe ser mayor a 0");
                    }
                    if (value <= reserva.mileage) {
                      return Promise.reject(`El kilometraje final debe ser mayor al kilometraje inicial: ${reserva.mileage}`);
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
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
