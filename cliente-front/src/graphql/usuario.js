import { gql } from '@apollo/client';

// Queries
export const GET_USUARIOS = gql`
  query GetUsuarios {
    usuarios {
      id
      nombre
      email
      rol
      activo
    }
  }
`;

export const GET_USUARIO_POR_ID = gql`
  query GetUsuarioPorId($id: ID!) {
    usuarioPorId(id: $id) {
      id
      nombre
      email
      rol
      activo
    }
  }
`;

export const GET_USUARIO_POR_EMAIL = gql`
  query GetUsuarioPorEmail($email: String!) {
    usuarioPorEmail(email: $email) {
      id
      nombre
      email
      rol
      activo
    }
  }
`;

export const OBTENER_USUARIOS_CLIENTE = gql`
  query {
    usuariosPorRol(rol: CLIENTE) {
      id
      nombre
      email
      activo
    }
  }
`;

// Mutations
export const CREAR_USUARIO = gql`
  mutation CrearUsuario($nombre: String!, $apellidos: String!, $documento: String!, $email: String!, $password: String!, $rol: Rol!, $activo: Boolean!) {
    crearUsuario(nombre: $nombre, apellidos: $apellidos, documento: $documento, email: $email, password: $password, rol: $rol, activo: $activo) {
      id
      nombre
      email
      rol
      activo
    }
  }
`;

export const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: ID!, $nombre: String!, $email: String!, $password: String!, $rol: Rol!, $activo: Boolean!) {
    actualizarUsuario(id: $id, nombre: $nombre, email: $email, password: $password, rol: $rol, activo: $activo) {
      id
      nombre
      email
      rol
      activo
    }
  }
`;

export const ELIMINAR_USUARIO = gql`
  mutation EliminarUsuario($id: ID!) {
    eliminarUsuario(id: $id)
  }
`; 