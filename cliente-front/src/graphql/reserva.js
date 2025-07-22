import { gql } from '@apollo/client';

export const OBTENER_RESERVAS = gql`
  query {
    reservas {
      id
      clienteId
      fecha
      destinoId
      monto
    }
  }
`;

export const CREAR_RESERVA = gql`
  mutation CrearReserva(
    $clienteId: ID!
    $destinoId: ID!
    $monto: Float!
    $fecha: String!
  ) {
    crearReserva(
      clienteId: $clienteId
      destinoId: $destinoId
      monto: $monto
      fecha: $fecha
    ) {
      id
      clienteId
      destinoId
      fecha
      monto
    }
  }
`;

export const ACTUALIZAR_RESERVA = gql`
  mutation ActualizarReserva(
    $id: ID!
    $clienteId: ID!
    $destinoId: ID!
    $monto: Float!
    $fecha: String!
  ) {
    actualizarReserva(
      id: $id
      clienteId: $clienteId
      destinoId: $destinoId
      monto: $monto
      fecha: $fecha
    ) {
      id
      clienteId
      destinoId
      fecha
      monto
    }
  }
`;

export const ELIMINAR_RESERVA = gql`
  mutation EliminarReserva($id: ID!) {
    eliminarReserva(id: $id)
  }
`;

export const TOTAL_RESERVAS_POR_CLIENTE = gql`
  query TotalReservasPorCliente($clienteNombre: String!) {
    totalReservasPorCliente(clienteNombre: $clienteNombre)
  }
`;

export const INGRESOS_POR_DESTINO = gql`
  query IngresosPorDestino($destino: String!) {
    ingresosPorDestino(destino: $destino)
  }
`;

export const RESERVAS_POR_MES = gql`
  query ReservasPorMes($year: Int!, $month: Int!) {
    reservasPorMes(year: $year, month: $month)
  }
`;

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
