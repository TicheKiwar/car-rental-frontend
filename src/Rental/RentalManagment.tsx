import React, { useState, useEffect } from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const RentalManagment = () => {
  const [tableData, setTableData] = useState([]);

  const columns = [
    {
      title: "Auto",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Auto" style={{ width: "100px", height: "60px", objectFit: "cover" }} />
      ),
    },
    {
      title: "Fecha de reserva",
      dataIndex: "reservation_date",
      key: "reservation_date",
    },
    {
      title: "Fecha máxima de entrega",
      key: "max_return_date",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
    },
    {
      title: "Estado",
      dataIndex: "rental_status",
      key: "estado",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: () => (
        <Space size="middle">
          <Button
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            title="Crear"
            style={{ color: "green" }}
          />
          <Button
            icon={<EditOutlined />}
            shape="circle"
            size="small"
            title="Editar"
            style={{ color: "#e65100" }}
          />
          <Button
            icon={<DeleteOutlined />}
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
      <Table dataSource={tableData} columns={columns} rowKey="rental_id" />
    </div>
  );
};

export default RentalManagment;
