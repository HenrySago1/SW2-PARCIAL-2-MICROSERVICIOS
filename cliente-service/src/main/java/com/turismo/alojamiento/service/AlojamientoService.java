package com.turismo.alojamiento.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.alojamiento.model.Alojamiento;
import com.turismo.alojamiento.repository.AlojamientoRepository;

@Service
public class AlojamientoService {
    private final AlojamientoRepository alojamientoRepository;

    public AlojamientoService(AlojamientoRepository alojamientoRepository) {
        this.alojamientoRepository = alojamientoRepository;
    }

    public List<Alojamiento> findAll() {
        return alojamientoRepository.findAll();
    }

    public Alojamiento findById(Long id) {
        return alojamientoRepository.findById(id).orElse(null);
    }

    public Alojamiento save(Alojamiento alojamiento) {
        return alojamientoRepository.save(alojamiento);
    }

    public void deleteById(Long id) {
        alojamientoRepository.deleteById(id);
    }
} 