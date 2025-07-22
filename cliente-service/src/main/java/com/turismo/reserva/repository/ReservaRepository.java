package com.turismo.reserva.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.turismo.reserva.model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByClienteId(Long clienteId);
    long countByClienteId(Long clienteId);
    List<Reserva> findByDestinoId(Long destinoId);
    
    @Query(value = "SELECT COUNT(*) FROM reserva r " +
                   "JOIN cliente c ON r.cliente_id = c.id " +
                   "WHERE CONCAT(c.nombre, ' ', COALESCE(c.apellidos, '')) LIKE %:clienteNombre%", 
           nativeQuery = true)
    int countByClienteNombre(@Param("clienteNombre") String clienteNombre);
    
    @Query(value = "SELECT COALESCE(SUM(r.monto), 0) FROM reserva r " +
                   "JOIN destino d ON r.destino_id = d.id " +
                   "WHERE LOWER(TRIM(d.nombre)) LIKE LOWER(CONCAT('%', TRIM(:destinoNombre), '%'))", 
           nativeQuery = true)
    double sumMontoByDestinoNombre(@Param("destinoNombre") String destinoNombre);
}

