package com.turismo.reserva.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.reserva.model.Transaccion;
import com.turismo.reserva.repository.TransaccionRepository;

@Service
public class TransaccionService {
    private final TransaccionRepository transaccionRepository;

    public TransaccionService(TransaccionRepository transaccionRepository) {
        this.transaccionRepository = transaccionRepository;
    }

    public Transaccion save(Transaccion transaccion) {
        if (transaccion.getFecha() == null) {
            transaccion.setFecha(LocalDate.now());
        }
        return transaccionRepository.save(transaccion);
    }

    public List<Transaccion> findAll() {
        return transaccionRepository.findAll();
    }

    public Transaccion findById(Long id) {
        return transaccionRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        transaccionRepository.deleteById(id);
    }
} 