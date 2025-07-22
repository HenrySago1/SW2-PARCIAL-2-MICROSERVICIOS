import { gql } from '@apollo/client';

export const GET_ALOJAMIENTOS = gql`
  query Alojamientos {
    alojamientos {
      id
      nombre
      tipo
      descripcion
      ubicacion
      servicios
      activo
    }
  }
`;

export const GET_HABITACIONES = gql`
  query Habitaciones($alojamientoId: ID) {
    habitaciones(alojamientoId: $alojamientoId) {
      id
      alojamientoId
      nombre
      tipo
      capacidad
      precioNoche
      descripcion
      disponible
    }
  }
`;

export const GET_RESERVAS_ALOJAMIENTO = gql`
  query ReservasAlojamiento {
    reservasAlojamiento {
      id
      habitacionId
      clienteId
      fechaInicio
      fechaFin
      montoTotal
      estado
    }
  }
`;

export const CREAR_ALOJAMIENTO = gql`
  mutation CrearAlojamiento($nombre: String!, $tipo: String!, $descripcion: String, $ubicacion: String!, $servicios: String, $activo: Boolean!) {
    crearAlojamiento(nombre: $nombre, tipo: $tipo, descripcion: $descripcion, ubicacion: $ubicacion, servicios: $servicios, activo: $activo) {
      id
      nombre
      tipo
      descripcion
      ubicacion
      servicios
      activo
    }
  }
`;

export const CREAR_HABITACION = gql`
  mutation CrearHabitacion($alojamientoId: ID!, $nombre: String!, $tipo: String!, $capacidad: Int!, $precioNoche: Float!, $descripcion: String, $disponible: Boolean!) {
    crearHabitacion(alojamientoId: $alojamientoId, nombre: $nombre, tipo: $tipo, capacidad: $capacidad, precioNoche: $precioNoche, descripcion: $descripcion, disponible: $disponible) {
      id
      alojamientoId
      nombre
      tipo
      capacidad
      precioNoche
      descripcion
      disponible
    }
  }
`;

export const CREAR_RESERVA_ALOJAMIENTO = gql`
  mutation CrearReservaAlojamiento($habitacionId: ID!, $clienteId: ID!, $fechaInicio: String!, $fechaFin: String!, $montoTotal: Float!, $estado: String!) {
    crearReservaAlojamiento(habitacionId: $habitacionId, clienteId: $clienteId, fechaInicio: $fechaInicio, fechaFin: $fechaFin, montoTotal: $montoTotal, estado: $estado) {
      id
      habitacionId
      clienteId
      fechaInicio
      fechaFin
      montoTotal
      estado
    }
  }
`;

export { GET_ALOJAMIENTOS as OBTENER_ALOJAMIENTOS };
// Mutaciones (crear/actualizar/eliminar) pueden agregarse según necesidad 