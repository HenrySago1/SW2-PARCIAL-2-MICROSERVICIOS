package com.turismo.reserva.model;

import jakarta.persistence.*;

@Entity
public class PaqueteTuristico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private Double precio;
    private String fechaInicio;
    private String fechaFin;
    private Integer cupos;
    private Boolean activo;
    private String serviciosIncluidos;

    @ManyToOne
    @JoinColumn(name = "destino_id")
    private Destino destino;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public String getServiciosIncluidos() { return serviciosIncluidos; }
    public void setServiciosIncluidos(String serviciosIncluidos) { this.serviciosIncluidos = serviciosIncluidos; }
    public Destino getDestino() { return destino; }
    public void setDestino(Destino destino) { this.destino = destino; }
} 