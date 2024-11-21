import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
    form
      .validateFields()
      .then((values) => {
        const vehicleData = {
          ...values,
          image: imageFile,
        };
        onSave(vehicleData);
        message.success("Auto guardado exitosamente");
        form.resetFields();
        setImageFile(null);
        setIsDirty(false);
        onClose();
      })
      .catch(() => {
        message.error("No se guardó el auto. Verifique los campos.");
      });
  };

  const handleValuesChange = () => {
    setIsDirty(true);
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
              rules={[{ required: true, message: "Ingrese el tipo" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Estado"
              name="status"
              rules={[{ required: true, message: "Ingrese el estado" }]}
            >
              <Input />
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
              rules={[{ required: true, message: "Ingrese el color" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Precio por día"
              name="dailyRate"
              rules={[{ required: true, message: "Ingrese el precio por día" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Transmisión"
              name="transmission"
              rules={[{ required: true, message: "Ingrese la transmisión" }]}
            >
              <Input />
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
              rules={[{ required: true, message: "Ingrese el tipo de combustible" }]}
            >
              <Input />
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
              rules={[
                { required: true, message: "Ingrese la fecha de última revisión" },
              ]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              label="Fecha de registro"
              name="registrationDate"
              rules={[{ required: true, message: "Ingrese la fecha de registro" }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              label="Costo por día de retraso"
              name="costDayDelay"
              rules={[{ required: true, message: "Ingrese el costo por día de retraso" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewVehicleModal;
