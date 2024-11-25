import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, Row, Col, Select, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { VehicleModel } from "./Ivehicle";
import { fetchModels } from "./vehicle.service";
import { createVehicle } from "./vehicle.service";  // Asegúrate de tener la función para crear el vehículo
import axios from "axios";

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
  const API_URL = "http://localhost:3000";

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

  const handleSave = async () => {
    if (!selectedModel) {
      message.error("Debe seleccionar un modelo de vehículo");
      return;
    }
  
    form.validateFields().then(async (values) => {
      if (!imageFile) {
        message.error("Debe subir una imagen");
        return;
      }
  
      try {
        // Crear un FormData para enviar el archivo de imagen al backend
        const formData = new FormData();
        formData.append("file", imageFile);  // Enviar el archivo de imagen
        formData.append("licensePlate", values.licensePlate);  // Enviar otros datos necesarios
        formData.append("model", selectedModel.modelName);     // Nombre del modelo
        formData.append("brand", selectedModel.brand.brandName);  // Nombre de la marca
  
        // Subir la imagen al backend
        const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        // Obtener la ruta de la imagen de la respuesta
        const imagePath = uploadResponse.data.imagePath;
  
        // Crear el objeto de datos del vehículo
        const vehicleData = {
          ...values,
          image: imagePath, // Incluir la ruta de la imagen, no el archivo
          modelId: selectedModel?.modelId,
          capacity: Number(values.capacity),
          maxSpeed: Number(values.maxSpeed),
          mileage: Number(values.mileage),
          doorCount: Number(values.doorCount),
          dailyRate: String(values.dailyRate),
          costDayDelay: String(values.costDayDelay),
          lastRevisionDate: values.lastRevisionDate?.format("YYYY-MM-DD"),
          registrationDate: values.registrationDate?.format("YYYY-MM-DD"),
        };
  
        console.log(vehicleData);
        // Enviar los datos del vehículo al backend
        await createVehicle(vehicleData);
        message.success("Vehículo guardado exitosamente");
        form.resetFields();
        setImageFile(null);
        setSelectedModel(null);
        onClose();
      } catch (error) {
        message.error("Error al guardar el vehículo o la imagen");
      }
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
                <Option value="Available">Disponible</Option>
                <Option value="Unavailable">No Disponible</Option>
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
                <Option value="Automatic">Automatica</Option>
                <Option value="Semi-Automatic">Semi-Automatica</Option>
                <Option value="Dual-Clutch">Doble Embrague</Option>
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
                <Option value="Gasoline">Gasolina</Option>
                <Option value="Diesel">Diesel</Option>
                <Option value="Electricity">Electrico</Option>
                <Option value="Hybrid">Hibrido</Option>
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
