import React from "react";
import Menu from "./menu";
import "./home.css";
import Sidebar from "./sideBar";
import { Layout } from "antd";
import VehicleCatalog from "../catalog/catalog";

const { Content, Footer } = Layout;

const Home: React.FC = () => {
  const handleLogout = () => {
    console.log('Cerrar sesión'); // Aquí puedes integrar tu lógica de logout
  };

  const userRole = 'employee'; // Cambiar dinámicamente según el rol del usuario

  return (
        <Content>
          <div className="home-container">
            {/* Header */}
            <header className="home-header">
              <h1 className="home-title">Alquiler de Vehículos Ecuador</h1>
              <nav className="home-breadcrumb">
                <a href="/">Ubicaciones</a> &gt;
                <a href="/latin-america"> Latin America</a> &gt;
                <span>Ecuador</span>
              </nav>
            </header>

            {/* Main Content */}
            <div>
              <VehicleCatalog />
            </div>
          </div>
        </Content>
  );
};

export default Home;
