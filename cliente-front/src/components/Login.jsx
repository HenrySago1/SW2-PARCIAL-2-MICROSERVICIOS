import {
  LockOutlined,
  LoginOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useLazyQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Space,
  Typography
} from 'antd';
import React, { useState } from 'react';
import { LOGIN } from '../graphql/auth';

const { Title, Text } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [login] = useLazyQuery(LOGIN, {
    onCompleted: (data) => {
      if (data.login.success) {
        message.success('¡Bienvenido a TURISAGO!');
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.login.usuario));
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Llamar a la función de callback para actualizar el contexto
        onLoginSuccess(data.login.usuario);
      } else {
        setError(data.login.message);
        message.error(data.login.message);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('Error de GraphQL:', error);
      const errorMessage = error.message.includes('Failed to fetch') 
        ? 'Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:8081'
        : 'Error de conexión. Verifica tu conexión a internet.';
      setError(errorMessage);
      message.error('Error de conexión');
      setLoading(false);
    }
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      // Login temporal mientras arreglamos el backend
      const mockUsers = [
        { id: 1, nombre: 'Admin Principal', email: 'admin@turisago.com', rol: 'ADMIN', activo: true },
        { id: 2, nombre: 'Operador Test', email: 'operador@turisago.com', rol: 'OPERADOR', activo: true },
        { id: 3, nombre: 'Cliente Test', email: 'cliente@turisago.com', rol: 'CLIENTE', activo: true },
        { id: 4, nombre: 'melina escobar', email: 'melinaescobar@turisago.com', rol: 'CLIENTE', activo: true }
      ];
      
      const user = mockUsers.find(u => u.email === values.email);
      
      if (user && values.password === 'admin123') {
        message.success('¡Bienvenido a TURISAGO!');
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', 'temp_token_' + user.id);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Llamar a la función de callback para actualizar el contexto
        onLoginSuccess(user);
      } else {
        setError('Credenciales incorrectas');
        message.error('Credenciales incorrectas');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      setError('Error al intentar iniciar sesión');
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    let email, password;
    
    switch (role) {
      case 'admin':
        email = 'admin@turisago.com';
        password = 'admin123';
        break;
      case 'operador':
        email = 'operador@turisago.com';
        password = 'oper123';
        break;
      case 'cliente':
        email = 'cliente@turisago.com';
        password = 'cliente123';
        break;
      default:
        return;
    }
    
    form.setFieldsValue({ email, password });
    handleSubmit({ email, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}>
            <TeamOutlined />
          </div>
          <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
            TURISAGO
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Sistema de Gestión de Microturismo
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Por favor ingresa un email válido' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
          </Form.Item>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              style={{ width: '100%', height: 48, fontSize: 16 }}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>

        <Divider>O prueba con una cuenta demo</Divider>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="default"
            onClick={() => handleDemoLogin('admin')}
            style={{ width: '100%' }}
            icon={<UserOutlined />}
          >
            Demo Administrador
          </Button>
          <Button
            type="default"
            onClick={() => handleDemoLogin('operador')}
            style={{ width: '100%' }}
            icon={<UserOutlined />}
          >
            Demo Operador
          </Button>
          <Button
            type="default"
            onClick={() => handleDemoLogin('cliente')}
            style={{ width: '100%' }}
            icon={<UserOutlined />}
          >
            Demo Cliente
          </Button>
        </Space>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © 2025 TURISAGO - Microturismo con pasión
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login; 