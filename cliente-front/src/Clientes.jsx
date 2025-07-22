import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
    ACTUALIZAR_CLIENTE,
    ELIMINAR_CLIENTE,
    OBTENER_CLIENTES,
} from "./graphql/cliente";

export default function Clientes() {
  const { loading, error, data } = useQuery(OBTENER_CLIENTES);
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    refetchQueries: [{ query: OBTENER_CLIENTES }],
  });

  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    refetchQueries: [{ query: OBTENER_CLIENTES }],
  });

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });

  const handleEliminar = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este cliente?")) {
      await eliminarCliente({ variables: { id } });
    }
  };

  const handleEditar = (cliente) => {
    setEditandoId(cliente.id);
    setForm({ nombre: cliente.nombre, email: cliente.email });
  };

  const handleGuardar = async (id) => {
    await actualizarCliente({
      variables: { id, nombre: form.nombre, email: form.email },
    });
    setEditandoId(null);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-2">Lista de Clientes</h2>
      <ul className="space-y-3">
        {data.clientes.map((cliente) => (
          <li
            key={cliente.id}
            className="border rounded p-3 flex flex-col gap-2"
          >
            {editandoId === cliente.id ? (
              <>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="border p-1"
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border p-1"
                  placeholder="Email"
                />
                <div className="space-x-2">
                  <button
                    onClick={() => handleGuardar(cliente.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="font-semibold">{cliente.nombre}</p>
                  <p className="text-gray-500 text-sm">{cliente.email}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditar(cliente)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
