package com.turismo.alojamiento.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Habitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String tipo;
    private Integer capacidad;
    private Double precioNoche;
    private String descripcion;
    private Boolean disponible;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alojamiento_id")
    private Alojamiento alojamiento;

    public Habitacion() {}
    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    public Double getPrecioNoche() { return precioNoche; }
    public void setPrecioNoche(Double precioNoche) { this.precioNoche = precioNoche; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public Alojamiento getAlojamiento() { return alojamiento; }
    public void setAlojamiento(Alojamiento alojamiento) { this.alojamiento = alojamiento; }
    public Long getAlojamientoId() {
        return alojamiento != null ? alojamiento.getId() : null;
    }
} 