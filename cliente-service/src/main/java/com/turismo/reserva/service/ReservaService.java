package com.turismo.reserva.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.reserva.model.Reserva;
import com.turismo.reserva.repository.ReservaRepository;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    public Reserva save(Reserva reserva) {
        return reservaRepository.save(reserva);
    }
    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Reserva findById(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }
    public List<Reserva> findByClienteId(Long clienteId) {
        return reservaRepository.findByClienteId(clienteId);
    }
    

    public void deleteById(Long id) {
        reservaRepository.deleteById(id);
    }

    public long countByClienteId(Long clienteId) {
        return reservaRepository.countByClienteId(clienteId);
    }
    public double sumMontoByDestinoId(Long destinoId) {
        return reservaRepository.findByDestinoId(destinoId).stream().mapToDouble(Reserva::getMonto).sum();
    }
    public int countReservasPorMes(int year, int month) {
        return (int) reservaRepository.findAll().stream()
            .filter(r -> r.getFecha().getYear() == year && r.getFecha().getMonthValue() == month)
            .count();
    }
    
    public int countByClienteNombre(String clienteNombre) {
        return reservaRepository.countByClienteNombre(clienteNombre);
    }
    
    public double sumMontoByDestinoNombre(String destinoNombre) {
        return reservaRepository.sumMontoByDestinoNombre(destinoNombre);
    }
}
