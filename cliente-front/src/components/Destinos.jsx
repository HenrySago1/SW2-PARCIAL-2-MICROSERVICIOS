import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, InputNumber, message, Modal, Space, Switch, Table } from 'antd';
import React, { useState } from 'react';
import { ACTUALIZAR_DESTINO, CREAR_DESTINO, ELIMINAR_DESTINO, OBTENER_DESTINOS } from '../graphql/destino';

export default function Destinos() {
  const { data, loading, error, refetch } = useQuery(OBTENER_DESTINOS);
  const [crearDestino] = useMutation(CREAR_DESTINO);
  const [actualizarDestino] = useMutation(ACTUALIZAR_DESTINO);
  const [eliminarDestino] = useMutation(ELIMINAR_DESTINO);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const [destinoEdit, setDestinoEdit] = useState(null);

  const abrirModalCrear = () => {
    setEditando(false);
    setDestinoEdit(null);
    form.resetFields();
    setModalVisible(true);
  };

  const abrirModalEditar = (destino) => {
    setEditando(true);
    setDestinoEdit(destino);
    form.setFieldsValue(destino);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setDestinoEdit(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const input = {
        ...values,
        precioBase: parseFloat(values.precioBase),
        cupos: parseInt(values.cupos),
        activo: values.activo,
      };
      if (editando) {
        await actualizarDestino({ variables: { id: destinoEdit.id, ...input } });
        message.success('Destino actualizado correctamente');
      } else {
        await crearDestino({ variables: input });
        message.success('Destino creado correctamente');
      }
      cerrarModal();
      refetch();
    } catch (err) {
      message.error('Error: ' + err.message);
    }
  };

  const handleEliminar = async (id) => {
    Modal.confirm({
      title: '¿Eliminar destino?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarDestino({ variables: { id } });
          message.success('Destino eliminado');
          refetch();
        } catch (err) {
          message.error('Error al eliminar: ' + err.message);
        }
      },
    });
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Ubicación', dataIndex: 'ubicacion', key: 'ubicacion' },
    { title: 'Precio Base', dataIndex: 'precioBase', key: 'precioBase', render: (p) => `Bs ${p}` },
    { title: 'Cupos', dataIndex: 'cupos', key: 'cupos' },
    { title: 'Estado', dataIndex: 'activo', key: 'activo', render: (a) => a ? 'Activo' : 'Inactivo' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => abrirModalEditar(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleEliminar(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={abrirModalCrear} style={{ marginBottom: 16 }}>
        Nuevo Destino
      </Button>
      <Table
        columns={columns}
        dataSource={data?.destinos || []}
        loading={loading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 8 }}
        locale={{ emptyText: 'No hay destinos registrados.' }}
      />
      <Modal
        title={editando ? 'Editar Destino' : 'Crear Destino'}
        open={modalVisible}
        onCancel={cerrarModal}
        onOk={() => form.submit()}
        okText={editando ? 'Actualizar' : 'Crear'}
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ activo: true }}
        >
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción" rules={[{ required: true, message: 'Ingrese la descripción' }]}> 
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="ubicacion" label="Ubicación" rules={[{ required: true, message: 'Ingrese la ubicación' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="precioBase" label="Precio Base (Bs)" rules={[{ required: true, message: 'Ingrese el precio base' }]}> 
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="cupos" label="Cupos" rules={[{ required: true, message: 'Ingrese la cantidad de cupos' }]}> 
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="activo" label="Activo" valuePropName="checked">
            <Switch checkedChildren="Sí" unCheckedChildren="No" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 