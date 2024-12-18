import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, message, Space } from 'antd';
import { Client } from '../types/Client';
import CommonFields from '../sign-in/components/commonFields';
import ClientFields from '../sign-in/components/clientFields';
import { createClient, deleteClient, getClients, updateClient } from '../services/client.service';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ClientsManagement: React.FC = () => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClientes(data);
    } catch (error) {
      message.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = () => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      return parsedRole.roleId;
    }
    return null;
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(true);
    form.setFieldsValue({
      ...client,
      email: client.user.email,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este cliente?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        setLoadingDelete(id);
        try {
          await deleteClient(id);
          message.success('Cliente eliminado con éxito');
          fetchClients();
        } catch (error) {
          message.error('Error al eliminar el cliente');
        } finally {
          setLoadingDelete(null);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setLoadingSubmit(true);
    try {
      if (selectedClient) {
        await updateClient(selectedClient.clientId, values);
        setClientes(
          clientes.map((c) => c.clientId === selectedClient.clientId ? { ...c, ...values } : c)
        );
        message.success('Cliente actualizado con éxito');
      } else {
        const newClient = await createClient(values);
        setClientes([...clientes, newClient]);
        message.success('Cliente creado con éxito');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchClients();
    } catch (error) {
      message.error('Error al procesar la solicitud');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const columns = [
    { title: 'C.I.', dataIndex: 'dni', key: 'dni' },
    { title: 'Email', dataIndex: ['user', 'email'], key: 'email' },
    { title: 'Nombre', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Apellido', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
    { title: 'Dirección', dataIndex: 'address', key: 'address' },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Client) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          {getUserRole() === 1 && (
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.clientId)}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
            loading={loadingDelete === record.clientId}
          />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Gestión de Clientes</h1>
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }}
      >
        Agregar Cliente
      </Button>
      <Table
        dataSource={clientes}
        columns={columns}
        rowKey="clientId"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <Modal
        title={selectedClient ? 'Editar Cliente' : 'Crear Cliente'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <CommonFields isEditing={isEditing} />
          <ClientFields />
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loadingSubmit}>
              {isEditing ? 'Actualizar' : 'Registrar'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientsManagement;
