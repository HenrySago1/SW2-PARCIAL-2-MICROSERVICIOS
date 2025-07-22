import { useQuery } from '@apollo/client';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import { GET_USUARIOS } from '../graphql/usuario';

const { Title, Text } = Typography;

const TestConnection = () => {
  const { data, loading, error } = useQuery(GET_USUARIOS);

  if (loading) {
    return (
      <Card>
        <Title level={4}>Probando conexión...</Title>
        <Text>Cargando datos...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Title level={4}>Error de conexión</Title>
        <Alert
          message="Error al conectar con el backend"
          description={error.message}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card>
      <Title level={4}>Conexión exitosa</Title>
      <Text>Usuarios encontrados: {data?.usuarios?.length || 0}</Text>
      <br />
      <Text>Clientes: {data?.usuarios?.filter(u => u.rol === 'CLIENTE').length || 0}</Text>
      <br />
      <Text>Datos: {JSON.stringify(data?.usuarios?.slice(0, 2), null, 2)}</Text>
    </Card>
  );
};

export default TestConnection; 