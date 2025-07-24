package com.turismo.reserva.repository;

import com.turismo.reserva.model.ReservaPaquete;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservaPaqueteRepository extends JpaRepository<ReservaPaquete, Long> {
    Optional<ReservaPaquete> findByFacturaId(Long facturaId);
    List<ReservaPaquete> findByClienteId(Long clienteId);
    List<ReservaPaquete> findByPaqueteId(Long paqueteId);
    // Buscar por mes y año
    @org.springframework.data.jpa.repository.Query("SELECT r FROM ReservaPaquete r WHERE FUNCTION('YEAR', r.fechaReserva) = :year AND FUNCTION('MONTH', r.fechaReserva) = :month")
    List<ReservaPaquete> findByYearAndMonth(@org.springframework.data.repository.query.Param("year") int year, @org.springframework.data.repository.query.Param("month") int month);
} 