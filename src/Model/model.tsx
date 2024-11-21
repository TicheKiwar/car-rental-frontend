import React, { useState, useEffect } from "react";
import { Input, Table, Button, Space, message, Modal} from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchModels, deleteModel } from "./model.service";
import { Model } from "./Imodel";
import NewModelModal from "./model.modal";

const ModelManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSource, setDataSource] = useState<Model[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);  // Guardar todos los modelos aquí
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<Model | undefined>(undefined);  // Cambiar a `Model | undefined`

  // Función para cargar los modelos
  const fetchData = async () => {
    const models = await fetchModels();
    setAllModels(models);  // Guardamos todos los modelos
    setDataSource(models); // Inicializamos la tabla con todos los modelos
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddModel = () => {
    setModelToEdit(undefined);  // Restablecer el modelo a editar
    setIsModalOpen(true);
  };

  const handleEdit = (modelId: number) => {
    const model = dataSource.find((model) => model.modelId === modelId);
    if (model) {
      setModelToEdit(model);  // Asignar el modelo para editar
      setIsModalOpen(true);
    }
  };

  const handleDelete = (modelId: number) => {
    Modal.confirm({
      title: "Confirmar Eliminación",
      content: "Se va a eliminar este registro. ¿Estás seguro?",
      okText: "Sí",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteModel(modelId);
          message.success("¡Eliminado correctamente!");
          fetchData();
        } catch (error) {
          message.error("No se pudo eliminar el modelo.");
        }
      },
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      // Si la búsqueda está vacía, restauramos todos los modelos
      setDataSource(allModels);
    } else {
      // Si hay un término de búsqueda, filtramos los modelos
      setDataSource(
        allModels.filter(
          (item) =>
            item.modelName.toLowerCase().includes(value) ||
            item.brand.brandName.toLowerCase().includes(value)
        )
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "modelId",
      key: "modelId",
    },
    {
      title: "Modelo",
      dataIndex: "modelName",
      key: "modelName",
    },
    {
      title: "Año",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Marca",
      dataIndex: ["brand", "brandName"],
      key: "brandName",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Model) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.modelId)}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.modelId)}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "white" }}>
      <h1>Alquiler de Vehículos</h1>
      <h2>Administración de Modelos</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input.Search
          placeholder="Buscar modelos"
          onChange={handleSearch}
          value={searchTerm}
          style={{ width: "300px" }}
        />
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={handleAddModel}
        >
          Añadir Modelo
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="modelId" />
      {/* Modal para crear o editar un modelo */}
      <NewModelModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        reloadModels={fetchData}
        modelToEdit={modelToEdit}  // Ahora modelToEdit es de tipo `Model | undefined`
      />
    </div>
  );
};

export default ModelManagement;
