import React from 'react';
import { Layout, Menu } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  role: string; // Rol del usuario (admin, employee, user)
  onLogout: () => void; // Función para cerrar sesión
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  // Opciones del menú según el rol del usuario
  const menuOptions = {
    admin: [
      { key: 'autos', label: 'Gestión de Autos', icon: <CarOutlined /> },
      { key: 'usuarios', label: 'Gestión de Usuarios', icon: <UserOutlined /> },
    ],
    employee: [
      { key: 'alquiler', label: 'Alquiler de Autos', icon: <CarOutlined /> },
    ],
    user: [
      { key: 'catalogo', label: 'Catálogo', icon: <HomeOutlined /> },
    ],
  };

  const options = menuOptions[role] || [];

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
          justifyContent: 'space-between', // Esto alinea los items del menú arriba y el logout abajo
        }}
      >
        {/* Opciones principales */}
        {options.map(({ key, label, icon }) => (
          <Menu.Item key={key} icon={icon}>
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
