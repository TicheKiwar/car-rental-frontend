import React from 'react';
import { Layout, Menu } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; 

const { Sider } = Layout;

interface SidebarProps {
  role: string; 
  onLogout: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const navigate = useNavigate(); 

  if (!role) {
    return <div>Cargando Sidebar...</div>;
  }

  const menuOptions = {
    Administrador: [
      { key: 'autos', label: 'Gestión de Autos', icon: <CarOutlined />, route: '/vehicle-management' },
      { key: 'usuarios', label: 'Gestión de Usuarios', icon: <UserOutlined />, route: '/Home' },
      { key: 'modelos', label: 'Gestión de Modelos', icon: <AppstoreAddOutlined />, route: '/model-management' },
    ],
    employee: [
      { key: 'alquiler', label: 'Alquiler de Autos', icon: <CarOutlined />, route: '/Home' },
    ],
    Cliente: [
      { key: 'catalogo', label: 'Catálogo', icon: <HomeOutlined />, route: '/Home' },
    ],
    inv: [
      { key: 'catalogo', label: 'Catálogo', icon: <HomeOutlined />, route: '/Home' },
    ],
  };

  const options = menuOptions[role] || [];

  const handleMenuClick = (route: string) => {
    navigate(route); // Redirige a la ruta cuando se hace clic
  };

  return (
    <Sider style={{ height: '100vh', position: 'fixed', left: 0 }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h2>Menú</h2>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Opciones principales */}
        {options.map(({ key, label, icon, route }) => (
          <Menu.Item key={key} icon={icon} onClick={() => handleMenuClick(route)}>
            {label}
          </Menu.Item>
        ))}

        {/* Opción de cierre de sesión al final */}
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined style={{ color: 'red' }} />}
          onClick={onLogout}
          style={{ color: 'red', fontWeight: 'bold', position: 'absolute', bottom: 16, width: '100%' }}
        >
          Cerrar Sesión
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
