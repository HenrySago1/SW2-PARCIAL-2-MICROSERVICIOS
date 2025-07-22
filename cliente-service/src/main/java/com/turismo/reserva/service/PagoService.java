package com.turismo.reserva.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.reserva.model.Pago;
import com.turismo.reserva.repository.PagoRepository;

@Service
public class PagoService {
    private final PagoRepository pagoRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public Pago save(Pago pago) {
        if (pago.getFecha() == null) {
            pago.setFecha(LocalDate.now());
        }
        return pagoRepository.save(pago);
    }

    public List<Pago> findAll() {
        return pagoRepository.findAll();
    }

    public Pago findById(Long id) {
        return pagoRepository.findById(id).orElse(null);
    }

    public List<Pago> findByFacturaId(Long facturaId) {
        return pagoRepository.findByFacturaId(facturaId);
    }

    public void deleteById(Long id) {
        pagoRepository.deleteById(id);
    }
} 