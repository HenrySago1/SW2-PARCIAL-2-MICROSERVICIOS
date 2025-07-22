package com.turismo.alojamiento.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turismo.alojamiento.model.Alojamiento;

public interface AlojamientoRepository extends JpaRepository<Alojamiento, Long> {
} 