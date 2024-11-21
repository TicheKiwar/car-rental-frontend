import React from "react";
import Menu from "./menu";
import VehicleCatalog from "../catalog/components/catalog";
import "./home.css"; 

const Home: React.FC = () => {
  return (
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

      <div className="">
        {/* Sidebar (Menú) */}
        <div className="home-sidebar">
          <Menu />
        </div>

        {/* Main Content */}
        <div className="">
          <VehicleCatalog />
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
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
      </footer>
    </div>
  );
};

export default Home;
