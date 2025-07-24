import { useLazyQuery } from '@apollo/client';
import { Button, Card, Col, Input, Row, Space, Tabs, Typography } from 'antd';
import React, { useState } from 'react';
import { INGRESOS_POR_DESTINO, RESERVAS_POR_MES, TOTAL_RESERVAS_POR_CLIENTE } from '../graphql/reserva';
import UsuarioStats from './UsuarioStats';

const { Title, Text } = Typography;

export default function Reportes() {
  // Estados para los inputs
  const [cliente, setCliente] = useState('');
  const [destino, setDestino] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  // Queries
  const [getTotalReservas, { data: dataTotal, loading: loadingTotal, called: calledTotal }] = useLazyQuery(TOTAL_RESERVAS_POR_CLIENTE);
  const [getIngresos, { data: dataIngresos, loading: loadingIngresos, called: calledIngresos }] = useLazyQuery(INGRESOS_POR_DESTINO);
  const [getReservasMes, { data: dataMes, loading: loadingMes, called: calledMes }] = useLazyQuery(RESERVAS_POR_MES);

  // Componente para reportes de reservas
  const ReportesReservas = () => (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} md={12} lg={8}>
        <Card variant="bordered" style={{ minHeight: 220 }}>
          <Title level={4}>Total de reservas por cliente</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              value={cliente}
              onChange={e => setCliente(e.target.value)}
              placeholder="Nombre del cliente"
              onPressEnter={() => getTotalReservas({ variables: { clienteNombre: cliente } })}
            />
            <Button type="primary" loading={loadingTotal} onClick={() => getTotalReservas({ variables: { clienteNombre: cliente } })}>
              Consultar
            </Button>
            {loadingTotal ? <Text>Cargando...</Text> :
              calledTotal && dataTotal && (dataTotal.totalReservasPorCliente !== null && dataTotal.totalReservasPorCliente !== undefined)
                ? <Text strong>Total: {dataTotal.totalReservasPorCliente}</Text>
                : calledTotal && <Text type="danger">No se encontraron reservas para este cliente. Verifica el nombre o que existan reservas.</Text>
            }
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card variant="bordered" style={{ minHeight: 220 }}>
          <Title level={4}>Ingresos por destino</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              value={destino}
              onChange={e => setDestino(e.target.value)}
              placeholder="Destino turístico"
              onPressEnter={() => getIngresos({ variables: { destino } })}
            />
            <Button type="primary" loading={loadingIngresos} onClick={() => getIngresos({ variables: { destino } })}>
              Consultar
            </Button>
            {loadingIngresos ? <Text>Cargando...</Text> :
              calledIngresos && dataIngresos && (dataIngresos.ingresosPorDestino !== null && dataIngresos.ingresosPorDestino !== undefined)
                ? <Text strong>Ingresos: Bs {dataIngresos.ingresosPorDestino}</Text>
                : calledIngresos && <Text type="danger">No hay ingresos registrados para este destino. Verifica el nombre o que existan reservas.</Text>
            }
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card variant="bordered" style={{ minHeight: 220 }}>
          <Title level={4}>Reservas por mes</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              type="number"
              value={anio}
              onChange={e => setAnio(e.target.value)}
              placeholder="Año"
              min={2000}
              max={2100}
              onPressEnter={() => getReservasMes({ variables: { year: Number(anio), month: Number(mes) } })}
            />
            <Input
              type="number"
              value={mes}
              onChange={e => setMes(e.target.value)}
              placeholder="Mes"
              min={1}
              max={12}
              onPressEnter={() => getReservasMes({ variables: { year: Number(anio), month: Number(mes) } })}
            />
            <Button type="primary" loading={loadingMes} onClick={() => getReservasMes({ variables: { year: Number(anio), month: Number(mes) } })}>
              Consultar
            </Button>
            {loadingMes ? <Text>Cargando...</Text> :
              calledMes && dataMes && (dataMes.reservasPorMes !== null && dataMes.reservasPorMes !== undefined)
                ? <Text strong>Reservas: {dataMes.reservasPorMes}</Text>
                : calledMes && <Text type="danger">No se encontraron reservas para este mes. Verifica el año y mes ingresados.</Text>
            }
          </Space>
        </Card>
      </Col>
    </Row>
  );

  const items = [
    {
      key: '1',
      label: 'Reportes de Reservas',
      children: <ReportesReservas />,
    },
    {
      key: '2',
      label: 'Estadísticas de Usuarios',
      children: <UsuarioStats />,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
} 