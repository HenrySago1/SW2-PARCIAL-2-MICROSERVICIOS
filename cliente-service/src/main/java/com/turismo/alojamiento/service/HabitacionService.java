package com.turismo.alojamiento.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.alojamiento.model.Habitacion;
import com.turismo.alojamiento.repository.HabitacionRepository;

@Service
public class HabitacionService {
    private final HabitacionRepository habitacionRepository;

    public HabitacionService(HabitacionRepository habitacionRepository) {
        this.habitacionRepository = habitacionRepository;
    }

    public List<Habitacion> findAll() {
        return habitacionRepository.findAll();
    }

    public Habitacion findById(Long id) {
        return habitacionRepository.findById(id).orElse(null);
    }

    public List<Habitacion> findByAlojamientoId(Long alojamientoId) {
        return habitacionRepository.findByAlojamiento_Id(alojamientoId);
    }

    public Habitacion save(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }

    public void deleteById(Long id) {
        habitacionRepository.deleteById(id);
    }
} 