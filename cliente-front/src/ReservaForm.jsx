import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { OBTENER_CLIENTES } from './graphql/cliente';
import { OBTENER_DESTINOS } from './graphql/destino';
import { CREAR_RESERVA_ALOJAMIENTO, ELIMINAR_RESERVA, OBTENER_RESERVAS } from './graphql/reserva';
import { OBTENER_USUARIOS_CLIENTE } from './graphql/usuario';

const ReservaForm = () => {
  const [form, setForm] = useState({
    clienteId: '',
    habitacionId: '',
    fechaInicio: '',
    fechaFin: '',
    montoTotal: '',
    estado: 'CONFIRMADA',
  });
  const [crearReservaAlojamiento, { loading: creando, error: errorCrear }] = useMutation(CREAR_RESERVA_ALOJAMIENTO);
  const { loading, error, data } = useQuery(OBTENER_RESERVAS);
  const { data: dataClientes } = useQuery(OBTENER_CLIENTES);
  const { data: dataDestinos } = useQuery(OBTENER_DESTINOS);
  const { data: dataUsuariosCliente } = useQuery(OBTENER_USUARIOS_CLIENTE);
  const [eliminarReserva] = useMutation(ELIMINAR_RESERVA, {
    refetchQueries: [{ query: OBTENER_RESERVAS }],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clienteId || !form.habitacionId || !form.fechaInicio || !form.fechaFin || !form.montoTotal) return;
    try {
      await crearReservaAlojamiento({
        variables: {
          clienteId: form.clienteId,
          habitacionId: form.habitacionId,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          montoTotal: parseFloat(form.montoTotal),
          estado: form.estado,
        },
      });
      setForm({ clienteId: '', habitacionId: '', fechaInicio: '', fechaFin: '', montoTotal: '', estado: 'CONFIRMADA' });
      alert('Reserva de alojamiento creada con éxito');
    } catch (err) {
      // el error se muestra abajo
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      await eliminarReserva({ variables: { id } });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Crear Reserva de Alojamiento</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3">
        <select name="clienteId" value={form.clienteId} onChange={handleChange} className="border rounded px-2 py-1" required>
          <option value="">Selecciona un cliente</option>
          {dataUsuariosCliente && dataUsuariosCliente.usuariosPorRol.map(u => (
            <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
          ))}
        </select>
        <input
          type="text"
          name="habitacionId"
          placeholder="ID de Habitación"
          value={form.habitacionId}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="date"
          name="fechaInicio"
          placeholder="Fecha Inicio"
          value={form.fechaInicio}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="date"
          name="fechaFin"
          placeholder="Fecha Fin"
          value={form.fechaFin}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="number"
          name="montoTotal"
          placeholder="Monto Total"
          value={form.montoTotal}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
          min="0"
          step="0.01"
        />
        <select name="estado" value={form.estado} onChange={handleChange} className="border rounded px-2 py-1" required>
          <option value="CONFIRMADA">CONFIRMADA</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="COMPLETADA">COMPLETADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={creando}
        >
          {creando ? 'Creando...' : 'Crear Reserva de Alojamiento'}
        </button>
        {errorCrear && <p className="text-red-500">Error: {errorCrear.message}</p>}
      </form>

      <h2 className="text-xl font-bold mb-4">Lista de Reservas</h2>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : error ? (
        <p className="text-red-500">Error al cargar reservas: {error.message}</p>
      ) : (
        <ul className="space-y-4">
          {data.reservas.map((reserva) => (
            <li key={reserva.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <p><strong>ID:</strong> {reserva.id}</p>
                <p><strong>Fecha:</strong> {reserva.fecha}</p>
                <p><strong>Cliente ID:</strong> {reserva.clienteId}</p>
                <p><strong>Destino ID:</strong> {reserva.destinoId}</p>
                <p><strong>Monto:</strong> {reserva.monto}</p>
              </div>
              <button
                onClick={() => handleEliminar(reserva.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservaForm;
