package com.turismo.reserva.graphql;

import com.turismo.reserva.model.PaqueteTuristico;
import com.turismo.reserva.service.PaqueteTuristicoService;
import com.turismo.reserva.repository.DestinoRepository;
import com.turismo.reserva.model.Destino;
import com.turismo.reserva.graphql.PaqueteTuristicoInput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class PaqueteTuristicoGraphQL {
    @Autowired
    private PaqueteTuristicoService paqueteService;
    @Autowired
    private DestinoRepository destinoRepository;

    @QueryMapping
    public List<PaqueteTuristico> paquetesTuristicos() {
        return paqueteService.findAll();
    }

    @QueryMapping
    public Optional<PaqueteTuristico> paqueteTuristico(@Argument Long id) {
        return paqueteService.findById(id);
    }

    @MutationMapping
    public PaqueteTuristico crearPaqueteTuristico(@Argument("input") PaqueteTuristicoInput input) {
        PaqueteTuristico paquete = new PaqueteTuristico();
        paquete.setNombre(input.getNombre());
        paquete.setDescripcion(input.getDescripcion());
        paquete.setPrecio(input.getPrecio());
        paquete.setFechaInicio(input.getFechaInicio());
        paquete.setFechaFin(input.getFechaFin());
        paquete.setCupos(input.getCupos());
        paquete.setServiciosIncluidos(input.getServiciosIncluidos());
        paquete.setActivo(input.getActivo());
        Destino destino = destinoRepository.findById(input.getDestinoId())
            .orElseThrow(() -> new RuntimeException("Destino no encontrado"));
        paquete.setDestino(destino);
        return paqueteService.save(paquete);
    }

    @MutationMapping
    public Boolean eliminarPaqueteTuristico(@Argument Long id) {
        paqueteService.delete(id);
        return true;
    }
} 