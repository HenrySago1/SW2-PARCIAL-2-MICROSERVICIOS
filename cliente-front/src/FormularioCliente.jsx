// src/FormularioCliente.jsx
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREAR_CLIENTE, OBTENER_CLIENTES } from "./graphql/cliente";

export default function FormularioCliente({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    direccion: "",
    telefono: "",
    email: ""
  });

  const [crearCliente, { loading, error }] = useMutation(CREAR_CLIENTE, {
    refetchQueries: [{ query: OBTENER_CLIENTES }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellidos || !form.documento || !form.email) return;
    try {
      await crearCliente({ variables: form });
      setForm({ nombre: "", apellidos: "", documento: "", direccion: "", telefono: "", email: "" });
      alert("Cliente creado con éxito");
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      console.error("Error al crear cliente", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md mb-4 max-w-md"
    >
      <h2 className="text-lg font-bold mb-2">Crear Cliente</h2>
      <div className="mb-2">
        <label className="block">Nombre:</label>
        <input
          type="text"
          name="nombre"
          className="border rounded px-2 py-1 w-full"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Apellidos:</label>
        <input
          type="text"
          name="apellidos"
          className="border rounded px-2 py-1 w-full"
          value={form.apellidos}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Documento (CI/DNI/Pasaporte):</label>
        <input
          type="text"
          name="documento"
          className="border rounded px-2 py-1 w-full"
          value={form.documento}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Dirección:</label>
        <input
          type="text"
          name="direccion"
          className="border rounded px-2 py-1 w-full"
          value={form.direccion}
          onChange={handleChange}
        />
      </div>
      <div className="mb-2">
        <label className="block">Teléfono:</label>
        <input
          type="text"
          name="telefono"
          className="border rounded px-2 py-1 w-full"
          value={form.telefono}
          onChange={handleChange}
        />
      </div>
      <div className="mb-2">
        <label className="block">Email:</label>
        <input
          type="email"
          name="email"
          className="border rounded px-2 py-1 w-full"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear Cliente"}
      </button>
      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
    </form>
  );
}
