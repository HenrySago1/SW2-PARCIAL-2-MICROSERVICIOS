import { useMutation, useQuery } from '@apollo/client';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Table } from 'antd';
import React, { useState } from 'react';
import { CREAR_TRANSACCION, GET_TRANSACCIONES } from '../graphql/finanzas';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
  { title: 'Monto', dataIndex: 'monto', key: 'monto' },
  { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
  { title: 'Referencia', dataIndex: 'referenciaId', key: 'referenciaId' },
  { title: 'Tipo Ref.', dataIndex: 'referenciaTipo', key: 'referenciaTipo' },
];

const Transacciones = () => {
  const { data, loading, error, refetch } = useQuery(GET_TRANSACCIONES);
  const [crearTransaccion, { loading: loadingCrear }] = useMutation(CREAR_TRANSACCION);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const dataSource = data?.transacciones || [];

  const handleOpen = () => {
    setModalVisible(true);
    form.resetFields();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      await crearTransaccion({
        variables: {
          tipo: values.tipo,
          fecha: values.fecha.format('YYYY-MM-DD'),
          monto: values.monto,
          descripcion: values.descripcion,
          referenciaId: values.referenciaId,
          referenciaTipo: values.referenciaTipo,
        },
      });
      message.success('Transacción creada correctamente');
      setModalVisible(false);
      refetch();
    } catch (e) {
      message.error('Error al crear transacción');
    }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpen}>Nueva Transacción</Button>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />
      {error && <div style={{color:'red'}}>Error al cargar transacciones</div>}
      <Modal
        title="Nueva Transacción"
        open={modalVisible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={loadingCrear}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Ingrese el tipo de transacción' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Seleccione la fecha' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="monto" label="Monto" rules={[{ required: true, message: 'Ingrese el monto' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input />
          </Form.Item>
          <Form.Item name="referenciaId" label="Referencia ID">
            <Input />
          </Form.Item>
          <Form.Item name="referenciaTipo" label="Tipo de Referencia">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transacciones; 