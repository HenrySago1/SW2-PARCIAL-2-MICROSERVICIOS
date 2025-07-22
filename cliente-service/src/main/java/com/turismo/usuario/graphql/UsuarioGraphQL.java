package com.turismo.usuario.graphql;

import java.util.List;
import java.util.Optional;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.reserva.model.Cliente;
import com.turismo.reserva.service.ClienteService;
import com.turismo.usuario.model.LoginResponse;
import com.turismo.usuario.model.Rol;
import com.turismo.usuario.model.Usuario;
import com.turismo.usuario.service.UsuarioService;

@Controller
public class UsuarioGraphQL {
    private final UsuarioService usuarioService;
    private final ClienteService clienteService;

    public UsuarioGraphQL(UsuarioService usuarioService, ClienteService clienteService) {
        this.usuarioService = usuarioService;
        this.clienteService = clienteService;
    }

    @QueryMapping
    public List<Usuario> usuarios() {
        return usuarioService.findAll();
    }

    @QueryMapping
    public Usuario usuarioPorId(@Argument Long id) {
        return usuarioService.findById(id).orElse(null);
    }

    @QueryMapping
    public Usuario usuarioPorEmail(@Argument String email) {
        return usuarioService.findByEmail(email).orElse(null);
    }

    @QueryMapping
    public LoginResponse login(@Argument String email, @Argument String password) {
        try {
            Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);
            
            if (usuarioOpt.isEmpty()) {
                return new LoginResponse(false, "Usuario no encontrado", null, null);
            }
            
            Usuario usuario = usuarioOpt.get();
            
            // Verificar si el usuario está activo
            if (!usuario.getActivo()) {
                return new LoginResponse(false, "Usuario inactivo", null, null);
            }
            
            // Verificar contraseña usando BCrypt
            if (!usuarioService.verifyPassword(password, usuario.getPassword())) {
                return new LoginResponse(false, "Contraseña incorrecta", null, null);
            }
            
            // Generar token simple (en producción usar JWT)
            String token = "token_" + usuario.getId() + "_" + System.currentTimeMillis();
            
            return new LoginResponse(true, "Login exitoso", usuario, token);
            
        } catch (Exception e) {
            return new LoginResponse(false, "Error en el login: " + e.getMessage(), null, null);
        }
    }

    @QueryMapping
    public String debugPassword(@Argument String email) {
        Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            return "Usuario: " + usuario.getNombre() + ", Password: " + usuario.getPassword();
        }
        return "Usuario no encontrado";
    }

    @MutationMapping
    public Usuario crearUsuario(
            @Argument String nombre,
            @Argument String apellidos,
            @Argument String documento,
            @Argument String email,
            @Argument String password,
            @Argument Rol rol,
            @Argument Boolean activo) {
        try {
            Usuario usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setEmail(email);
            usuario.setPassword(password); // Se encriptará automáticamente en el servicio
            usuario.setRol(rol);
            usuario.setActivo(activo);
            usuario.setFcmToken("cCovqZUKRAeZgdfcn1peiY:APA91bFX4HlrXJjTF2qnPopwrgYFd4pwHK0FanCpGUXFOKNseU7oRl1s6PHHwyYZlNJxejn_vZW60Fu4QUICcBOs6xG6JeCRUY7vZY__UX9lbs0jcSesMfs");
            Usuario savedUsuario = usuarioService.save(usuario);
            // Si el rol es CLIENTE, crear también el cliente
            if (rol == Rol.CLIENTE && !clienteService.existsByEmail(email)) {
                Cliente cliente = new Cliente();
                cliente.setNombre(nombre);
                cliente.setApellidos(apellidos);
                cliente.setDocumento(documento);
                cliente.setDireccion("");
                cliente.setTelefono("");
                cliente.setEmail(email);
                cliente.setPassword(password); // Se encriptará en ClienteService
                cliente.setActivo(activo != null ? activo : true);
                cliente.setUsuarioId(savedUsuario.getId()); // Sincroniza el id de usuario
                clienteService.save(cliente);
            }
            return savedUsuario;
        } catch (Exception e) {
            e.printStackTrace(); // Imprime el error real en consola
            throw new RuntimeException("Error al crear usuario/cliente: " + e.getMessage());
        }
    }

    @MutationMapping
    public Usuario actualizarUsuario(
            @Argument Long id,
            @Argument String nombre,
            @Argument String email,
            @Argument String password,
            @Argument Rol rol,
            @Argument Boolean activo) {
        Usuario usuario = usuarioService.findById(id).orElse(null);
        if (usuario != null) {
            usuario.setNombre(nombre);
            usuario.setEmail(email);
            if (password != null && !password.isEmpty()) {
                usuario.setPassword(password); // Se encriptará automáticamente
            }
            usuario.setRol(rol);
            usuario.setActivo(activo);
            return usuarioService.save(usuario);
        }
        return null;
    }

    @MutationMapping
    public Boolean eliminarUsuario(@Argument Long id) {
        try {
            usuarioService.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @QueryMapping
    public List<Usuario> usuariosPorRol(@Argument Rol rol) {
        return usuarioService.findByRol(rol);
    }

    @MutationMapping
    public Usuario actualizarFcmToken(@Argument Long id, @Argument String fcmToken) {
        Usuario usuario = usuarioService.findById(id).orElse(null);
        if (usuario != null) {
            usuario.setFcmToken(fcmToken);
            return usuarioService.save(usuario);
        }
        return null;
    }
} 