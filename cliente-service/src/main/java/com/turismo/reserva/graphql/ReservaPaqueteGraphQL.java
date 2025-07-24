package com.turismo.reserva.graphql;

import com.turismo.reserva.model.ReservaPaquete;
import com.turismo.reserva.service.ReservaPaqueteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.reserva.graphql.ReservaPaqueteInput;
import com.turismo.reserva.repository.ClienteRepository;
import com.turismo.reserva.repository.PaqueteTuristicoRepository;
import com.turismo.reserva.model.Cliente;
import com.turismo.reserva.model.PaqueteTuristico;

import java.util.List;
import java.util.Optional;

@Controller
public class ReservaPaqueteGraphQL {
    @Autowired
    private ReservaPaqueteService reservaService;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private PaqueteTuristicoRepository paqueteTuristicoRepository;

    @QueryMapping
    public List<ReservaPaquete> reservasPaquete() {
        return reservaService.findAll();
    }

    @QueryMapping
    public Optional<ReservaPaquete> reservaPaquete(@Argument Long id) {
        return reservaService.findById(id);
    }

    @MutationMapping
    public ReservaPaquete reservarPaquete(@Argument("input") ReservaPaqueteInput input) {
        ReservaPaquete reserva = new ReservaPaquete();
        Cliente cliente = clienteRepository.findById(input.getClienteId())
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(input.getPaqueteId())
            .orElseThrow(() -> new RuntimeException("Paquete no encontrado"));
        reserva.setCliente(cliente);
        reserva.setPaquete(paquete);
        reserva.setFechaReserva(input.getFechaReserva());
        reserva.setMonto(input.getMonto());
        reserva.setEstado(input.getEstado());
        return reservaService.save(reserva);
    }

    @MutationMapping
    public Boolean cancelarReservaPaquete(@Argument Long id) {
        reservaService.delete(id);
        return true;
    }
} 