import React from "react";
import Sidebar from "../Home/sideBar";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "./mainLayout.css";

const { Header, Footer, Content } = Layout;

const MainLayout: React.FC = () => {
  const handleLogout = () => {
    console.log("Cerrar sesión"); // Lógica de logout aquí
  };

  const userRole = "employee"; // Cambiar según el rol del usuario

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar role={userRole} onLogout={handleLogout} />

      <Layout style={{ marginLeft: 200 }}>
        {/* Header */}
        <Header style={{ backgroundColor: "#fff", padding: "0 16px" }}>
          <h1 style={{ margin: 0 }}>Gestión de Alquiler de Vehículos</h1>
        </Header>

        {/* Contenido Principal */}
        <Content style={{ backgroundColor: "#f0f2f5" }}>
          <Outlet /> {/* Renderiza aquí las rutas hijas */}
        </Content>
        {/* Footer */}
        <Footer style={{ textAlign: "center", backgroundColor: "#f0f2f5" }}>
          <div className="home-footer-sections">
            <div>
              <h4>Principales Destinos de Estados Unidos</h4>
              <ul>
                <li>Guía de viaje</li>
                <li>Alquiler de vehículos en Las Vegas</li>
                <li>Alquiler de vehículos en Los Ángeles</li>
              </ul>
            </div>
            <div>
              <h4>Extras de Avis</h4>
              <ul>
                <li>Productos de alquiler</li>
                <li>Servicios de vehículos</li>
              </ul>
            </div>
            <div>
              <h4>Información de la Empresa</h4>
              <ul>
                <li>Acerca de Avis</li>
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
            © 2024 Gestión de Alquiler de Vehículos. Todos los derechos reservados.
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
