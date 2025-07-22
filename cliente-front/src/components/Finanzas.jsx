import { Tabs } from 'antd';
import React from 'react';
import Facturas from './Facturas';
import Pagos from './Pagos';
import Transacciones from './Transacciones';

const { TabPane } = Tabs;

const Finanzas = () => {
  return (
    <div>
      <h2>Finanzas</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Facturas" key="1">
          <Facturas />
        </TabPane>
        <TabPane tab="Pagos" key="2">
          <Pagos />
        </TabPane>
        <TabPane tab="Transacciones" key="3">
          <Transacciones />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Finanzas; 