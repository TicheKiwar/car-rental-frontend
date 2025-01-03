import React, { useEffect, useState } from "react";
import "./home.css";
import { Layout } from "antd";
import VehicleCatalog from "../catalog/catalog";
import { StorageService } from "../services/storage";

const { Content, Footer } = Layout;

const Home: React.FC = () => {

const role =  StorageService.getItem("userRole");

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
                <VehicleCatalog role={role.roleName}/>
            </div>
          </div>
        </Content>
  );
};

export default Home;
