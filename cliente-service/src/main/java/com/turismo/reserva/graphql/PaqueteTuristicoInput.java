package com.turismo.reserva.graphql;

public class PaqueteTuristicoInput {
    public String nombre;
    public String descripcion;
    public Double precio;
    public String fechaInicio;
    public String fechaFin;
    public Integer cupos;
    public Long destinoId;
    public String serviciosIncluidos;
    public Boolean activo;

    // Getters y setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }
    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }
    public Integer getCupos() { return cupos; }
    public void setCupos(Integer cupos) { this.cupos = cupos; }
    public Long getDestinoId() { return destinoId; }
    public void setDestinoId(Long destinoId) { this.destinoId = destinoId; }
    public String getServiciosIncluidos() { return serviciosIncluidos; }
    public void setServiciosIncluidos(String serviciosIncluidos) { this.serviciosIncluidos = serviciosIncluidos; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
} 