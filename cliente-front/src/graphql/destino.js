import { gql } from '@apollo/client';

export const OBTENER_DESTINOS = gql`
  query {
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

export const CREAR_DESTINO = gql`
  mutation CrearDestino($nombre: String!, $descripcion: String!, $ubicacion: String!, $precioBase: Float!, $cupos: Int!, $activo: Boolean!) {
    crearDestino(nombre: $nombre, descripcion: $descripcion, ubicacion: $ubicacion, precioBase: $precioBase, cupos: $cupos, activo: $activo) {
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

export const ACTUALIZAR_DESTINO = gql`
  mutation ActualizarDestino($id: ID!, $nombre: String!, $descripcion: String!, $ubicacion: String!, $precioBase: Float!, $cupos: Int!, $activo: Boolean!) {
    actualizarDestino(id: $id, nombre: $nombre, descripcion: $descripcion, ubicacion: $ubicacion, precioBase: $precioBase, cupos: $cupos, activo: $activo) {
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

export const ELIMINAR_DESTINO = gql`
  mutation EliminarDestino($id: ID!) {
    eliminarDestino(id: $id)
  }
`; 