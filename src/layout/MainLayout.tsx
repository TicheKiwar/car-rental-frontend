import React, { useEffect, useState } from "react";
import Sidebar from "../Home/sideBar";
import { Layout, Row, Col, Typography } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import "./mainLayout.css";
import logo from "../assets/logo-car.png";

const { Header, Footer, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { Header } = Layout;
const { Title } = Typography;

useEffect(() => {
  let userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Si no existe rol, asigna el rol 'inv'
    const defaultUser = { roleName: "inv" };
    localStorage.setItem("userRole", JSON.stringify(defaultUser));
    setUser(defaultUser);
  } else {
    // Si existe rol, usa el almacenado
    setUser(JSON.parse(userRole));
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (!user) {
    return <div>Cargando...</div>;  
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Renderiza Sidebar solo cuando los datos están listos */}
      <Sidebar role={user.roleName} onLogout={handleLogout} />

      <Layout style={{ marginLeft: 200 }}>
        {/* Header */}
        <Header
      style={{
        backgroundColor: "#fff",
        padding: "0 16px",
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Row style={{ width: '100%', alignItems: 'center' }}>
        {/* Logo */}
        <Col>
          <img
            src={logo} 
            alt="Logo"
            style={{ height: 80 }} 
          />
        </Col>

        {/* Título y Fondo con Imagen */}
        <Col span={20} style={{ position: 'relative' }}>
          <Title level={2} style={{ margin: 0, textAlign: 'center', color: '#1890ff' }}>
            Auto Pick
          </Title>
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundImage: 'url("/car-image.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1, 
              zIndex: 1,
            }}
          ></div>
        </Col>
      </Row>
    </Header>

        {/* Contenido Principal */}
        <Content style={{ backgroundColor: "#f0f2f5" }}>
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", backgroundColor: "#f0f2f5" }}>
          <div className="home-footer-sections">
            <div>
              <h4>Principales Destinos de Ecuador</h4>
              <ul>
                <li>Guía de viaje</li>
              </ul>
            </div>
            <div>
              <h4>Extras de EFALKT</h4>
              <ul>
                <li>Productos de alquiler</li>
                <li>Servicios de vehículos</li>
              </ul>
            </div>
            <div>
              <h4>Información de la Empresa</h4>
              <ul>
                <li>Acerca de EFALKT</li>
                <li>Mapa del sitio</li>
              </ul>
            </div>
            <div>
              <h4>Seguridad y Privacidad</h4>
              <ul>
                <li>Condiciones de uso</li>
                <li>Aviso de privacidad</li>
              </ul>
            </div>
          </div>
          <p className="home-footer-copyright">
            © 2024 AutoPick - EFALKT. Todos los derechos reservados.
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
