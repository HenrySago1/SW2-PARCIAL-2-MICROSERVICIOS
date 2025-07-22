package com.turismo.alojamiento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.turismo.alojamiento.model.Habitacion;

public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {
    List<Habitacion> findByAlojamiento_Id(Long alojamientoId);
} 