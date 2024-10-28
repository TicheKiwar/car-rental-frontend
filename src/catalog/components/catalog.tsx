import React, { useState } from "react";
import { Table, Tag, Avatar, Button } from "antd";
import type { TableColumnsType } from "antd";

import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import { VehicleType } from "../../common/vehicle.type";

interface ListVehicleProps {
  data: VehicleType[];
}

const ListVehicle: React.FC<ListVehicleProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);

  const showModal = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const generateFilters = (data: VehicleType[], key: keyof VehicleType) => {
    const uniqueValues = Array.from(new Set(data.map((item) => item[key])));
    return uniqueValues.map((value) => ({
      text: String(value),
      value: String(value),
    }));
  };

  const columns: TableColumnsType<VehicleType> = [
    {
      width: 20,
      render: (_, { matricula }) => (
        <Avatar
          size={24}
          src={`https://ui-avatars.com/api/?name=${matricula}`}
        />
      ),
    },
    {
      title: "Matrícula",
      dataIndex: "matricula",
      width: 150,
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      filters: generateFilters(data, "tipo"),
      onFilter: (value, record) => record.tipo === value,
      width: 150,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      filters: generateFilters(data, "estado"),
      onFilter: (value, record) => record.estado === value,
      render: (estado) => {
        const color =
          estado === "Disponible" ? "green" :
          estado === "Alquilado" ? "blue" :
          estado === "En reparación" ? "red" : "gray";
        return (
          <Tag color={color} key={estado}>
            {estado}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: "Número de Puertas",
      dataIndex: "numeroPuertas",
      width: 150,
    },
    {
      title: "Modelo",
      dataIndex: ["idModelo", "nombre"],
      width: 150,
      render: (nombre, record) => `${nombre} (${record.idModelo.idMarca.nombre})`,
    },
    /*{
      width: 50,
      title: "Opciones",
      render: (vehicle) => (
        <Button
          className="border-0 bg-transparent"
          onClick={() => showModal(vehicle)}
        >
          <EditFilled />
        </Button>
      ),
    },*/
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.idVehiculo }))}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        scroll={{ y: 650 }}
      />
      {/* {selectedVehicle && (
        <ModalInfo
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          vehicle={selectedVehicle}
        />
      )} */}
    </>
  );
};

export default ListVehicle;
