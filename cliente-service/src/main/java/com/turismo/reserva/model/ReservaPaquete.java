package com.turismo.reserva.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class ReservaPaquete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "paquete_id")
    private PaqueteTuristico paquete;

    private LocalDate fechaReserva;
    private Double monto;
    private String estado;

    private Long facturaId;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public PaqueteTuristico getPaquete() { return paquete; }
    public void setPaquete(PaqueteTuristico paquete) { this.paquete = paquete; }
    public LocalDate getFechaReserva() { return fechaReserva; }
    public void setFechaReserva(LocalDate fechaReserva) { this.fechaReserva = fechaReserva; }
    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Long getFacturaId() { return facturaId; }
    public void setFacturaId(Long facturaId) { this.facturaId = facturaId; }
} 