package com.turismo.reserva.graphql;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.reserva.model.Destino;
import com.turismo.reserva.service.DestinoService;

@Controller
public class DestinoGraphQL {
    private final DestinoService destinoService;

    public DestinoGraphQL(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @QueryMapping
    public List<Destino> destinos() {
        return destinoService.findAll();
    }

    @QueryMapping
    public Destino destinoPorId(@Argument Long id) {
        return destinoService.findById(id);
    }

    @MutationMapping
    public Destino crearDestino(
            @Argument String nombre,
            @Argument String descripcion,
            @Argument String ubicacion,
            @Argument Double precioBase,
            @Argument Integer cupos,
            @Argument Boolean activo
    ) {
        Destino destino = new Destino();
        destino.setNombre(nombre);
        destino.setDescripcion(descripcion);
        destino.setUbicacion(ubicacion);
        destino.setPrecioBase(precioBase);
        destino.setCupos(cupos);
        destino.setActivo(activo);
        return destinoService.save(destino);
    }

    @MutationMapping
    public Destino actualizarDestino(
            @Argument Long id,
            @Argument String nombre,
            @Argument String descripcion,
            @Argument String ubicacion,
            @Argument Double precioBase,
            @Argument Integer cupos,
            @Argument Boolean activo
    ) {
        Destino destino = destinoService.findById(id);
        if (destino == null) return null;
        destino.setNombre(nombre);
        destino.setDescripcion(descripcion);
        destino.setUbicacion(ubicacion);
        destino.setPrecioBase(precioBase);
        destino.setCupos(cupos);
        destino.setActivo(activo);
        return destinoService.save(destino);
    }

    @MutationMapping
    public Boolean eliminarDestino(@Argument Long id) {
        destinoService.deleteById(id);
        return true;
    }
} 