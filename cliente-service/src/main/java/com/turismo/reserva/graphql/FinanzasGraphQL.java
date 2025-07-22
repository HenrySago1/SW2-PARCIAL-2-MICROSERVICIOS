package com.turismo.reserva.graphql;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.reserva.model.Factura;
import com.turismo.reserva.model.Pago;
import com.turismo.reserva.model.Transaccion;
import com.turismo.reserva.service.FacturaService;
import com.turismo.reserva.service.PagoService;
import com.turismo.reserva.service.TransaccionService;

@Controller
public class FinanzasGraphQL {
    private final FacturaService facturaService;
    private final PagoService pagoService;
    private final TransaccionService transaccionService;

    public FinanzasGraphQL(FacturaService facturaService, PagoService pagoService, TransaccionService transaccionService) {
        this.facturaService = facturaService;
        this.pagoService = pagoService;
        this.transaccionService = transaccionService;
    }

    // Queries
    @QueryMapping
    public List<Factura> facturas() { return facturaService.findAll(); }

    @QueryMapping
    public List<Pago> pagos() { return pagoService.findAll(); }

    @QueryMapping
    public List<Transaccion> transacciones() { return transaccionService.findAll(); }

    @QueryMapping
    public List<Factura> facturasPorCliente(@Argument Long clienteId) {
        return facturaService.findByClienteId(clienteId);
    }

    // Mutations
    @MutationMapping
    public Factura crearFactura(@Argument Long clienteId, @Argument Double montoTotal, @Argument String metodoPago) {
        Factura f = new Factura();
        f.setClienteId(clienteId);
        f.setMontoTotal(montoTotal);
        f.setMetodoPago(metodoPago);
        f.setEstado("PENDIENTE");
        return facturaService.save(f);
    }

    @MutationMapping
    public Pago registrarPago(@Argument Long facturaId, @Argument Double monto, @Argument String metodo) {
        Pago p = new Pago();
        p.setFacturaId(facturaId);
        p.setMonto(monto);
        p.setMetodo(metodo);
        p.setEstado("COMPLETADO");
        return pagoService.save(p);
    }

    @MutationMapping
    public Transaccion crearTransaccion(@Argument String tipo, @Argument String fecha, @Argument Double monto, @Argument String descripcion, @Argument Long referenciaId, @Argument String referenciaTipo) {
        Transaccion t = new Transaccion();
        t.setTipo(tipo);
        t.setFecha(java.time.LocalDate.parse(fecha));
        t.setMonto(monto);
        t.setDescripcion(descripcion);
        t.setReferenciaId(referenciaId);
        t.setReferenciaTipo(referenciaTipo);
        return transaccionService.save(t);
    }

    @MutationMapping
    public Factura actualizarEstadoFactura(@Argument Long id, @Argument String estado) {
        Factura f = facturaService.findById(id);
        if (f == null) return null;
        f.setEstado(estado);
        return facturaService.save(f);
    }
} 