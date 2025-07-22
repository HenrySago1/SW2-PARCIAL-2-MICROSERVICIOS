package com.turismo.reserva.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turismo.reserva.model.Factura;

public interface FacturaRepository extends JpaRepository<Factura, Long> {
    List<Factura> findByClienteId(Long clienteId);
} 