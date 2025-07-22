package com.turismo.reserva.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turismo.reserva.model.Transaccion;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
} 