import React, { Children } from 'react';
import { Layout, Menu } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  RedoOutlined,
  CrownOutlined,
  TeamOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; 

const { Sider } = Layout;
const { SubMenu } = Menu;

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
      { key: 'autos', label: 'Gestión de Autos', icon: <CarOutlined />, children: [
        {
          key: 'vehiculos',
          label: 'Vehículos',
          icon: <CarOutlined/>,
          route: '/vehicle-management'
        },
        { key: 'modelos', label: 'Modelos', icon: <AppstoreAddOutlined />, route: '/model-management' },
        { key: 'devolucion', label: 'Devolución de Autos', icon: <RedoOutlined />, route: '/return-vehicle' }, 
      ] },
      {
        key: 'usuarios',
        label: 'Usuarios',
        icon: <UserOutlined />,
        children: [
          {
            key: 'clientes',
            label: 'Clientes',
            icon: <UserOutlined />,
            route: '/client-management',
          },
          {
            key: 'empleados',
            label: 'Empleados',
            icon: <TeamOutlined />,
            route: '/employee-management',
          },
          {
            key: 'administradores',
            label: 'Administradores',
            icon: <CrownOutlined />,
            route: '/admin-management',
          },
          
        ],
      },
      ],
      Empleado: [
        { key: 'alquiler', label: 'Alquiler de Autos', icon: <CarOutlined />, route: '/Home' },
        {
          key: 'clientes',
          label: 'Clientes',
          icon: <UserOutlined />,
          route: '/client-management',
        }, 
        { key: 'devolucion', label: 'Devolución de Autos', icon: <RedoOutlined />, route: '/return-vehicle' }, 
      ],
      Cliente: [
        { key: 'catalogo', label: 'Catálogo', icon: <HomeOutlined />, route: '/Home' },
        { key: 'reservas', label: 'reservas', icon: <CarOutlined />, route: '/Reservations' },
      ],
      inv: [
        { key: 'catalogo', label: 'Catálogo', icon: <HomeOutlined />, route: '/Home' },
      ],
    };


  const options = menuOptions[role] || [];

  const handleMenuClick = (route: string) => {
    if (route) navigate(route); // Redirige a la ruta cuando se hace clic
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
        {options.map(({ key, label, icon, route, children }) => {
          if (children) {
            return (
              <SubMenu key={key} icon={icon} title={label}>
                {children.map(({ key, label, icon, route }) => (
                  <Menu.Item key={key} icon={icon} onClick={() => handleMenuClick(route)}>
                    {label}
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          }

          return (
            <Menu.Item key={key} icon={icon} onClick={() => handleMenuClick(route)}>
              {label}
            </Menu.Item>
          );
        })}

        {/* Opción de cierre de sesión al final */}
        <Menu.Item
          key="logout"
          id="logout"
          icon={<LogoutOutlined style={{ color: 'red' }} />}
          onClick={onLogout}
          style={{
            color: 'red',
            fontWeight: 'bold',
            position: 'absolute',
            bottom: 16,
            width: '100%',
          }}
        >
          Cerrar Sesión
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
