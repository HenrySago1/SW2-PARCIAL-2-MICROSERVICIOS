package com.turismo.alojamiento.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reserva_alojamiento")
public class ReservaAlojamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long habitacionId;
    private Long clienteId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Double montoTotal;
    private String estado;

    public ReservaAlojamiento() {}
    
    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getHabitacionId() { return habitacionId; }
    public void setHabitacionId(Long habitacionId) { this.habitacionId = habitacionId; }
    
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    
    public Double getMontoTotal() { return montoTotal; }
    public void setMontoTotal(Double montoTotal) { this.montoTotal = montoTotal; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
} 