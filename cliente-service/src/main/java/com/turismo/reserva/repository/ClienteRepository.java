package com.turismo.reserva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.turismo.reserva.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByActivoTrue();
    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByDocumento(String documento);
    boolean existsByEmail(String email);
    boolean existsByDocumento(String documento);
} 