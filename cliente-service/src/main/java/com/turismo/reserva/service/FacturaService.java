package com.turismo.reserva.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.reserva.model.Factura;
import com.turismo.reserva.repository.FacturaRepository;

@Service
public class FacturaService {
    private final FacturaRepository facturaRepository;

    public FacturaService(FacturaRepository facturaRepository) {
        this.facturaRepository = facturaRepository;
    }

    public Factura save(Factura factura) {
        if (factura.getFecha() == null) {
            factura.setFecha(LocalDate.now());
        }
        return facturaRepository.save(factura);
    }

    public List<Factura> findAll() {
        return facturaRepository.findAll();
    }

    public Factura findById(Long id) {
        return facturaRepository.findById(id).orElse(null);
    }

    public List<Factura> findByClienteId(Long clienteId) {
        return facturaRepository.findByClienteId(clienteId);
    }

    public void deleteById(Long id) {
        facturaRepository.deleteById(id);
    }
} 