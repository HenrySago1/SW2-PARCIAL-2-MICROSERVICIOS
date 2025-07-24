package com.turismo.reserva.service;

import com.turismo.reserva.model.PaqueteTuristico;
import com.turismo.reserva.repository.PaqueteTuristicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaqueteTuristicoService {
    @Autowired
    private PaqueteTuristicoRepository paqueteRepo;

    public List<PaqueteTuristico> findAll() {
        return paqueteRepo.findAll();
    }

    public Optional<PaqueteTuristico> findById(Long id) {
        return paqueteRepo.findById(id);
    }

    public PaqueteTuristico save(PaqueteTuristico paquete) {
        return paqueteRepo.save(paquete);
    }

    public void delete(Long id) {
        paqueteRepo.deleteById(id);
    }
} 