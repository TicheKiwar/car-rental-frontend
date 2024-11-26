import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Select,
  DatePicker,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Vehicle, VehicleModel } from "./Ivehicle";
import { supabase } from "../services/client-supabase.service";
import moment from "moment";
import { createVehicle, fetchModels, updateVehicle } from "../services/vehicle.service";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

interface NewVehicleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (vehicleData: any) => void;
  vehicle?: Vehicle | null;
}

const NewVehicleModal: React.FC<NewVehicleModalProps> = ({
  visible,
  onClose,
  onSave,
  vehicle = null,
}) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const isEditMode = !!vehicle;

  useEffect(() => {
    if (visible) {
      if (!isEditMode) {
        form.resetFields();
        setImageFile(null);
        setSelectedModel(null);
      }
      fetchModels()
        .then((response) => setModels(response))
        .catch(() => message.error("Error al cargar los modelos de autos"));
    }
  }, [visible]);

  useEffect(() => {
    if (visible && isEditMode && vehicle) {
      form.setFieldsValue({
        ...vehicle,
        lastRevisionDatee: vehicle.lastRevisionDate ? moment(vehicle.lastRevisionDate, "YYYY-MM-DD") : null,
      });

      if (models.length > 0 && vehicle?.model) {
        const selectedModel = models.find(model => model.modelName === vehicle?.model.modelName);
        if (selectedModel) {
          form.setFieldsValue({ modelId: { value: selectedModel.modelId, label: selectedModel.modelName } });
        }
      }
    }
  }, [visible, isEditMode, vehicle, form, models]);

  const handleFileChange: UploadProps["onChange"] = (info) => {
    const { file } = info;
    if (file.status === "done" || file.status === "removed") {
      setImageFile(file.originFileObj || null);
    }
  };

  const handleCancel = () => {
    setCancelLoading(true);
    if (isDirty) {
      Modal.confirm({
        title: "Tiene información sin guardar",
        content: "¿Desea salir sin guardar?",
        okText: "Sí",
        cancelText: "No",
        onOk: () => {
          setIsDirty(false);
          setCancelLoading(false);
          onClose();

        },
        onCancel: () => setCancelLoading(false),
      });
    } else {
      setCancelLoading(false);
      onClose();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      if (!isEditMode && !imageFile) {
        message.error("Debe subir una imagen para crear el vehículo");
        setLoading(false);
        return;
      }

      let imageUrl = vehicle?.image || null;

      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("images-vehicles")
          .upload(`vehicles/${values.licensePlate || vehicle?.licensePlate}`, imageFile, {
            cacheControl: "3600",
            upsert: isEditMode,
          });

        if (error) throw new Error("Error al cargar la imagen");

        const imageToken = uuidv4();
        const { data: publicUrlData } = supabase.storage
          .from("images-vehicles")
          .getPublicUrl(`vehicles/${values.licensePlate || vehicle?.licensePlate}`);

        imageUrl = `${publicUrlData.publicUrl}?v=${imageToken}`;
      }

      const vehicleData = {
        ...values,
        image: imageUrl,
        modelId: Number(values.modelId.value),
        capacity: Number(values.capacity),
        maxSpeed: Number(values.maxSpeed),
        mileage: Number(values.mileage),
        doorCount: Number(values.doorCount),
        dailyRate: String(values.dailyRate),
        costDayDelay: String(values.costDayDelay),
        lastRevisionDate: values.lastRevisionDatee ? moment(values.lastRevisionDatee).format('YYYY-MM-DD') : null,
      };

      delete vehicleData.lastRevisionDatee;

      if (isEditMode) {
        await updateVehicle(vehicle?.vehicleId!, vehicleData);
        message.success("Vehículo actualizado exitosamente");
      } else {
        await createVehicle(vehicleData);
        message.success("Vehículo creado exitosamente");
      }
      form.resetFields();
      setImageFile(null);
      setSelectedModel(null);
      onSave(vehicleData);
    } catch (error) {
      console.error(error);
      message.error("Error al guardar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  const handleValuesChange = () => setIsDirty(true);

  return (
    <Modal
      title={isEditMode ? "Modificar Vehículo" : "Nuevo Vehículo"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} loading={cancelLoading}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          {isEditMode ? "Guardar Cambios" : "Guardar"}
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
          ...vehicle,
        }}
      >
        <Row gutter={16}>
          {/* Columna 1 */}
          <Col span={12}>
            <Form.Item label="Imagen" valuePropName="file">
              <Upload
                accept=".jpg,.jpeg,.png"
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
              <Input disabled={isEditMode} />
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
                <Option value="Disponible">Disponible</Option>
                <Option value="No Disponible">No Disponible</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Tarifa diaria"
              name="dailyRate"
              rules={[
                {
                  required: true,
                  message: "Ingrese la tarifa diaria"
                },
                {
                  validator(_, value) {
                    if (value <= 0) {
                      return Promise.reject("La tarifa diaria debe ser mayor a 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Capacidad"
              name="capacity"
              rules={[
                {
                  required: true,
                  message: "Ingrese la capacidad"
                },
                {
                  validator(_, value) {
                    if (value <= 0) {
                      return Promise.reject("La capacidad debe ser mayor a 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Velocidad máxima"
              name="maxSpeed"
              rules={[
                {
                  required: true,
                  message: "Ingrese la velocidad máxima"
                },
                {
                  validator(_, value) {
                    if (value <= 0) {
                      return Promise.reject("La velocidad máxima debe ser mayor a 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} />
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
                <Option value="Automatica">Automatica</Option>
                <Option value="Semi-Automatica">Semi-Automatica</Option>
                <Option value="Doble-Embrague">Doble Embrague</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Número de puertas"
              name="doorCount"
              rules={[
                {
                  required: true,
                  message: "Ingrese el número de puertas"
                },
                {
                  validator(_, value) {
                    if (value <= 0) {
                      return Promise.reject("El número de puertas debe ser mayor a 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Tipo de combustible"
              name="fuelType"
              rules={[{ required: true, message: "Seleccione el tipo de combustible" }]}
            >
              <Select>
                <Option value="Gasolina">Gasolina</Option>
                <Option value="Diesel">Diesel</Option>
                <Option value="Eléctrico">Electrico</Option>
                <Option value="Hibrido">Hibrido</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Kilometraje"
              name="mileage"
              rules={[
                {
                  required: true,
                  message: "Ingrese el kilometraje"
                },
                {
                  validator(_, value) {
                    if (value <= 0) {
                      return Promise.reject("El kilometraje debe ser mayor a 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Fecha de última revisión"
              name="lastRevisionDatee"
              rules={[{ required: true, message: "Ingrese la fecha de última revisión" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => current && current > moment().endOf("day")}
              />
            </Form.Item>
            <Form.Item
              label="Costo por día de retraso"
              name="costDayDelay"
              rules={[
                {
                  required: true,
                  message: "Ingrese el costo por día de retraso"
                },
                {
                  validator(_, value) {
                    if (value <= 0) {
                      return Promise.reject("El costo por día de retraso debe ser mayor a 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Modelo"
              name="modelId"
              rules={[{ required: true, message: "Seleccione un modelo" }]}
            >
              <Select
                placeholder="Seleccione un modelo"
                labelInValue
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
