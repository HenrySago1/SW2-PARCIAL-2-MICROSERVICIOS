import { gql } from '@apollo/client';

export const GET_FACTURAS = gql`
  query Facturas {
    facturas {
      id
      fecha
      clienteId
      montoTotal
      estado
      metodoPago
    }
  }
`;

export const GET_PAGOS = gql`
  query Pagos {
    pagos {
      id
      facturaId
      fecha
      monto
      metodo
      estado
    }
  }
`;

export const GET_TRANSACCIONES = gql`
  query Transacciones {
    transacciones {
      id
      tipo
      fecha
      monto
      descripcion
      referenciaId
      referenciaTipo
    }
  }
`;

export const CREAR_FACTURA = gql`
  mutation CrearFactura($clienteId: ID!, $montoTotal: Float!, $metodoPago: String) {
    crearFactura(clienteId: $clienteId, montoTotal: $montoTotal, metodoPago: $metodoPago) {
      id
      fecha
      clienteId
      montoTotal
      estado
      metodoPago
    }
  }
`;

export const CREAR_PAGO = gql`
  mutation RegistrarPago($facturaId: ID!, $monto: Float!, $metodo: String) {
    registrarPago(facturaId: $facturaId, monto: $monto, metodo: $metodo) {
      id
      facturaId
      fecha
      monto
      metodo
      estado
    }
  }
`;

export const CREAR_TRANSACCION = gql`
  mutation CrearTransaccion($tipo: String!, $fecha: String!, $monto: Float!, $descripcion: String, $referenciaId: ID, $referenciaTipo: String) {
    crearTransaccion(tipo: $tipo, fecha: $fecha, monto: $monto, descripcion: $descripcion, referenciaId: $referenciaId, referenciaTipo: $referenciaTipo) {
      id
      tipo
      fecha
      monto
      descripcion
      referenciaId
      referenciaTipo
    }
  }
`;

// Mutaciones (crear/actualizar/eliminar) pueden agregarse según necesidad 