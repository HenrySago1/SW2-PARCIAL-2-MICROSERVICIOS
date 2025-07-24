package com.turismo.reserva.graphql;

public class ReservaPaqueteInput {
    public Long clienteId;
    public Long paqueteId;
    public String fechaReserva;
    public Double monto;
    public String estado;

    // Getters y setters
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getPaqueteId() { return paqueteId; }
    public void setPaqueteId(Long paqueteId) { this.paqueteId = paqueteId; }
    public String getFechaReserva() { return fechaReserva; }
    public void setFechaReserva(String fechaReserva) { this.fechaReserva = fechaReserva; }
    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
} 