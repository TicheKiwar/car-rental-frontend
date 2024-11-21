import React, { useState } from "react";
import { FloatButton, Modal } from "antd";
import {
  BarsOutlined,
  DisconnectOutlined,
  DiffOutlined,
  UnlockOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface ListStudentsProps {
  //onDataChange: () => void;
  //userID: number;
}
const Menu: React.FC<ListStudentsProps> = ({  }) => {
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

  //const handleFormSubmit = async (data: any) => {
    //const respose = await request(data);
    //if (respose) {
      // onDataChange();
    //}
   // return respose;
  //};

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    navigate("/"); // Redirige al inicio
  };

  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="default"
        style={{ }}
        icon={<BarsOutlined />}
        shape="square"
      >
        <FloatButton
          tooltip={<div>Historial</div>}
          icon={<DiffOutlined />}
          onClick={handleShow}
        />
        
        {/* <FloatButton
          tooltip={<div>Cambiar contraseña</div>}
          icon={<UnlockOutlined />}
          onClick={() => {
            console.log("Cambiando contraseña...");
          }}
        /> */}

                {/* Agregamos el ícono del coche */}
                <FloatButton
          tooltip={<div>Autos</div>}
          icon={<CarOutlined />}  // Ícono de coche
          onClick={() => {
            console.log("Mostrando detalles del coche...");
          }}
        />

        <FloatButton
          tooltip={<div>Cerrar Sesión</div>}
          icon={<DisconnectOutlined />}
          onClick={handleLogout}
        />
      </FloatButton.Group>

      <Modal
        title="Historial"
        open={showModal}
        onCancel={handleClose}
        footer={null}
        width={800} // Aumenta el ancho del modal (en píxeles)
        styles={{
          body: {
            height: '650px', // Aumenta la altura del contenido del modal
            overflowY: 'auto' // Añade scroll vertical si el contenido es muy largo
          }
        }}
      >
        {/* <StudentForm
          TeacherID={Number(teacherID)}
          onSubmit={handleFormSubmit}
        /> */}
      </Modal>
    </>
  );
};

export default Menu;
