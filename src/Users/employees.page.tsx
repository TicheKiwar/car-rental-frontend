import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, message, Space } from 'antd';
import CommonFields from '../sign-in/components/commonFields';
import EmployeeFields from '../sign-in/components/employeeFields';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../services/employee.service';
import { Employee } from '../types/Employee';
import { Position } from '../types/Position';
import { getPositions } from '../services/positions.service';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { validateEmailOrDni } from '../utils/validation';

const EmployeesManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    fetchEmployees();
    getPositions()
      .then((response) => setPositions(response))
      .catch(() => message.error("Error al cargar los cargos"));
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      message.error('Error al cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    form.setFieldsValue({
      ...employee,
      email: employee.user.email,
    });
    if (positions.length > 0 && employee?.position) {
      const selectedPosition = positions.find(position => position.position === employee?.position.position);
      if (selectedPosition) {
        form.setFieldsValue({ position: { value: selectedPosition.positionId, label: selectedPosition.position } });
      }
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este empleado?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        setLoadingDelete(id);
        try {
          await deleteEmployee(id);
          message.success('Empleado eliminado con éxito');
          fetchEmployees();
        } catch (error) {
          message.error('Error al eliminar el empleado');
        } finally {
          setLoadingDelete(null);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setLoadingSubmit(true);
    const { email, dni } = values;

    const data = {
      ...values,
      salary: Number(values.salary),
      hireDate: values.hireDatee ? values.hireDatee.format("YYYY-MM-DD") : null,
      position: Number(values.position.value),
    };
    delete data.hireDatee;

    try {
      if (selectedEmployee) {
        const existEmailOrDni: any = await checkEmailOrDni(email, dni, selectedEmployee.user.userId);
        
        if (validateEmailOrDni(existEmailOrDni.emailExists, existEmailOrDni.dniExists)) {
          setLoading(false);
          return;
        }
        delete data.hireDate;
        await updateEmployee(selectedEmployee.employeeId, data);
        setEmployees(
          employees.map((c) => c.employeeId === selectedEmployee.employeeId ? { ...c, ...values } : c)
        );
        message.success('Empleado actualizado con éxito');
      } else {
        const existEmailOrDni: any = await checkEmailOrDni(email, dni, 0);
        
        if (validateEmailOrDni(existEmailOrDni.emailExists, existEmailOrDni.dniExists)) {
          setLoading(false);
          return;
        }
        const newEmployee = await createEmployee(data);
        setEmployees([...employees, newEmployee]);
        message.success('Empleado creado con éxito');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      message.error('Error al procesar la solicitud');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const columns = [
    { title: 'C.I.', dataIndex: 'dni', key: 'dni' },
    { title: 'Email', dataIndex: ['user', 'email'], key: 'email' },
    { title: 'Cargo', dataIndex: ['position', 'position'], key: 'position' },
    { title: 'Nombre', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Apellido', dataIndex: 'lastName', key: 'lastName' },
    { title: 'F. Contratación', dataIndex: 'hireDate', key: 'hireDate' },
    { title: 'Salario', dataIndex: 'salary', key: 'salary', 
      render: (salary: number) => `$${salary}`,
    },
    { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "blue" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.employeeId)}
            shape="circle"
            size="small"
            title="Eliminar"
            style={{ color: "red" }}
            loading={loadingDelete === record.employeeId}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Gestión de Empleados</h1>
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }}
      >
        Agregar Empleado
      </Button>
      <Table
        dataSource={employees}
        columns={columns}
        rowKey="employeeId"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <Modal
        title={selectedEmployee ? 'Editar Empleado' : 'Crear Empleado'}
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
          <EmployeeFields isEditing={isEditing} />
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

export default EmployeesManagement;
function checkEmailOrDni(email: any, dni: any, userId: any): any {
  throw new Error('Function not implemented.');
}

