import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, Row, Col, Select, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { VehicleModel } from "./Ivehicle";
import { fetchModels } from "./vehicle.service";
import { createVehicle } from "./vehicle.service";  // Asegúrate de tener la función para crear el vehículo

const { Option } = Select;

const NewVehicleModal = ({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (vehicleData: any) => void;
}) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

  useEffect(() => {
    if (visible) {
      fetchModels()
        .then((response) => {
          setModels(response);
        })
        .catch(() => {
          message.error("Error al cargar los modelos de autos");
        });
    }
  }, [visible]);

  const handleFileChange = (info: any) => {
    const { file } = info;
    if (file.status === "done" || file.status === "removed") {
      setImageFile(file.originFileObj || null);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Modal.confirm({
        title: "Tiene información sin guardar",
        content: "¿Desea salir sin guardar?",
        okText: "Sí",
        cancelText: "No",
        onOk: () => {
          setIsDirty(false);
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (!selectedModel) {
      message.error("Debe seleccionar un modelo de vehículo");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const vehicleData = {
          ...values,
          modelId: selectedModel?.modelId,
          capacity: Number(values.capacity),
          maxSpeed: Number(values.maxSpeed),
          mileage: Number(values.mileage),
          doorCount: Number(values.doorCount),
          dailyRate: String(values.dailyRate), // Parsear a número decimal
          costDayDelay: String(values.costDayDelay), // Parsear a número decimal
          lastRevisionDate: values.lastRevisionDate?.format("YYYY-MM-DD"),
          registrationDate: values.registrationDate?.format("YYYY-MM-DD"),
        };

        console.log("Datos que se enviarán al backend:", vehicleData);

        Modal.confirm({
          title: "Confirmar guardado",
          content: "¿Está seguro de que desea guardar este vehículo?",
          okText: "Sí",
          cancelText: "No",
          onOk: () => {
            createVehicle(vehicleData)  // Llama a la API para guardar el vehículo
              .then((response) => {
                message.success("Auto guardado exitosamente");
                form.resetFields();
                setImageFile(null);
                setSelectedModel(null);
                setIsDirty(false);
                onClose();
                window.location.reload();
              })
              .catch(() => {
                message.error("No se guardó el auto. Verifique los campos.");
              });
          },
        });
      })
      .catch(() => {
        message.error("No se guardó el auto. Verifique los campos.");
      });
  };

  const handleValuesChange = () => {
    setIsDirty(true);
  };

  const handleModelChange = (value: any) => {
    const model = models.find((model) => model.modelId === value);
    setSelectedModel(model || null);
  };

  return (
    <Modal
      title="Nuevo Auto"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Guardar
        </Button>,
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={{
          licensePlate: "",
          type: "",
          status: "",
          dailyRate: "",
          capacity: "",
          maxSpeed: "",
          color: "",
          transmission: "",
          doorCount: "",
          fuelType: "",
          mileage: "",
          lastRevisionDate: "",
          registrationDate: "",
          costDayDelay: "",
        }}
      >
        <Row gutter={16}>
          {/* Columna 1 */}
          <Col span={12}>
            <Form.Item label="Imagen" valuePropName="file">
              <Upload
                accept="image/*"
                maxCount={1}
                onChange={handleFileChange}
                beforeUpload={() => false}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Subir o arrastrar imagen</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Placa"
              name="licensePlate"
              rules={[{ required: true, message: "Ingrese la placa" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tipo"
              name="type"
              rules={[{ required: true, message: "Ingrese el tipo de vehículo" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Estado"
              name="status"
              rules={[{ required: true, message: "Seleccione el estado del vehículo" }]}
            >
              <Select>
                <Option value="Available">Available</Option>
                <Option value="Unavailable">Unavailable</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Tarifa diaria"
              name="dailyRate"
              rules={[{ required: true, message: "Ingrese la tarifa diaria" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Capacidad"
              name="capacity"
              rules={[{ required: true, message: "Ingrese la capacidad" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Velocidad máxima"
              name="maxSpeed"
              rules={[{ required: true, message: "Ingrese la velocidad máxima" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Ingrese el color del vehículo" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Columna 2 */}
          <Col span={12}>
            <Form.Item
              label="Transmisión"
              name="transmission"
              rules={[{ required: true, message: "Seleccione la transmisión" }]}
            >
              <Select>
                <Option value="Manual">Manual</Option>
                <Option value="Automatic">Automatic</Option>
                <Option value="Semi-Automatic">Semi-Automatic</Option>
                <Option value="Dual-Clutch">Dual-Clutch</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Número de puertas"
              name="doorCount"
              rules={[{ required: true, message: "Ingrese el número de puertas" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Tipo de combustible"
              name="fuelType"
              rules={[{ required: true, message: "Seleccione el tipo de combustible" }]}
            >
              <Select>
                <Option value="Gasoline">Gasoline</Option>
                <Option value="Diesel">Diesel</Option>
                <Option value="Electricity">Electricity</Option>
                <Option value="Hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Kilometraje"
              name="mileage"
              rules={[{ required: true, message: "Ingrese el kilometraje" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Fecha de última revisión"
              name="lastRevisionDate"
              rules={[{ required: true, message: "Ingrese la fecha de última revisión" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Fecha de registro"
              name="registrationDate"
              rules={[{ required: true, message: "Ingrese la fecha de registro" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Costo por día de retraso"
              name="costDayDelay"
              rules={[{ required: true, message: "Ingrese el costo por día de retraso" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Modelo"
              name="modelId"
              rules={[{ required: true, message: "Seleccione un modelo" }]}
            >
              <Select
                placeholder="Seleccione un modelo"
                onChange={handleModelChange}
                value={selectedModel ? selectedModel.modelId : undefined}
              >
                {models.map((model) => (
                  <Option key={model.modelId} value={model.modelId}>
                    {model.modelName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewVehicleModal;
