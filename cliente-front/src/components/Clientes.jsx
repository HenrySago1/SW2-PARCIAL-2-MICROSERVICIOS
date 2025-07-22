import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, message, Modal, Space, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { ACTUALIZAR_CLIENTE, CREAR_CLIENTE, ELIMINAR_CLIENTE, OBTENER_CLIENTES } from '../graphql/cliente';

const { Title } = Typography;

export default function Clientes() {
  const { data, loading, error, refetch } = useQuery(OBTENER_CLIENTES);
  const [crearCliente] = useMutation(CREAR_CLIENTE);
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const [clienteEdit, setClienteEdit] = useState(null);
  const [credencialesModal, setCredencialesModal] = useState({ visible: false, email: '', password: '' });

  const abrirModalCrear = () => {
    setEditando(false);
    setClienteEdit(null);
    form.resetFields();
    setModalVisible(true);
  };

  const abrirModalEditar = (cliente) => {
    setEditando(true);
    setClienteEdit(cliente);
    form.setFieldsValue(cliente);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setClienteEdit(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    console.log('Valores del formulario:', values);
    try {
      if (editando) {
        console.log('Actualizando cliente...');
        await actualizarCliente({
          variables: { id: clienteEdit.id, ...values },
        });
        message.success('Cliente actualizado correctamente');
      } else {
        console.log('Creando cliente...');
        await crearCliente({
          variables: values,
        });
        setCredencialesModal({ visible: true, email: values.email, password: values.password });
        message.success('Cliente creado correctamente');
      }
      cerrarModal();
      refetch();
    } catch (err) {
      console.error('Error completo:', err);
      if (err.message.includes('constraint') || err.message.includes('unique')) {
        message.error('El documento o email ya existen.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  };

  const handleEliminar = async (id) => {
    Modal.confirm({
      title: '¿Eliminar cliente?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarCliente({ variables: { id } });
          message.success('Cliente eliminado');
          refetch();
        } catch (err) {
          message.error('Error al eliminar: ' + err.message);
        }
      },
    });
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' },
    { title: 'Documento', dataIndex: 'documento', key: 'documento' },
    { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
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
      <Button type="primary" icon={<UserAddOutlined />} onClick={abrirModalCrear} style={{ marginBottom: 16 }}>
        Nuevo Cliente
      </Button>
      <Table
        columns={columns}
        dataSource={data?.clientes || []}
        loading={loading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 8 }}
        locale={{ emptyText: 'No hay clientes registrados.' }}
      />
      <Modal
        title={editando ? 'Editar Cliente' : 'Crear Cliente'}
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
          initialValues={{ direccion: '', telefono: '' }}
        >
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: 'Ingrese los apellidos' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="documento" label="Documento (CI/DNI/Pasaporte)" rules={[{ required: true, message: 'Ingrese el documento' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="direccion" label="Dirección">
            <Input />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Ingrese un email válido' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Ingrese la contraseña' }]}
            hasFeedback>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Credenciales del Cliente"
        open={credencialesModal.visible}
        onCancel={() => setCredencialesModal({ visible: false, email: '', password: '' })}
        footer={[
          <Button key="ok" type="primary" onClick={() => setCredencialesModal({ visible: false, email: '', password: '' })}>
            OK
          </Button>,
        ]}
      >
        <p><strong>Email:</strong> {credencialesModal.email}</p>
        <p><strong>Contraseña:</strong> {credencialesModal.password}</p>
        <p>Guarda estas credenciales para el acceso del cliente en la app móvil.</p>
      </Modal>
    </div>
  );
}
