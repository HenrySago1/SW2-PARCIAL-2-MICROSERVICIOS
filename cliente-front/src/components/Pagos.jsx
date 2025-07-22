import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, InputNumber, message, Modal, Table } from 'antd';
import React, { useState } from 'react';
import { CREAR_PAGO, GET_PAGOS } from '../graphql/finanzas';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Factura', dataIndex: 'facturaId', key: 'facturaId' },
  { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
  { title: 'Monto', dataIndex: 'monto', key: 'monto' },
  { title: 'Método', dataIndex: 'metodo', key: 'metodo' },
  { title: 'Estado', dataIndex: 'estado', key: 'estado' },
];

const Pagos = () => {
  const { data, loading, error, refetch } = useQuery(GET_PAGOS);
  const [registrarPago, { loading: loadingCrear }] = useMutation(CREAR_PAGO);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const dataSource = data?.pagos || [];

  const handleOpen = () => {
    setModalVisible(true);
    form.resetFields();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      await registrarPago({
        variables: {
          facturaId: values.facturaId,
          monto: values.monto,
          metodo: values.metodo,
        },
      });
      message.success('Pago registrado correctamente');
      setModalVisible(false);
      refetch();
    } catch (e) {
      message.error('Error al registrar pago');
    }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpen}>Nuevo Pago</Button>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />
      {error && <div style={{color:'red'}}>Error al cargar pagos</div>}
      <Modal
        title="Nuevo Pago"
        open={modalVisible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={loadingCrear}
        okText="Registrar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="facturaId" label="ID Factura" rules={[{ required: true, message: 'Ingrese el ID de la factura' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="monto" label="Monto" rules={[{ required: true, message: 'Ingrese el monto' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="metodo" label="Método de Pago">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pagos; 