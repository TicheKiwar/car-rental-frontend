import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Select, Button, message, Form } from "antd";
import { fetchBrands } from "./model.service";
import { Brand, Model } from "./Imodel";
import { createModel, updateModel } from "./model.service"; // Asegúrate de tener este servicio
import moment from "moment";

const { Option } = Select;

interface NewModelModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reloadModels: () => void;
  modelToEdit?: Model; // Parámetro opcional para pasar el modelo a editar
}

const NewModelModal: React.FC<NewModelModalProps> = ({
  isOpen,
  setIsOpen,
  reloadModels,
  modelToEdit,
}) => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener las marcas del backend cuando el modal se abre
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const fetchedBrands = await fetchBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        message.error("Error al cargar las marcas.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBrandData();

      if (modelToEdit) {
        form.setFieldsValue({
          modelName: modelToEdit.modelName,
          year: modelToEdit.year ? moment(`${modelToEdit.year}-01-01`) : null, // Si es edición, convierte el año a momento
          brandId: modelToEdit.brand.brandId,
        });
      } else {
        form.resetFields(); // Limpiar el formulario si es creación
      }
    }
  }, [isOpen, modelToEdit, form]);

  // Guardar el modelo, ya sea creando o editando
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const modelData = {
        modelName: values.modelName,
        year: values.year.year(), // Para moment.js
        brandId: values.brandId,
      };

      if (modelToEdit) {
        // Si estamos editando, llamamos a updateModel
        await updateModel(modelToEdit.modelId, modelData);
        message.success("Modelo actualizado con éxito.");
      } else {
        // Si estamos creando, llamamos a createModel
        await createModel(modelData);
        message.success("Modelo guardado con éxito.");
      }

      setIsOpen(false);
      form.resetFields();
      reloadModels();
    } catch (error) {
      message.error("Error al guardar el modelo. Intente nuevamente.");
    }
  };

  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: "Confirmar salida",
        content: "Tiene cambios sin guardar. ¿Está seguro de que desea salir?",
        onOk: () => {
          form.resetFields();
          setIsOpen(false);
        },
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Modal
      title={modelToEdit ? "Editar Modelo" : "Nuevo Modelo"}
      visible={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Guardar
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="modelName"
          label="Nombre"
          rules={[
            { required: true, message: "Por favor, ingrese el nombre del modelo" },
          ]}
        >
          <Input placeholder="Ingrese el nombre del modelo" />
        </Form.Item>
        <Form.Item
          name="year"
          label="Año"
          rules={[{ required: true, message: "Por favor, seleccione el año" }]}
        >
          <DatePicker picker="year" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="brandId"
          label="Marca"
          rules={[{ required: true, message: "Por favor, seleccione una marca" }]}
        >
          <Select placeholder="Seleccione una marca" loading={loading}>
            {brands.map((brand) => (
              <Option key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewModelModal;
