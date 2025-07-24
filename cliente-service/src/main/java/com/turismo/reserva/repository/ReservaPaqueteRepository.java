package com.turismo.reserva.repository;

import com.turismo.reserva.model.ReservaPaquete;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservaPaqueteRepository extends JpaRepository<ReservaPaquete, Long> {
    Optional<ReservaPaquete> findByFacturaId(Long facturaId);
} 