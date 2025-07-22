package com.turismo.usuario.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.turismo.reserva.service.ClienteService;
import com.turismo.usuario.model.Usuario;
import com.turismo.usuario.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final ClienteService clienteService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository, ClienteService clienteService) {
        this.usuarioRepository = usuarioRepository;
        this.clienteService = clienteService;
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario save(Usuario usuario) {
        // Encriptar la contraseña si no está encriptada
        if (usuario.getPassword() != null && !usuario.getPassword().startsWith("$2a$")) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        
        // Guardar el usuario
        Usuario savedUsuario = usuarioRepository.save(usuario);
        
        // Crear automáticamente un cliente asociado si no existe
        // Comentado temporalmente para evitar errores
        /*
        try {
            Cliente existingCliente = clienteService.findByEmail(usuario.getEmail());
            if (existingCliente == null) {
                Cliente cliente = new Cliente();
                cliente.setNombre(usuario.getNombre());
                cliente.setEmail(usuario.getEmail());
                cliente.setTelefono(""); // Campo opcional
                cliente.setDireccion(""); // Campo opcional
                cliente.setPassword(""); // Campo requerido pero vacío para cliente automático
                cliente.setActivo(true);
                clienteService.save(cliente);
                System.out.println("=== DEBUG: Cliente creado automáticamente para usuario: " + usuario.getEmail() + " ===");
            }
        } catch (Exception e) {
            System.err.println("=== ERROR al crear cliente automáticamente: " + e.getMessage() + " ===");
        }
        */
        
        return savedUsuario;
    }

    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public List<Usuario> findByRol(com.turismo.usuario.model.Rol rol) {
        return usuarioRepository.findByRol(rol);
    }
} 