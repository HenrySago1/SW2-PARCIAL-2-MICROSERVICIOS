import { gql } from 'graphql-request';

// Query para obtener todas las reservas de alojamiento
export const GET_RESERVAS_ALOJAMIENTO = gql`
  query GetReservasAlojamiento {
    reservasAlojamiento {
      id
      habitacionId
      clienteId
      fechaInicio
      fechaFin
      montoTotal
      estado
      habitacion {
        id
        nombre
        tipo
        capacidad
        precioNoche
        descripcion
        disponible
        alojamiento {
          id
          nombre
          tipo
          descripcion
          ubicacion
          servicios
        }
      }
      cliente {
        id
        nombre
        apellidos
        email
        telefono
      }
    }
  }
`;

// Query para obtener reservas por cliente
export const GET_RESERVAS_POR_CLIENTE = gql`
  query GetReservasPorCliente($clienteId: ID!) {
    reservasAlojamiento {
      id
      habitacionId
      clienteId
      fechaInicio
      fechaFin
      montoTotal
      estado
      habitacion {
        id
        nombre
        tipo
        capacidad
        precioNoche
        descripcion
        disponible
        alojamiento {
          id
          nombre
          tipo
          descripcion
          ubicacion
          servicios
        }
      }
      cliente {
        id
        nombre
        apellidos
        email
        telefono
      }
    }
  }
`;

// Query para obtener una reserva específica
export const GET_RESERVA_POR_ID = gql`
  query GetReservaPorId($id: ID!) {
    reservaAlojamientoPorId(id: $id) {
      id
      habitacionId
      clienteId
      fechaInicio
      fechaFin
      montoTotal
      estado
      habitacion {
        id
        nombre
        tipo
        capacidad
        precioNoche
        descripcion
        disponible
        alojamiento {
          id
          nombre
          tipo
          descripcion
          ubicacion
          servicios
        }
      }
      cliente {
        id
        nombre
        apellidos
        email
        telefono
      }
    }
  }
`;

// Mutation para crear una nueva reserva
export const CREAR_RESERVA_ALOJAMIENTO = gql`
  mutation CrearReservaAlojamiento(
    $habitacionId: ID!
    $clienteId: ID!
    $fechaInicio: String!
    $fechaFin: String!
    $montoTotal: Float!
    $estado: String!
  ) {
    crearReservaAlojamiento(
      habitacionId: $habitacionId
      clienteId: $clienteId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      montoTotal: $montoTotal
      estado: $estado
    ) {
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

// Mutation para actualizar una reserva
export const ACTUALIZAR_RESERVA_ALOJAMIENTO = gql`
  mutation ActualizarReservaAlojamiento(
    $id: ID!
    $habitacionId: ID!
    $clienteId: ID!
    $fechaInicio: String!
    $fechaFin: String!
    $montoTotal: Float!
    $estado: String!
  ) {
    actualizarReservaAlojamiento(
      id: $id
      habitacionId: $habitacionId
      clienteId: $clienteId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      montoTotal: $montoTotal
      estado: $estado
    ) {
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

// Mutation para eliminar una reserva
export const ELIMINAR_RESERVA_ALOJAMIENTO = gql`
  mutation EliminarReservaAlojamiento($id: ID!) {
    eliminarReservaAlojamiento(id: $id)
  }
`;

// Query para obtener destinos disponibles
export const GET_DESTINOS = gql`
  query GetDestinos {
    destinos {
      id
      nombre
      descripcion
      ubicacion
      precioBase
      cupos
      activo
    }
  }
`;

// Query para obtener alojamientos disponibles
export const GET_ALOJAMIENTOS = gql`
  query GetAlojamientos {
    alojamientos {
      id
      nombre
      tipo
      descripcion
      ubicacion
      servicios
      activo
      habitaciones {
        id
        nombre
        tipo
        capacidad
        precioNoche
        descripcion
        disponible
      }
    }
  }
`; 