import {
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
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
    Col,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Progress,
    Row,
    Space,
    Statistic,
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
    GET_USUARIOS
} from '../graphql/usuario';

const { Title, Text } = Typography;

const GestionClientes = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credentialsModal, setCredentialsModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const [bulkCreateModal, setBulkCreateModal] = useState(false);
  const [bulkForm] = Form.useForm();
  const [formError, setFormError] = useState(null);

  // Queries y Mutations
  const { data, loading: queryLoading, refetch } = useQuery(GET_USUARIOS);
  const [crearUsuario] = useMutation(CREAR_USUARIO);
  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);
  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO);

  const usuarios = data?.usuarios || [];
  const clientes = usuarios.filter(u => u.rol === 'CLIENTE');
  const clientesActivos = clientes.filter(u => u.activo);

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
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      if (editingUser) {
        await actualizarUsuario({
          variables: {
            id: editingUser.id,
            ...values
          }
        });
        message.success('Cliente actualizado exitosamente');
      } else {
        const result = await crearUsuario({
          variables: {
            nombre: values.nombre,
            apellidos: values.apellidos,
            documento: values.documento,
            email: values.email,
            password: values.password,
            rol: values.rol,
            activo: values.activo
          }
        });
        if (result.errors && result.errors.length > 0) {
          setFormError(result.errors[0].message);
          return;
        }
        message.success('Cliente creado exitosamente');
        setNewCredentials({
          email: values.email,
          password: values.password,
          nombre: values.nombre
        });
        setCredentialsModal(true);
      }
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      refetch();
    } catch (error) {
      setFormError(error.message);
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
      message.success('Cliente eliminado exitosamente');
      refetch();
    } catch (error) {
      message.error('Error al eliminar cliente: ' + error.message);
    }
  };

  // Función para copiar credenciales
  const copyCredentials = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copiado al portapapeles');
  };

  // Función para crear múltiples clientes
  const handleBulkCreate = async (values) => {
    setLoading(true);
    try {
      const nombres = values.nombres.split('\n').filter(n => n.trim());
      const creados = [];

      for (const nombre of nombres) {
        const email = generateEmail(nombre);
        const password = generatePassword();
        
        await crearUsuario({
          variables: {
            nombre: nombre.trim(),
            email,
            password,
            rol: 'CLIENTE',
            activo: true
          }
        });
        
        creados.push({ nombre: nombre.trim(), email, password });
      }

      message.success(`${creados.length} clientes creados exitosamente`);
      setBulkCreateModal(false);
      bulkForm.resetFields();
      refetch();
    } catch (error) {
      message.error('Error al crear clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar reporte de credenciales
  const generateCredentialsReport = () => {
    const report = clientesActivos.map(cliente => 
      `Cliente: ${cliente.nombre}\nEmail: ${cliente.email}\nEstado: ${cliente.activo ? 'Activo' : 'Inactivo'}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_clientes_turisago.txt';
    a.click();
    URL.revokeObjectURL(url);
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
            title="¿Estás seguro de que quieres eliminar este cliente?"
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
              <MobileOutlined /> Gestión de Clientes App Móvil
            </Title>
            <Text type="secondary">
              Crea y gestiona credenciales para clientes de la aplicación móvil TURISAGO
            </Text>
          </div>
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={generateCredentialsReport}
            >
              Reporte
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setBulkCreateModal(true)}
            >
              Creación Masiva
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
              size="large"
            >
              Nuevo Cliente
            </Button>
          </Space>
        </div>

        {/* Estadísticas */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Clientes"
                value={clientes.length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Clientes Activos"
                value={clientesActivos.length}
                prefix={<MobileOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Clientes Inactivos"
                value={clientes.length - clientesActivos.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tasa de Activos"
                value={clientes.length > 0 ? Math.round((clientesActivos.length / clientes.length) * 100) : 0}
                suffix="%"
                prefix={<Progress type="circle" percent={clientes.length > 0 ? (clientesActivos.length / clientes.length) * 100 : 0} size="small" />}
              />
            </Card>
          </Col>
        </Row>

        <Alert
          message="Información Importante"
          description="Los clientes creados aquí podrán acceder a la aplicación móvil TURISAGO. Asegúrate de proporcionar las credenciales de manera segura."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={clientes}
          rowKey="id"
          loading={queryLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} clientes`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal para crear/editar cliente */}
      <Modal
        title={editingUser ? 'Editar Cliente' : 'Nuevo Cliente para App Móvil'}
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
          {formError && (
            <Alert message="Error" description={formError} type="error" showIcon style={{ marginBottom: 16 }} />
          )}
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
            <Input.Password placeholder="Ingresa la contraseña" />
          </Form.Item>

          <Form.Item
            name="rol"
            label="Rol"
            hidden
          >
            <Input value="CLIENTE" />
          </Form.Item>

          <Form.Item
            name="activo"
            label="Estado"
            valuePropName="checked"
          >
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>

          <Form.Item
            name="apellidos"
            label="Apellidos"
            rules={[
              { required: true, message: 'Por favor ingresa los apellidos' },
              { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres' }
            ]}
          >
            <Input placeholder="Ej: Pérez González" />
          </Form.Item>
          <Form.Item
            name="documento"
            label="Documento (CI/DNI/Pasaporte)"
            rules={[
              { required: true, message: 'Por favor ingresa el documento' },
              { min: 3, message: 'El documento debe tener al menos 3 caracteres' }
            ]}
          >
            <Input placeholder="Ej: 12345678" />
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

      {/* Modal para creación masiva */}
      <Modal
        title="Creación Masiva de Clientes"
        open={bulkCreateModal}
        onCancel={() => setBulkCreateModal(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="Instrucciones"
          description="Ingresa los nombres de los clientes, uno por línea. Se generarán automáticamente emails y contraseñas."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={bulkForm}
          layout="vertical"
          onFinish={handleBulkCreate}
        >
          <Form.Item
            name="nombres"
            label="Nombres de Clientes (uno por línea)"
            rules={[
              { required: true, message: 'Por favor ingresa al menos un nombre' }
            ]}
          >
            <Input.TextArea
              rows={8}
              placeholder="Juan Pérez González&#10;María González López&#10;Carlos Rodríguez Silva"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setBulkCreateModal(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Crear Clientes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GestionClientes; 