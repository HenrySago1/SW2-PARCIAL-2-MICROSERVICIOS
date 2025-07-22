import { useQuery } from '@apollo/client';
import { Table, Tabs } from 'antd';
import React, { useState } from 'react';
import { GET_ALOJAMIENTOS } from '../graphql/alojamiento';
import Habitaciones from './Habitaciones';
import ReservasAlojamiento from './ReservasAlojamiento';

const { TabPane } = Tabs;

const Alojamiento = () => {
  const { data } = useQuery(GET_ALOJAMIENTOS);
  const alojamientos = data?.alojamientos || [];
  const [selectedAlojamiento, setSelectedAlojamiento] = useState(null);

  return (
    <div>
      <h2>Alojamiento</h2>
      <Table
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
          { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
          { title: 'Ubicación', dataIndex: 'ubicacion', key: 'ubicacion' },
          { title: 'Servicios', dataIndex: 'servicios', key: 'servicios' },
          { title: 'Activo', dataIndex: 'activo', key: 'activo', render: (v) => v ? 'Sí' : 'No' },
          {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
              <button
                style={{ background: selectedAlojamiento === record.id ? '#1890ff' : '#eee', color: selectedAlojamiento === record.id ? '#fff' : '#333', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
                onClick={() => setSelectedAlojamiento(record.id)}
              >
                {selectedAlojamiento === record.id ? 'Seleccionado' : 'Seleccionar'}
              </button>
            ),
          },
        ]}
        dataSource={alojamientos}
        rowKey="id"
        pagination={false}
        style={{ marginBottom: 24 }}
      />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Habitaciones" key="1">
          {selectedAlojamiento ? (
            <Habitaciones alojamientoId={selectedAlojamiento} />
          ) : (
            <div style={{ color: 'red', margin: 20 }}>Selecciona un alojamiento primero.</div>
          )}
        </TabPane>
        <TabPane tab="Reservas" key="2">
          <ReservasAlojamiento />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Alojamiento; 