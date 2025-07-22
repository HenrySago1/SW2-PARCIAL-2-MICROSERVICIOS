import { useMutation, useQuery } from '@apollo/client';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Spin, Table } from 'antd';
import React, { useState } from 'react';
import { CREAR_RESERVA_ALOJAMIENTO, GET_HABITACIONES, GET_RESERVAS_ALOJAMIENTO } from '../graphql/alojamiento';
import { OBTENER_CLIENTES } from '../graphql/cliente';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Habitación', dataIndex: 'habitacionId', key: 'habitacionId' },
  { title: 'Cliente', dataIndex: 'clienteId', key: 'clienteId' },
  { title: 'Fecha Inicio', dataIndex: 'fechaInicio', key: 'fechaInicio' },
  { title: 'Fecha Fin', dataIndex: 'fechaFin', key: 'fechaFin' },
  { title: 'Monto Total', dataIndex: 'montoTotal', key: 'montoTotal' },
  { title: 'Estado', dataIndex: 'estado', key: 'estado' },
];

const ReservasAlojamiento = () => {
  const { data, loading, error, refetch } = useQuery(GET_RESERVAS_ALOJAMIENTO);
  const [crearReserva, { loading: loadingCrear }] = useMutation(CREAR_RESERVA_ALOJAMIENTO);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Hook para obtener clientes
  const { data: clientesData, loading: loadingClientes, refetch: refetchClientes } = useQuery(OBTENER_CLIENTES);
  const clientes = clientesData?.clientes || [];

  // Hook para obtener habitaciones
  const { data: habitacionesData, loading: loadingHabitaciones, refetch: refetchHabitaciones } = useQuery(GET_HABITACIONES);
  const habitaciones = habitacionesData?.habitaciones || [];

  const dataSource = data?.reservasAlojamiento || [];

  const handleOpen = () => {
    setModalVisible(true);
    form.resetFields();
    refetchClientes(); // Refresca la lista de clientes al abrir el modal
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleFinish = async (values) => {
    try {
      await crearReserva({
        variables: {
          habitacionId: values.habitacionId,
          clienteId: values.clienteId,
          fechaInicio: values.fechaInicio.format('YYYY-MM-DD'),
          fechaFin: values.fechaFin.format('YYYY-MM-DD'),
          montoTotal: values.montoTotal,
          estado: values.estado,
        },
      });
      message.success('Reserva creada correctamente');
      setModalVisible(false);
      refetch();
    } catch (e) {
      message.error('Error al crear reserva');
    }
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpen}>Nueva Reserva</Button>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />
      {error && <div style={{color:'red'}}>Error al cargar reservas</div>}
      <Modal
        title="Nueva Reserva de Alojamiento"
        open={modalVisible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={loadingCrear}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="habitacionId" label="Habitación" rules={[{ required: true, message: 'Seleccione la habitación' }]}> 
            {loadingHabitaciones ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Seleccione una habitación"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {habitaciones.map(habitacion => (
                  <Select.Option key={habitacion.id} value={habitacion.id}>
                    {habitacion.nombre} - {habitacion.tipo} (Capacidad: {habitacion.capacidad})
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item name="clienteId" label="Cliente" rules={[{ required: true, message: 'Seleccione el cliente' }]}> 
            {loadingClientes ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Seleccione un cliente"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {clientes.map(cliente => (
                  <Select.Option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellidos} ({cliente.email})
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item name="fechaInicio" label="Fecha Inicio" rules={[{ required: true, message: 'Seleccione la fecha de inicio' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="fechaFin" label="Fecha Fin" rules={[{ required: true, message: 'Seleccione la fecha de fin' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="montoTotal" label="Monto Total" rules={[{ required: true, message: 'Ingrese el monto total' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Ingrese el estado de la reserva' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReservasAlojamiento; 