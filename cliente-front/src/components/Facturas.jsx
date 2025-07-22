import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, InputNumber, message, Modal, Table } from 'antd';
import React, { useState } from 'react';
import { CREAR_FACTURA, GET_FACTURAS } from '../graphql/finanzas';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
  { title: 'Cliente', dataIndex: 'clienteId', key: 'clienteId' },
  { title: 'Monto Total', dataIndex: 'montoTotal', key: 'montoTotal' },
  { title: 'Estado', dataIndex: 'estado', key: 'estado' },
  { title: 'Método de Pago', dataIndex: 'metodoPago', key: 'metodoPago' },
];

const Facturas = () => {
  const { data, loading, error, refetch } = useQuery(GET_FACTURAS);
  const [crearFactura, { loading: loadingCrear }] = useMutation(CREAR_FACTURA);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const dataSource = data?.facturas || [];

  const handleOpen = () => {
    setModalVisible(true);
    form.resetFields();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      await crearFactura({
        variables: {
          clienteId: values.clienteId,
          montoTotal: values.montoTotal,
          metodoPago: values.metodoPago,
        },
      });
      message.success('Factura creada correctamente');
      setModalVisible(false);
      refetch();
    } catch (e) {
      message.error('Error al crear factura');
    }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpen}>Nueva Factura</Button>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />
      {error && <div style={{color:'red'}}>Error al cargar facturas</div>}
      <Modal
        title="Nueva Factura"
        open={modalVisible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={loadingCrear}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="clienteId" label="ID Cliente" rules={[{ required: true, message: 'Ingrese el ID del cliente' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="montoTotal" label="Monto Total" rules={[{ required: true, message: 'Ingrese el monto total' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="metodoPago" label="Método de Pago">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Facturas; 