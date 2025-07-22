import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { Button, DatePicker, Form, InputNumber, message, Modal, Select, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { OBTENER_CLIENTES } from '../graphql/cliente';
import { OBTENER_DESTINOS } from '../graphql/destino';
import { ACTUALIZAR_RESERVA, CREAR_RESERVA, ELIMINAR_RESERVA, OBTENER_RESERVAS } from '../graphql/reserva';
import { OBTENER_USUARIOS_CLIENTE } from '../graphql/usuario';

const { Option } = Select;
const { Title } = Typography;

export default function ReservaLista() {
  const { data: dataReservas, loading, error, refetch } = useQuery(OBTENER_RESERVAS);
  const { data: dataClientes } = useQuery(OBTENER_CLIENTES);
  const { data: dataDestinos } = useQuery(OBTENER_DESTINOS);
  const { data: dataUsuariosCliente } = useQuery(OBTENER_USUARIOS_CLIENTE);
  const [crearReserva] = useMutation(CREAR_RESERVA);
  const [actualizarReserva] = useMutation(ACTUALIZAR_RESERVA);
  const [eliminarReserva] = useMutation(ELIMINAR_RESERVA);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const [reservaEdit, setReservaEdit] = useState(null);

  // Mapas para mostrar nombres en la tabla
  const clientesMap = useMemo(() => {
    const map = {};
    (dataClientes?.clientes || []).forEach(c => {
      map[c.id] = c.nombre + ' ' + (c.apellidos || '');
    });
    return map;
  }, [dataClientes]);
  const destinosMap = useMemo(() => {
    const map = {};
    (dataDestinos?.destinos || []).forEach(d => {
      map[d.id] = d.nombre;
    });
    return map;
  }, [dataDestinos]);

  const abrirModalCrear = () => {
    setEditando(false);
    setReservaEdit(null);
    form.resetFields();
    setModalVisible(true);
  };

  const abrirModalEditar = (reserva) => {
    setEditando(true);
    setReservaEdit(reserva);
    form.setFieldsValue({
      ...reserva,
      fecha: dayjs(reserva.fecha),
    });
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setReservaEdit(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const input = {
        ...values,
        fecha: values.fecha.format('YYYY-MM-DD'),
        monto: parseFloat(values.monto),
      };
      if (editando) {
        await actualizarReserva({ variables: { id: reservaEdit.id, ...input } });
        message.success('Reserva actualizada correctamente');
      } else {
        await crearReserva({ variables: input });
        message.success('Reserva creada correctamente');
      }
      cerrarModal();
      refetch();
    } catch (err) {
      message.error('Error: ' + err.message);
    }
  };

  const handleEliminar = async (id) => {
    Modal.confirm({
      title: '¿Eliminar reserva?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarReserva({ variables: { id } });
          message.success('Reserva eliminada');
          refetch();
        } catch (err) {
          message.error('Error al eliminar: ' + err.message);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'clienteId',
      key: 'clienteId',
      render: (id) => clientesMap[id] || id,
    },
    {
      title: 'Destino',
      dataIndex: 'destinoId',
      key: 'destinoId',
      render: (id) => destinosMap[id] || id,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (m) => `Bs ${m}`,
    },
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
        Nueva Reserva
      </Button>
      <Table
        columns={columns}
        dataSource={dataReservas?.reservas || []}
        loading={loading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 8 }}
        locale={{ emptyText: 'No hay reservas registradas.' }}
      />
      <Modal
        title={editando ? 'Editar Reserva' : 'Crear Reserva'}
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
        >
          <Form.Item name="clienteId" label="Cliente" rules={[{ required: true, message: 'Seleccione un cliente' }]}> 
            <Select placeholder="Seleccione un cliente">
              {(dataUsuariosCliente?.usuariosPorRol || []).map(u => (
                <Option key={u.id} value={u.id}>{u.nombre} ({u.email})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="destinoId" label="Destino" rules={[{ required: true, message: 'Seleccione un destino' }]}> 
            <Select placeholder="Seleccione un destino">
              {(dataDestinos?.destinos || []).map(d => (
                <Option key={d.id} value={d.id}>{d.nombre}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Seleccione la fecha' }]}> 
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="monto" label="Monto (Bs)" rules={[{ required: true, message: 'Ingrese el monto' }]}> 
            <InputNumber style={{ width: '100%' }} min={0} step={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
