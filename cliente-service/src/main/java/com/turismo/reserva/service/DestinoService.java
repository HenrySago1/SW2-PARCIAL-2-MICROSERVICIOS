package com.turismo.reserva.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.reserva.model.Destino;
import com.turismo.reserva.repository.DestinoRepository;

@Service
public class DestinoService {
    private final DestinoRepository destinoRepository;

    public DestinoService(DestinoRepository destinoRepository) {
        this.destinoRepository = destinoRepository;
    }

    public Destino save(Destino destino) {
        return destinoRepository.save(destino);
    }

    public List<Destino> findAll() {
        return destinoRepository.findAll();
    }

    public Destino findById(Long id) {
        return destinoRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        destinoRepository.deleteById(id);
    }
} 