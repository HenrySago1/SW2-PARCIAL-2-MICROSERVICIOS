package com.turismo.reserva.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turismo.reserva.model.Destino;

public interface DestinoRepository extends JpaRepository<Destino, Long> {
} 