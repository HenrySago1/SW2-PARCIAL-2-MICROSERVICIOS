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

    public Optional<ReservaPaquete> findByFacturaId(Long facturaId) {
        return reservaRepo.findByFacturaId(facturaId);
    }
    public ReservaPaquete actualizarEstadoPorFacturaId(Long facturaId, String estado) {
        Optional<ReservaPaquete> opt = reservaRepo.findByFacturaId(facturaId);
        if (opt.isPresent()) {
            ReservaPaquete r = opt.get();
            r.setEstado(estado);
            return reservaRepo.save(r);
        }
        return null;
    }

    public ReservaPaquete save(ReservaPaquete reserva) {
        return reservaRepo.save(reserva);
    }

    public void delete(Long id) {
        reservaRepo.deleteById(id);
    }

    public int countByClienteId(Long clienteId) {
        return reservaRepo.findByClienteId(clienteId).size();
    }
    public double sumMontoByPaqueteId(Long paqueteId) {
        return reservaRepo.findByPaqueteId(paqueteId).stream().mapToDouble(ReservaPaquete::getMonto).sum();
    }
    public int countByYearAndMonth(int year, int month) {
        return reservaRepo.findByYearAndMonth(year, month).size();
    }
} 