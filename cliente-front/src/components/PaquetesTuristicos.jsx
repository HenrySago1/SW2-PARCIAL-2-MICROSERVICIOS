import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Card, Form, Input, InputNumber, Modal, Table, Tag, DatePicker, message } from 'antd';

const GET_PAQUETES = gql`
  query {
    paquetesTuristicos {
      id
      nombre
      descripcion
      precio
      fechaInicio
      fechaFin
      cupos
      serviciosIncluidos
      activo
      destino { id nombre }
    }
  }
`;

const CREAR_PAQUETE = gql`
  mutation($input: PaqueteTuristicoInput!) {
    crearPaqueteTuristico(input: $input) {
      id
      nombre
    }
  }
`;

const PaquetesTuristicos = () => {
  const { data, loading, refetch } = useQuery(GET_PAQUETES);
  const [crearPaquete] = useMutation(CREAR_PAQUETE);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async (values) => {
    console.log('Valores del formulario:', values);
    try {
      const input = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        precio: Number(values.precio),
        cupos: Number(values.cupos),
        serviciosIncluidos: values.serviciosIncluidos,
        fechaInicio: values.fechas[0].format('YYYY-MM-DD'),
        fechaFin: values.fechas[1].format('YYYY-MM-DD'),
        destinoId: Number(values.destinoId),
        activo: true
      };
      console.log('Input enviado a la mutación:', input);
      await crearPaquete({ variables: { input } });
      message.success('Paquete creado exitosamente');
      setModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error('Error al crear paquete:', error);
      message.error('Error al crear paquete: ' + (error.message || ''));
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Destino', dataIndex: ['destino', 'nombre'], key: 'destino' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio', render: v => `$${v}` },
    { title: 'Cupos', dataIndex: 'cupos', key: 'cupos' },
    { title: 'Fechas', key: 'fechas', render: (_, r) => `${r.fechaInicio} a ${r.fechaFin}` },
    { title: 'Activo', dataIndex: 'activo', key: 'activo', render: v => <Tag color={v ? 'green' : 'red'}>{v ? 'Sí' : 'No'}</Tag> },
  ];

  return (
    <Card title="Paquetes Turísticos" extra={<Button type="primary" onClick={() => setModalVisible(true)}>Nuevo Paquete</Button>}>
      <Table dataSource={data?.paquetesTuristicos || []} columns={columns} rowKey="id" loading={loading} />
      <Modal open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()} title="Crear Paquete Turístico">
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción" rules={[{ required: true }]}> 
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="precio" label="Precio" rules={[{ required: true }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="cupos" label="Cupos" rules={[{ required: true }]}> 
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="serviciosIncluidos" label="Servicios Incluidos"> 
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="fechas" label="Rango de Fechas" rules={[{ required: true }]}> 
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="destinoId" label="ID Destino" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PaquetesTuristicos; 