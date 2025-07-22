package com.turismo.reserva.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.turismo.reserva.model.Cliente;
import com.turismo.reserva.repository.ClienteRepository;

@Service
public class ClienteService {
    private final ClienteRepository repository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> findAll() {
        return repository.findAll();
    }

    public List<Cliente> findActive() {
        return repository.findByActivoTrue();
    }

    public Cliente findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Cliente findByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public Cliente save(Cliente cliente) {
        // Encriptar la contraseña si no está encriptada
        if (cliente.getPassword() != null && !cliente.getPassword().startsWith("$2a$")) {
            cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
        }
        return repository.save(cliente);
    }

    public Cliente update(Long id, String nombre, String apellidos, String documento, 
                        String direccion, String telefono, String email) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        cliente.setNombre(nombre);
        cliente.setApellidos(apellidos);
        cliente.setDocumento(documento);
        cliente.setDireccion(direccion);
        cliente.setTelefono(telefono);
        cliente.setEmail(email);
        return repository.save(cliente);
    }

    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Cliente login(String email, String rawPassword) {
        Cliente cliente = repository.findByEmail(email).orElse(null);
        if (cliente != null && passwordEncoder.matches(rawPassword, cliente.getPassword())) {
            return cliente;
        }
        return null;
    }

    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    public boolean existsByDocumento(String documento) {
        return repository.existsByDocumento(documento);
    }
} 