package com.turismo.reserva.service;

import com.turismo.reserva.model.ReservaPaquete;
import com.turismo.reserva.repository.ReservaPaqueteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaPaqueteService {
    @Autowired
    private ReservaPaqueteRepository reservaRepo;

    public List<ReservaPaquete> findAll() {
        return reservaRepo.findAll();
    }

    public Optional<ReservaPaquete> findById(Long id) {
        return reservaRepo.findById(id);
    }

    public ReservaPaquete save(ReservaPaquete reserva) {
        return reservaRepo.save(reserva);
    }

    public void delete(Long id) {
        reservaRepo.deleteById(id);
    }
} 