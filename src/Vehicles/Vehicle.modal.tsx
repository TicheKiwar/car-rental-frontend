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
  Divider
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Vehicle, VehicleModel } from "./Ivehicle";
import { supabase } from "../services/client-supabase.service";
import moment from "moment";
import { checkLicensePlate, checkMotorOrChasis, createVehicle, fetchModels, updateVehicle } from "../services/vehicle.service";
import { v4 as uuidv4 } from "uuid";
import { validationRules } from "../utils/vehicle.validation";
import { fetchBrands } from "../Model/model.service";
import { Brand, Model } from "../Model/Imodel";
import { validateMotorOrChasis, validatePlate } from "../utils/validation";

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
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);

  const isEditMode = !!vehicle;

  useEffect(() => {
    if (visible) {
      if (!isEditMode) {
        form.resetFields();
        setImageFile(null);
        setSelectedModel(null);
      }
      fetchBrands()
        .then((response) => setBrands(response))
        .catch(() => message.error("Error al cargar las marcas"));
      fetchModels()
        .then((response) => setModels(response))
        .catch(() => message.error("Error al cargar los modelos"));
    }
  }, [visible]);

  const handleBrandChange = (brandId: number) => {
    const filtered = models.filter((model) => model.brand.brandId === brandId);
    setFilteredModels(filtered);
    form.setFieldsValue({ modelId: undefined }); // Resetear modelo seleccionado
  };


  useEffect(() => {
    if (visible && isEditMode && vehicle) {
      form.setFieldsValue({
        ...vehicle,
        brandId: vehicle.model?.brand?.brandId, // Establece el valor de la marca
        modelId: {
          value: vehicle.model?.modelId,
          label: vehicle.model?.modelName,
        },
        lastRevisionDatee: vehicle.lastRevisionDate
          ? moment(vehicle.lastRevisionDate, "YYYY-MM-DD")
          : null,
      });
    }
  }, [visible, isEditMode, vehicle, form]);

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

      if (isEditMode) {
        const existMotorOrChasis: any = await checkMotorOrChasis(values.motorNumber, values.chasisNumber, vehicle?.vehicleId!);
        
        if (validateMotorOrChasis(existMotorOrChasis.motorExists, existMotorOrChasis.chasisExists)) {
          setLoading(false);
          return;
        }

        const existPlate: any = await checkLicensePlate(values.licensePlate, vehicle?.vehicleId!);
        
        if (validatePlate(existPlate.plateExists)) {
          setLoading(false);
          return;
        }
      } else {
        const existMotorOrChasis: any = await checkMotorOrChasis(values.motorNumber, values.chasisNumber, 0);
        
        if (validateMotorOrChasis(existMotorOrChasis.motorExists, existMotorOrChasis.chasisExists)) {
          setLoading(false);
          return;
        }

        const existPlate: any = await checkLicensePlate(values.licensePlate, 0);
        if (validatePlate(existPlate.plateExists)) {
          setLoading(false);
          return;
        }
      }

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
            upsert: true,
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
        modelId: Number(values.modelId),
        capacity: Number(values.capacity),
        maxSpeed: Number(values.maxSpeed),
        mileage: Number(values.mileage),
        doorCount: Number(values.doorCount),
        dailyRate: String(values.dailyRate),
        costDayDelay: String(values.costDayDelay),
        lastRevisionDate: values.lastRevisionDatee ? moment(values.lastRevisionDatee).format('YYYY-MM-DD') : null,
        motorNumber: String(values.motorNumber),
        chasisNumber: String(values.chasisNumber),
      };

      delete vehicleData.lastRevisionDatee;
      delete vehicleData.brandId;

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
      width={1000}
    >
    <Form
  form={form}
  layout="vertical"
  onValuesChange={handleValuesChange}
  initialValues={{ licensePlate: "", ...vehicle }}
>
  <Row gutter={16}>
    {/* Columna 1 */}
    <Col span={8}>
      <Divider>Información del Vehículo</Divider>

      <Form.Item label="Imagen" valuePropName="file">
        <Upload
          accept=".jpg,.jpeg,.png"
          maxCount={1}
          beforeUpload={(file) => {
            setImageFile(file);
            return false;
          }}
          onRemove={() => setImageFile(null)}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Subir o arrastrar imagen</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Placa" name="licensePlate" rules={validationRules.licensePlate}>
        <Input disabled={isEditMode} />
      </Form.Item>

      <Form.Item name="brandId" label="Marca" rules={[{ required: true, message: "Seleccione una marca" }]}>
        <Select placeholder="Seleccione una marca" onChange={handleBrandChange}>
          {brands.map((brand) => (
            <Option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="modelId" label="Modelo" rules={[{ required: true, message: "Seleccione un modelo" }]}>
        <Select placeholder="Seleccione un modelo">
          {filteredModels.map((model) => (
            <Option key={model.modelId} value={model.modelId}>
              {model.modelName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Tipo" name="type" rules={validationRules.type}>
        <Select>
          <Option value="Economicos">Económicos</Option>
          <Option value="Familiares">Familiares</Option>
          <Option value="De lujo">De lujo</Option>
          <Option value="Deportivos">Deportivos</Option>
          <Option value="Utilitarios">Utilitarios</Option>
          <Option value="Ecologicos">Ecológicos</Option>
          <Option value="Especializados">Especializados</Option>
          <Option value="Transporte grupal">Transporte grupal</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Tarifa diaria" name="dailyRate" rules={validationRules.dailyRate}>
        <Input type="number" min={1} prefix="$"/>
      </Form.Item>

      <Form.Item label="Costo por día de retraso" name="costDayDelay" rules={validationRules.costDayDelay}>
        <Input type="number" min={1} prefix="$"/>
      </Form.Item>
    </Col>

    {/* Columna 2 */}
    <Col span={8}>
      <Divider>Especificaciones Técnicas</Divider>

      <Form.Item label="Transmisión" name="transmission" rules={validationRules.transmission}>
        <Select>
          <Option value="Manual">Manual</Option>
          <Option value="Automatica">Automática</Option>
          <Option value="Semi-Automatica">Semi-Automática</Option>
          <Option value="Doble-Embrague">Doble Embrague</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Capacidad" name="capacity" rules={validationRules.capacity}>
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item label="Velocidad máxima" name="maxSpeed" rules={validationRules.maxSpeed}>
        <Input type="number" min={1} suffix="km/h"/>
      </Form.Item>

      <Form.Item label="Número de puertas" name="doorCount" rules={validationRules.doorCount}>
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item label="Fecha de última revisión" name="lastRevisionDatee" rules={validationRules.lastRevisionDate}>
        <DatePicker
          style={{ width: "100%" }}
          disabledDate={(current) => current && current > moment().endOf("day")}
        />
      </Form.Item>
    </Col>

      {/* Columna 3 */}
      <Col span={8}>
      <Divider>Identificación del Vehículo</Divider>
        <Form.Item label="N. de Motor" name="motorNumber"
        rules={[
          { required: true, message: "Por favor, ingrese el número de motor" },
          { min: 5, max: 20, message: "Debe tener entre 5 y 20 caracteres" },
          {
            validator: (_, value) =>
              value && value.trim() !== ""
                ? Promise.resolve()
                : Promise.reject(new Error("El campo no puede estar vacío")),
          }
        ]}>
          <Input />
        </Form.Item>

        <Form.Item label="N. de Chasis" name="chasisNumber"
        rules={[
          { required: true, message: "Por favor, ingrese el número de chasis" },
          { min: 17, max: 17, message: "Debe tener exactamente 17 caracteres" },
          {
            validator: (_, value) =>
              value && value.trim() !== ""
                ? Promise.resolve()
                : Promise.reject(new Error("El campo no puede estar vacío")),
          }
        ]}
        >
          <Input />
        </Form.Item>

        <Divider>Detalles del Vehículo</Divider>

        <Form.Item label="Color" name="color" rules={validationRules.color}>
          <Select>
            <Option value="Rojo">Rojo</Option>
            <Option value="Azul">Azul</Option>
            <Option value="Verde">Verde</Option>
            <Option value="Amarillo">Amarillo</Option>
            <Option value="Negro">Negro</Option>
            <Option value="Blanco">Blanco</Option>
            <Option value="Naranja">Naranja</Option>
            <Option value="Purpura">Púrpura</Option>
            <Option value="Gris">Gris</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Tipo de combustible" name="fuelType" rules={validationRules.fuelType}>
          <Select>
            <Option value="Gasolina">Gasolina</Option>
            <Option value="Diesel">Diesel</Option>
            <Option value="Eléctrico">Eléctrico</Option>
            <Option value="Híbrido">Híbrido</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Kilometraje" name="mileage" rules={validationRules.mileage}>
          <Input type="number" suffix="km" min={1} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
    </Modal>
  );
};

export default NewVehicleModal;