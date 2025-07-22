import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, Modal, Space, Switch, Table, message } from 'antd';
import React, { useState } from 'react';
import { CREAR_ALOJAMIENTO, OBTENER_ALOJAMIENTOS } from '../graphql/alojamiento';

const Alojamientos = () => {
  const { data, loading, refetch } = useQuery(OBTENER_ALOJAMIENTOS);
  const [crearAlojamiento] = useMutation(CREAR_ALOJAMIENTO);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loadingCreate, setLoadingCreate] = useState(false);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
    { title: 'Ubicación', dataIndex: 'ubicacion', key: 'ubicacion' },
    { title: 'Servicios', dataIndex: 'servicios', key: 'servicios' },
    { title: 'Activo', dataIndex: 'activo', key: 'activo', render: (activo) => (activo ? 'Sí' : 'No') },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          {/* Aquí puedes agregar botones de editar/eliminar si lo deseas */}
        </Space>
      ),
    },
  ];

  const handleCreate = async (values) => {
    setLoadingCreate(true);
    try {
      await crearAlojamiento({ variables: values });
      message.success('Alojamiento creado correctamente');
      setModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Error al crear alojamiento: ' + error.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => { form.resetFields(); setModalVisible(true); }} style={{ marginBottom: 16 }}>
        Crear Alojamiento
      </Button>
      <Table
        columns={columns}
        dataSource={data?.alojamientos || []}
        loading={loading}
        rowKey="id"
        bordered
      />
      <Modal
        title="Crear Alojamiento"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Crear"
        confirmLoading={loadingCreate}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}><Input /></Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Ingrese el tipo' }]}><Input /></Form.Item>
          <Form.Item name="ubicacion" label="Ubicación" rules={[{ required: true, message: 'Ingrese la ubicación' }]}><Input /></Form.Item>
          <Form.Item name="servicios" label="Servicios"><Input /></Form.Item>
          <Form.Item name="descripcion" label="Descripción"><Input /></Form.Item>
          <Form.Item name="activo" label="Activo" valuePropName="checked" initialValue={true}><Switch checkedChildren="Sí" unCheckedChildren="No" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Alojamientos; 