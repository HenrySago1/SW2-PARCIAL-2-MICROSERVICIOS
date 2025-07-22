package com.turismo.alojamiento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.turismo.alojamiento.model.ReservaAlojamiento;

@Repository
public interface ReservaAlojamientoRepository extends JpaRepository<ReservaAlojamiento, Long> {
    List<ReservaAlojamiento> findByClienteId(Long clienteId);
    List<ReservaAlojamiento> findByHabitacionId(Long habitacionId);
} 