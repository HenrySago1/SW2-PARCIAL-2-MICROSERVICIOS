package com.turismo.reserva.graphql;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.reserva.model.Cliente;
import com.turismo.reserva.service.ClienteService;
import com.turismo.usuario.model.Rol;
import com.turismo.usuario.model.Usuario;
import com.turismo.usuario.service.UsuarioService;

@Controller
public class ClienteGraphQL {

    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public ClienteGraphQL(ClienteService clienteService, UsuarioService usuarioService) {
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    @QueryMapping
    public List<Cliente> clientes() {
        return clienteService.findAll();
    }

    @QueryMapping
    public List<Cliente> clientesActivos() {
        return clienteService.findActive();
    }

    @QueryMapping
    public Cliente clientePorId(@Argument Long id) {
        return clienteService.findById(id);
    }

    @QueryMapping
    public Cliente clientePorEmail(@Argument String email) {
        return clienteService.findByEmail(email);
    }

    @MutationMapping
    public Cliente crearCliente(@Argument String nombre, @Argument String apellidos, 
                               @Argument String documento, @Argument String direccion, 
                               @Argument String telefono, @Argument String email, 
                               @Argument String password) {
        // Crear usuario con rol CLIENTE
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(password);
        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(true);
        Usuario usuarioGuardado = usuarioService.save(usuario);

        // Crear cliente y vincular usuarioId
        Cliente cliente = new Cliente();
        cliente.setNombre(nombre);
        cliente.setApellidos(apellidos);
        cliente.setDocumento(documento);
        cliente.setDireccion(direccion);
        cliente.setTelefono(telefono);
        cliente.setEmail(email);
        cliente.setPassword(password);
        cliente.setActivo(true);
        cliente.setUsuarioId(usuarioGuardado.getId());
        return clienteService.save(cliente);
    }

    @MutationMapping
    public Cliente actualizarCliente(@Argument Long id, @Argument String nombre, 
                                    @Argument String apellidos, @Argument String documento, 
                                    @Argument String direccion, @Argument String telefono, 
                                    @Argument String email) {
        return clienteService.update(id, nombre, apellidos, documento, direccion, telefono, email);
    }

    @MutationMapping
    public Boolean eliminarCliente(@Argument Long id) {
        return clienteService.delete(id);
    }

    @MutationMapping
    public Cliente loginCliente(@Argument String email, @Argument String password) {
        return clienteService.login(email, password);
    }

    @MutationMapping
    public Boolean verificarEmailCliente(@Argument String email) {
        return clienteService.existsByEmail(email);
    }

    @MutationMapping
    public Boolean verificarDocumentoCliente(@Argument String documento) {
        return clienteService.existsByDocumento(documento);
    }
} 