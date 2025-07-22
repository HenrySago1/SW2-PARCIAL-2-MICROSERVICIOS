package com.turismo.reserva.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turismo.reserva.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByFacturaId(Long facturaId);
} 