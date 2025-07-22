import {
  BarChartOutlined,
  BookOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  LogoutOutlined,
  MobileOutlined,
  PieChartOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import React, { useState } from 'react';
import Alojamientos from './components/Alojamientos';
import Destinos from './components/Destinos';
import EstadisticasClientes from './components/EstadisticasClientes';
import Finanzas from './components/Finanzas';
import GestionClientes from './components/GestionClientes';
import Habitaciones from './components/Habitaciones';
import KpiDashboard from './components/KpiDashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Reportes from './components/Reportes';
import ReservasAlojamiento from './components/ReservasAlojamiento';
import TestConnection from './components/TestConnection';
import Usuarios from './components/Usuarios';
import { AuthProvider, useAuth } from './context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AppContent = () => {
  const { user, isAuthenticated, logout, login, hasRole, hasAnyRole } = useAuth();
  const [selected, setSelected] = useState('clientes');

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={login} />;
  }

  // Definir menú según el rol del usuario
  const getMenuItems = () => {
    const items = [];

    // Todos los roles pueden ver reservas
    items.push(
      { key: 'reservas', icon: <BookOutlined />, label: 'Reservas' }
    );

    // Solo ADMIN y OPERADOR pueden ver destinos
    if (hasAnyRole(['ADMIN', 'OPERADOR'])) {
      items.push({ key: 'destinos', icon: <EnvironmentOutlined />, label: 'Destinos' });
      items.push({ key: 'habitaciones', icon: <HomeOutlined />, label: 'Habitaciones' });
    }

    // Solo ADMIN puede ver reportes, finanzas, alojamiento, usuarios y dashboard BI
    if (hasRole('ADMIN')) {
      items.push(
       
        { key: 'reportes', icon: <BarChartOutlined />, label: 'Reportes' },
        { key: 'finanzas', icon: <DollarOutlined />, label: 'Finanzas' },
        { key: 'alojamiento', icon: <HomeOutlined />, label: 'Alojamiento' },
        { key: 'usuarios', icon: <TeamOutlined />, label: 'Usuarios' },
        { key: 'gestionclientes', icon: <MobileOutlined />, label: 'Gestión Clientes App' },
        { key: 'estadisticasclientes', icon: <PieChartOutlined />, label: 'Estadísticas Clientes' },
        { key: 'dashboardbi', icon: <BarChartOutlined />, label: 'Dashboard BI' }
      );
    }

    // Solo OPERADOR puede ver gestión de clientes y estadísticas
    if (hasRole('OPERADOR')) {
      items.push(
        { key: 'gestionclientes', icon: <MobileOutlined />, label: 'Gestión Clientes App' },
        { key: 'alojamiento', icon: <HomeOutlined />, label: 'Alojamiento' },
        { key: 'dashboardbi', icon: <BarChartOutlined />, label: 'Dashboard BI' },
        { key: 'estadisticasclientes', icon: <PieChartOutlined />, label: 'Estadísticas Clientes' }
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  // Función para obtener el color del tag según el rol
  const getRolColor = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'red';
      case 'OPERADOR':
        return 'blue';
      case 'CLIENTE':
        return 'green';
      default:
        return 'default';
    }
  };

  // Función para obtener el texto del rol
  const getRolText = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'OPERADOR':
        return 'Operador';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return rol;
    }
  };

  // Dropdown items para el usuario
  const userMenuItems = [
    {
      key: 'profile',
      label: `Bienvenido, ${user?.nombre}`,
      disabled: true,
    },
    {
      key: 'role',
      label: `Rol: ${getRolText(user?.rol)}`,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#e6f7ff' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: 'linear-gradient(180deg, #1890ff 0%, #40a9ff 100%)',
          boxShadow: '2px 0 8px #e6f7ff',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 26,
          color: '#fff',
          letterSpacing: 2,
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 32, marginRight: 8, color: '#fffbe6' }} /> TURISAGO
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selected]}
          onClick={({ key }) => setSelected(key)}
          items={menuItems}
          style={{
            background: 'transparent',
            color: '#fff',
            fontWeight: 500,
            fontSize: 18,
            borderRight: 0,
          }}
          theme="dark"
        />
        <div style={{ color: '#fff', textAlign: 'center', marginTop: 40, fontSize: 14, opacity: 0.7 }}>
          <Text style={{ color: '#fff' }}>¡Bienvenido a tu sistema turístico!</Text>
        </div>
      </Sider>
      <Layout>
        <Header style={{
          background: 'linear-gradient(90deg, #1890ff 60%, #40a9ff 100%)',
          color: '#fff',
          fontSize: 22,
          fontWeight: 'bold',
          letterSpacing: 2,
          textAlign: 'center',
          boxShadow: '0 2px 8px #e6f7ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
        }}>
          <div>Sistema de Gestión de Microturismo</div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer', color: '#fff' }}>
              <Avatar style={{ backgroundColor: getRolColor(user?.rol) }}>
                {user?.nombre?.charAt(0)}
              </Avatar>
              <span>{user?.nombre}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{
          margin: '32px 16px 0',
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          minHeight: 320,
          boxShadow: '0 4px 24px #b5e3ff55',
        }}>
          <Title level={2} style={{ color: '#1890ff', textAlign: 'center', marginBottom: 32 }}>
            {selected === 'reservas' && 'Gestión de Reservas'}
            {selected === 'destinos' && 'Gestión de Destinos Turísticos'}
            {selected === 'habitaciones' && 'Gestión de Habitaciones'}
            {selected === 'test' && 'Test de Conexión'}
            {selected === 'reportes' && 'Reportes y Estadísticas'}
            {selected === 'finanzas' && 'Gestión Financiera'}
            {selected === 'alojamiento' && 'Gestión de Alojamiento'}
            {selected === 'usuarios' && 'Gestión de Usuarios'}
            {selected === 'gestionclientes' && 'Gestión de Clientes App Móvil'}
            {selected === 'estadisticasclientes' && 'Estadísticas de Clientes App Móvil'}
            {selected === 'dashboardbi' && 'Dashboard de Inteligencia de Negocios'}
          </Title>
          
          <ProtectedRoute>
            {selected === 'reservas' && <ReservasAlojamiento />}
            {selected === 'destinos' && <Destinos />}
            {selected === 'habitaciones' && <Habitaciones />}
            {selected === 'test' && <TestConnection />}
            {selected === 'reportes' && <Reportes />}
            {selected === 'finanzas' && <Finanzas />}
            {selected === 'alojamiento' && <Alojamientos />}
            {selected === 'usuarios' && <Usuarios />}
            {selected === 'gestionclientes' && <GestionClientes />}
            {selected === 'estadisticasclientes' && <EstadisticasClientes />}
            {selected === 'dashboardbi' && <KpiDashboard />}
          </ProtectedRoute>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#e6f7ff', color: '#1890ff', fontWeight: 500, letterSpacing: 1 }}>
          TURISAGO © {new Date().getFullYear()} | Microturismo con pasión
        </Footer>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
