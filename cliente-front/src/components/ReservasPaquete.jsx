import React, { useState } from 'react';
import { useQuery, useMutation, gql, useLazyQuery } from '@apollo/client';
import { Button, Card, Form, Input, InputNumber, Modal, Table, Tag, DatePicker, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const GET_RESERVAS = gql`
  query {
    reservasPaquete {
      id
      fechaReserva
      monto
      estado
      cliente { id nombre email }
      paquete { id nombre precio }
    }
  }
`;

const RESERVAR_PAQUETE = gql`
  mutation($input: ReservaPaqueteInput!) {
    reservarPaquete(input: $input) {
      id
      monto
      estado
    }
  }
`;

const GET_CLIENTES = gql`
  query {
    clientes { id nombre email }
  }
`;

const GET_PAQUETES = gql`
  query {
    paquetesTuristicos { id nombre precio }
  }
`;

const GET_FACTURA = gql`
  query($id: ID!) {
    facturas { id fecha clienteId montoTotal estado metodoPago }
  }
`;

const ReservasPaquete = () => {
  const { data, loading, refetch } = useQuery(GET_RESERVAS);
  const { data: clientesData } = useQuery(GET_CLIENTES);
  const { data: paquetesData } = useQuery(GET_PAQUETES);
  const [reservarPaquete] = useMutation(RESERVAR_PAQUETE);
  const [getFactura, { data: facturaData }] = useLazyQuery(GET_FACTURA);
  const [modalVisible, setModalVisible] = useState(false);
  const [facturaModal, setFacturaModal] = useState(false);
  const [facturaInfo, setFacturaInfo] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    console.log('Valores del formulario:', values);
    try {
      const input = {
        clienteId: Number(values.clienteId),
        paqueteId: Number(values.paqueteId),
        fechaReserva: values.fechaReserva.format('YYYY-MM-DD'),
        monto: Number(values.monto),
        estado: 'PENDIENTE'
      };
      console.log('Input enviado a la mutación:', input);
      const res = await reservarPaquete({ variables: { input } });
      // Buscar la factura generada
      if (res.data?.reservarPaquete?.id) {
        // Buscar la reserva para obtener el id de la factura
        await refetch();
        const reserva = (data?.reservasPaquete || []).find(r => r.id === res.data.reservarPaquete.id);
        if (reserva && reserva.facturaId) {
          // Buscar la factura por id
          getFactura({ variables: { id: reserva.facturaId } });
          setFacturaModal(true);
        }
      }
      message.success('Reserva realizada exitosamente');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al reservar paquete:', error);
      message.error('Error al reservar paquete: ' + (error.message || ''));
    }
  };

  const columns = [
    { title: 'Cliente', dataIndex: ['cliente', 'nombre'], key: 'cliente' },
    { title: 'Paquete', dataIndex: ['paquete', 'nombre'], key: 'paquete' },
    { title: 'Monto', dataIndex: 'monto', key: 'monto', render: v => `$${v}` },
    { title: 'Fecha Reserva', dataIndex: 'fechaReserva', key: 'fechaReserva' },
    { title: 'Estado', dataIndex: 'estado', key: 'estado', render: v => <Tag color={v === 'PENDIENTE' ? 'orange' : 'green'}>{v}</Tag> },
  ];

  return (
    <Card title="Reservas de Paquetes Turísticos" extra={<Button type="primary" onClick={() => setModalVisible(true)}>Nueva Reserva</Button>}>
      <Table dataSource={data?.reservasPaquete || []} columns={columns} rowKey="id" loading={loading} />
      <Modal open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} title="Reservar Paquete Turístico">
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="clienteId" label="Cliente" rules={[{ required: true }]}> 
            <Select placeholder="Selecciona un cliente">
              {(clientesData?.clientes || []).map(c => (
                <Select.Option key={c.id} value={c.id}>{c.nombre} ({c.email})</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="paqueteId" label="Paquete Turístico" rules={[{ required: true }]}> 
            <Select placeholder="Selecciona un paquete turístico">
              {(paquetesData?.paquetesTuristicos || []).map(p => (
                <Select.Option key={p.id} value={p.id}>{p.nombre} (${p.precio})</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="fechaReserva" label="Fecha de Reserva" rules={[{ required: true }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="monto" label="Monto" rules={[{ required: true }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={facturaModal} onCancel={() => setFacturaModal(false)} footer={null} title="Factura generada">
        {facturaData?.facturas && facturaData.facturas.length > 0 ? (
          <div>
            <p><b>ID:</b> {facturaData.facturas[0].id}</p>
            <p><b>Fecha:</b> {facturaData.facturas[0].fecha}</p>
            <p><b>Cliente ID:</b> {facturaData.facturas[0].clienteId}</p>
            <p><b>Monto Total:</b> ${facturaData.facturas[0].montoTotal}</p>
            <p><b>Estado:</b> {facturaData.facturas[0].estado}</p>
            <p><b>Método de Pago:</b> {facturaData.facturas[0].metodoPago || '-'}</p>
            <Button type="primary" style={{marginTop:16}} onClick={() => {
              setFacturaModal(false);
              navigate('/finanzas', { state: { facturaId: facturaData.facturas[0].id } });
            }}>
              Ir a pagar factura
            </Button>
          </div>
        ) : <p>No se pudo obtener la factura.</p>}
      </Modal>
    </Card>
  );
};

export default ReservasPaquete; 