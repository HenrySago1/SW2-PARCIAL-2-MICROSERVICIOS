import { CheckCircleOutlined, CrownOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Card, Col, Progress, Row, Statistic } from 'antd';
import React from 'react';
import { GET_USUARIOS } from '../graphql/usuario';

const UsuarioStats = () => {
  const { data, loading } = useQuery(GET_USUARIOS);
  
  const usuarios = data?.usuarios || [];
  
  // Calcular estadísticas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.activo).length;
  const usuariosInactivos = totalUsuarios - usuariosActivos;
  
  const admins = usuarios.filter(u => u.rol === 'ADMIN').length;
  const operadores = usuarios.filter(u => u.rol === 'OPERADOR').length;
  const clientes = usuarios.filter(u => u.rol === 'CLIENTE').length;
  
  const porcentajeActivos = totalUsuarios > 0 ? (usuariosActivos / totalUsuarios) * 100 : 0;

  return (
    <div style={{ padding: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Usuarios"
              value={totalUsuarios}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Usuarios Activos"
              value={usuariosActivos}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={porcentajeActivos} 
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Administradores"
              value={admins}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Operadores"
              value={operadores}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card title="Distribución por Roles" loading={loading}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic
                  title="Administradores"
                  value={admins}
                  suffix={`/ ${totalUsuarios}`}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Operadores"
                  value={operadores}
                  suffix={`/ ${totalUsuarios}`}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Clientes"
                  value={clientes}
                  suffix={`/ ${totalUsuarios}`}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Estado de Usuarios" loading={loading}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Activos"
                  value={usuariosActivos}
                  suffix={`/ ${totalUsuarios}`}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Inactivos"
                  value={usuariosInactivos}
                  suffix={`/ ${totalUsuarios}`}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
            <Progress 
              percent={porcentajeActivos} 
              strokeColor="#52c41a"
              trailColor="#faad14"
              format={percent => `${percent.toFixed(1)}% activos`}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UsuarioStats; 