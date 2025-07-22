    import { gql } from '@apollo/client';

    export const OBTENER_CLIENTES = gql`
    query {
        clientes {
        id
        nombre
        apellidos
        documento
        direccion
        telefono
        email
        }
    }
    `;

    export const CREAR_CLIENTE = gql`
    mutation crearCliente($nombre: String!, $apellidos: String!, $documento: String!, $direccion: String, $telefono: String, $email: String!) {
        crearCliente(nombre: $nombre, apellidos: $apellidos, documento: $documento, direccion: $direccion, telefono: $telefono, email: $email) {
        id
        nombre
        apellidos
        documento
        direccion
        telefono
        email
        }
    }
    `;

    export const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $nombre: String!, $apellidos: String!, $documento: String!, $direccion: String, $telefono: String, $email: String!) {
        actualizarCliente(id: $id, nombre: $nombre, apellidos: $apellidos, documento: $documento, direccion: $direccion, telefono: $telefono, email: $email) {
        id
        nombre
        apellidos
        documento
        direccion
        telefono
        email
        }
    }
    `;

    export const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id: $id)
    }
    `;
