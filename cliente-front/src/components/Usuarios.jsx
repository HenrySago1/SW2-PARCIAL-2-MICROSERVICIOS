import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    KeyOutlined,
    MobileOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import {
    Alert,
    Button,
    Card,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Typography
} from 'antd';
import React, { useState } from 'react';
import {
    ACTUALIZAR_USUARIO,
    CREAR_USUARIO,
    ELIMINAR_USUARIO,
    GET_USUARIOS,
    OBTENER_USUARIOS_CLIENTE
} from '../graphql/usuario';

const { Title, Text } = Typography;
const { Option } = Select;

const Usuarios = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentialsModal, setCredentialsModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);

  // Queries y Mutations
  const { data, loading: queryLoading, refetch } = useQuery(GET_USUARIOS);
  const [crearUsuario] = useMutation(CREAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS_CLIENTE }],
  });
  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS_CLIENTE }],
  });
  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS_CLIENTE }],
  });

  const usuarios = data?.usuarios || [];

  // Función para generar contraseña aleatoria
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Función para generar email basado en nombre
  const generateEmail = (nombre) => {
    const cleanName = nombre.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    return `${cleanName}@turisago.com`;
  };

  // Función para abrir modal de creación
  const showCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      rol: 'CLIENTE',
      activo: true
    });
    setModalVisible(true);
  };

  // Función para abrir modal de edición
  const showEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      nombre: record.nombre,
      email: record.email,
      password: '', // No mostrar password actual
      rol: record.rol,
      activo: record.activo
    });
    setModalVisible(true);
  };

  // Función para cerrar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
    setShowPassword(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        // Actualizar usuario
        await actualizarUsuario({
          variables: {
            id: editingUser.id,
            ...values
          }
        });
        message.success('Usuario actualizado exitosamente');
      } else {
        // Crear usuario
        const result = await crearUsuario({
          variables: values
        });
        message.success('Usuario creado exitosamente');
        
        // Si es un cliente, mostrar credenciales
        if (values.rol === 'CLIENTE') {
          setNewCredentials({
            email: values.email,
            password: values.password,
            nombre: values.nombre
          });
          setCredentialsModal(true);
        }
      }
      
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar usuario
  const handleDelete = async (id) => {
    try {
      await eliminarUsuario({
        variables: { id }
      });
      message.success('Usuario eliminado exitosamente');
      refetch();
    } catch (error) {
      message.error('Error al eliminar usuario: ' + error.message);
    }
  };

  // Función para copiar credenciales
  const copyCredentials = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copiado al portapapeles');
  };

  // Función para obtener el color del tag según el rol
  const getRolColor = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'red';
      case 'OPERADOR':
        return 'blue';
      case 'CLIENTE':
        return 'green';
      default:
        return 'default';
    }
  };

  // Función para obtener el texto del rol
  const getRolText = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'OPERADOR':
        return 'Operador';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return rol;
    }
  };

  // Configuración de columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol) => (
        <Tag color={getRolColor(rol)}>
          {getRolText(rol)}
        </Tag>
      ),
      filters: [
        { text: 'Administrador', value: 'ADMIN' },
        { text: 'Operador', value: 'OPERADOR' },
        { text: 'Cliente', value: 'CLIENTE' },
      ],
      onFilter: (value, record) => record.rol === value,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo) => (
        <Tag color={activo ? 'green' : 'red'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      onFilter: (value, record) => record.activo === value,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              <UserOutlined /> Gestión de Usuarios
            </Title>
            <Text type="secondary">
              Crea y gestiona credenciales para clientes de la app móvil
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            size="large"
          >
            Nuevo Cliente
          </Button>
        </div>

        <Alert
          message="Información"
          description="Los usuarios con rol 'Cliente' podrán acceder a la aplicación móvil con las credenciales creadas aquí."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={usuarios}
          rowKey="id"
          loading={queryLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} usuarios`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal para crear/editar usuario */}
      <Modal
        title={editingUser ? 'Editar Usuario' : 'Nuevo Cliente para App Móvil'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            activo: true,
            rol: 'CLIENTE'
          }}
        >
          <Form.Item
            name="nombre"
            label="Nombre Completo"
            rules={[
              { required: true, message: 'Por favor ingresa el nombre completo' },
              { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            ]}
          >
            <Input 
              placeholder="Ej: Juan Pérez González" 
              onChange={(e) => {
                if (!editingUser && e.target.value) {
                  const email = generateEmail(e.target.value);
                  form.setFieldsValue({ email });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor ingresa el email' },
              { type: 'email', message: 'Por favor ingresa un email válido' }
            ]}
          >
            <Input placeholder="ejemplo@turisago.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <Space>
                <span>Contraseña</span>
                <Button
                  type="text"
                  size="small"
                  icon={<KeyOutlined />}
                  onClick={() => {
                    const password = generatePassword();
                    form.setFieldsValue({ password });
                  }}
                >
                  Generar
                </Button>
              </Space>
            }
            rules={[
              { required: true, message: 'Por favor ingresa la contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password 
              placeholder="Ingresa la contraseña"
              iconRender={(visible) => (
                <Button
                  type="text"
                  icon={visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            name="rol"
            label="Rol"
            rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="ADMIN">Administrador</Option>
              <Option value="OPERADOR">Operador</Option>
              <Option value="CLIENTE">Cliente (App Móvil)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="activo"
            label="Estado"
            valuePropName="checked"
          >
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? 'Actualizar' : 'Crear Cliente'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para mostrar credenciales */}
      <Modal
        title={
          <Space>
            <MobileOutlined />
            Credenciales para App Móvil
          </Space>
        }
        open={credentialsModal}
        onCancel={() => setCredentialsModal(false)}
        footer={[
          <Button key="close" onClick={() => setCredentialsModal(false)}>
            Cerrar
          </Button>
        ]}
        width={500}
      >
        <Alert
          message="¡Cliente creado exitosamente!"
          description="Las siguientes credenciales han sido creadas para el acceso a la aplicación móvil."
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Nombre:</Text> {newCredentials?.nombre}
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Email:</Text> {newCredentials?.email}
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Contraseña:</Text> {newCredentials?.password}
          </div>
        </Card>

        <Divider />

        <Text type="secondary">
          <strong>Instrucciones para el cliente:</strong>
        </Text>
        <ul style={{ marginTop: 8 }}>
          <li>Descarga la aplicación móvil TURISAGO</li>
          <li>Usa estas credenciales para iniciar sesión</li>
          <li>Cambia la contraseña en tu primer acceso</li>
          <li>Mantén estas credenciales seguras</li>
        </ul>

        <Divider />

        <Space>
          <Button
            icon={<CopyOutlined />}
            onClick={() => copyCredentials(`${newCredentials?.email}\n${newCredentials?.password}`)}
          >
            Copiar Credenciales
          </Button>
          <Button
            icon={<CopyOutlined />}
            onClick={() => copyCredentials(`Email: ${newCredentials?.email}\nContraseña: ${newCredentials?.password}\n\nInstrucciones:\n1. Descarga la app TURISAGO\n2. Usa estas credenciales para iniciar sesión\n3. Cambia la contraseña en tu primer acceso`)}
          >
            Copiar con Instrucciones
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default Usuarios; 