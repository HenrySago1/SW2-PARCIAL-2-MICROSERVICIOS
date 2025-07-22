import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table, message } from 'antd';
import React, { useState } from 'react';
import { CREAR_HABITACION, GET_ALOJAMIENTOS, GET_HABITACIONES } from '../graphql/alojamiento';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Alojamiento', dataIndex: 'alojamientoId', key: 'alojamientoId' },
  { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
  { title: 'Precio/Noche', dataIndex: 'precioNoche', key: 'precioNoche' },
  { title: 'Disponible', dataIndex: 'disponible', key: 'disponible', render: (v) => v ? 'Sí' : 'No' },
];

const Habitaciones = () => {
  const { data: dataAlojamientos, loading: loadingAlojamientos } = useQuery(GET_ALOJAMIENTOS);
  const [alojamientoId, setAlojamientoId] = useState(null);
  const { data, loading, error, refetch } = useQuery(GET_HABITACIONES, {
    variables: { alojamientoId },
    skip: !alojamientoId,
  });
  const [crearHabitacion, { loading: loadingCrear }] = useMutation(CREAR_HABITACION);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const dataSource = data?.habitaciones || [];

  const handleOpen = () => {
    setModalVisible(true);
    form.resetFields();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      await crearHabitacion({
        variables: {
          alojamientoId,
          nombre: values.nombre,
          tipo: values.tipo,
          capacidad: values.capacidad,
          precioNoche: values.precioNoche,
          descripcion: values.descripcion,
          disponible: values.disponible,
        },
      });
      message.success('Habitación creada correctamente');
      setModalVisible(false);
      refetch();
    } catch (e) {
      message.error('Error al crear habitación');
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1890ff', marginBottom: 24 }}>Gestión de Habitaciones</h2>
      <Select
        style={{ width: 300, marginBottom: 16 }}
        placeholder="Selecciona un alojamiento"
        loading={loadingAlojamientos}
        onChange={setAlojamientoId}
        value={alojamientoId}
        allowClear
      >
        {dataAlojamientos?.alojamientos.map(a => (
          <Select.Option key={a.id} value={a.id}>{a.nombre} ({a.ubicacion})</Select.Option>
        ))}
      </Select>
      <Button type="primary" style={{ marginLeft: 16, marginBottom: 16 }} onClick={handleOpen} disabled={!alojamientoId}>Nueva Habitación</Button>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />
      {error && <div style={{color:'red'}}>Error al cargar habitaciones</div>}
      <Modal
        title="Nueva Habitación"
        open={modalVisible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={loadingCrear}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ disponible: true }}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}><Input /></Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Ingrese el tipo' }]}><Input /></Form.Item>
          <Form.Item name="capacidad" label="Capacidad" rules={[{ required: true, message: 'Ingrese la capacidad' }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="precioNoche" label="Precio por Noche" rules={[{ required: true, message: 'Ingrese el precio por noche' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="descripcion" label="Descripción"><Input /></Form.Item>
          <Form.Item name="disponible" label="Disponible" valuePropName="checked"><Switch checkedChildren="Sí" unCheckedChildren="No" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Habitaciones; 