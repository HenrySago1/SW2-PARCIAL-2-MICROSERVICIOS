import {
    BarChartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    MobileOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import {
    Alert,
    Card,
    Col,
    Progress,
    Row,
    Statistic,
    Table,
    Tag,
    Typography
} from 'antd';
import React from 'react';
import { GET_USUARIOS } from '../graphql/usuario';

const { Title, Text } = Typography;

const EstadisticasClientes = () => {
  const { data, loading } = useQuery(GET_USUARIOS);

  const usuarios = data?.usuarios || [];
  const clientes = usuarios.filter(u => u.rol === 'CLIENTE');
  const clientesActivos = clientes.filter(u => u.activo);
  const clientesInactivos = clientes.filter(u => !u.activo);

  // Calcular estadísticas
  const totalClientes = clientes.length;
  const totalActivos = clientesActivos.length;
  const totalInactivos = clientesInactivos.length;
  const tasaActivacion = totalClientes > 0 ? (totalActivos / totalClientes) * 100 : 0;

  // Clientes por mes (simulado)
  const clientesPorMes = [
    { mes: 'Enero', cantidad: 12 },
    { mes: 'Febrero', cantidad: 18 },
    { mes: 'Marzo', cantidad: 25 },
    { mes: 'Abril', cantidad: 22 },
    { mes: 'Mayo', cantidad: 30 },
    { mes: 'Junio', cantidad: 35 }
  ];

  // Configuración de columnas para la tabla de clientes recientes
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo) => (
        <Tag color={activo ? 'green' : 'red'} icon={activo ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Último Acceso',
      key: 'ultimoAcceso',
      render: () => (
        <Tag color="blue" icon={<ClockCircleOutlined />}>
          Reciente
        </Tag>
      ),
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        <BarChartOutlined /> Estadísticas de Clientes App Móvil
      </Title>

      <Alert
        message="Información de Rendimiento"
        description="Estas estadísticas muestran el rendimiento de la aplicación móvil y la gestión de clientes."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Estadísticas principales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Clientes"
              value={totalClientes}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Clientes Activos"
              value={totalActivos}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Clientes Inactivos"
              value={totalInactivos}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tasa de Activación"
              value={tasaActivacion.toFixed(1)}
              suffix="%"
              prefix={<Progress type="circle" percent={tasaActivacion} size="small" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficos y métricas adicionales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card title="Distribución de Estados" style={{ height: 300 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Progress
                type="circle"
                percent={tasaActivacion}
                format={(percent) => `${percent}%`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={120}
              />
              <div style={{ marginTop: 16 }}>
                <Text strong>Activos: {totalActivos}</Text>
                <br />
                <Text type="secondary">Inactivos: {totalInactivos}</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Crecimiento Mensual" style={{ height: 300 }}>
            <div style={{ padding: '20px 0' }}>
              {clientesPorMes.map((item, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{item.mes}</Text>
                    <Text strong>{item.cantidad}</Text>
                  </div>
                  <Progress
                    percent={(item.cantidad / 35) * 100}
                    showInfo={false}
                    strokeColor="#1890ff"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Métricas de rendimiento */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={8}>
          <Card>
            <Statistic
              title="Tiempo Promedio de Sesión"
              value={24.5}
              suffix="minutos"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <Statistic
              title="Reservas por Cliente"
              value={3.2}
              suffix="promedio"
              prefix={<MobileOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <Statistic
              title="Satisfacción del Cliente"
              value={4.8}
              suffix="/ 5.0"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabla de clientes recientes */}
      <Card title="Clientes Recientes" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={clientes.slice(0, 10)} // Mostrar solo los primeros 10
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Card>

      {/* Resumen ejecutivo */}
      <Card title="Resumen Ejecutivo">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Puntos Positivos:</Text>
              <ul>
                <li>Alta tasa de activación de clientes ({tasaActivacion.toFixed(1)}%)</li>
                <li>Crecimiento constante en la base de usuarios</li>
                <li>Buena retención de clientes activos</li>
                <li>Interfaz móvil bien recibida por los usuarios</li>
              </ul>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Áreas de Mejora:</Text>
              <ul>
                <li>Reducir la tasa de clientes inactivos</li>
                <li>Implementar campañas de re-engagement</li>
                <li>Mejorar la experiencia de onboarding</li>
                <li>Optimizar el proceso de registro</li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <Alert
          message="Recomendación"
          description="Considera implementar un programa de fidelización para aumentar la retención de clientes y mejorar la tasa de activación."
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  );
};

export default EstadisticasClientes; 