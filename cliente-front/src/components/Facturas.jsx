import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, InputNumber, message, Modal, Table } from 'antd';
import React, { useState } from 'react';
import { CREAR_FACTURA, GET_FACTURAS } from '../graphql/finanzas';
import { useLocation } from 'react-router-dom';
import { CREAR_PAGO } from '../graphql/finanzas';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
  { title: 'Cliente', dataIndex: 'clienteId', key: 'clienteId' },
  { title: 'Monto Total', dataIndex: 'montoTotal', key: 'montoTotal' },
  { title: 'Estado', dataIndex: 'estado', key: 'estado' },
  { title: 'Método de Pago', dataIndex: 'metodoPago', key: 'metodoPago' },
];

const Facturas = () => {
  const location = useLocation();
  const { data, loading, error, refetch } = useQuery(GET_FACTURAS);
  const [crearFactura, { loading: loadingCrear }] = useMutation(CREAR_FACTURA);
  const [registrarPago] = useMutation(CREAR_PAGO);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagoModal, setPagoModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [form] = Form.useForm();
  const [formPago] = Form.useForm();

  React.useEffect(() => {
    if (location.state && location.state.facturaId) {
      const f = (data?.facturas || []).find(fa => String(fa.id) === String(location.state.facturaId));
      if (f) {
        setFacturaSeleccionada(f);
        setPagoModal(true);
      }
    }
  }, [location.state, data]);

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

  const handlePagar = (factura) => {
    setFacturaSeleccionada(factura);
    setPagoModal(true);
    formPago.setFieldsValue({ monto: factura.montoTotal, metodo: factura.metodoPago || '' });
  };

  const handleFinishPago = async (values) => {
    try {
      await registrarPago({
        variables: {
          facturaId: facturaSeleccionada.id,
          monto: Number(values.monto),
          metodo: values.metodo,
        },
      });
      message.success('Pago registrado correctamente');
      setPagoModal(false);
      refetch();
    } catch (e) {
      message.error('Error al registrar pago');
    }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpen}>Nueva Factura</Button>
      <Table columns={columns.concat({
        title: 'Acciones',
        key: 'acciones',
        render: (_, record) => (
          <Button type="link" onClick={() => handlePagar(record)} disabled={record.estado === 'PAGADO'}>
            {record.estado === 'PAGADO' ? 'Pagada' : 'Pagar'}
          </Button>
        )
      })} dataSource={dataSource} rowKey="id" loading={loading} />
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
      <Modal
        title={facturaSeleccionada ? `Pagar Factura #${facturaSeleccionada.id}` : 'Pagar Factura'}
        open={pagoModal}
        onCancel={() => setPagoModal(false)}
        onOk={() => formPago.submit()}
        okText="Pagar"
        cancelText="Cancelar"
      >
        <Form form={formPago} layout="vertical" onFinish={handleFinishPago}>
          <Form.Item label="Monto" name="monto" rules={[{ required: true, message: 'Ingrese el monto a pagar' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Método de Pago" name="metodo" rules={[{ required: true, message: 'Ingrese el método de pago' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Facturas; 