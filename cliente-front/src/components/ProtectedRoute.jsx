import { LockOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [], fallback = null }) => {
  const { user, isAuthenticated, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, no tienes acceso a esta página."
        extra={
          <Button type="primary" href="/">
            Volver al inicio
          </Button>
        }
      />
    );
  }

  // Si se especifican roles requeridos, verificar que el usuario tenga al menos uno
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <Result
        status="403"
        title="Acceso Denegado"
        subTitle={`No tienes permisos para acceder a esta sección. Tu rol actual es: ${user?.rol}`}
        icon={<LockOutlined />}
        extra={
          <Button type="primary" href="/">
            Volver al inicio
          </Button>
        }
      />
    );
  }

  // Si se proporciona un fallback personalizado, usarlo
  if (fallback) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute; 