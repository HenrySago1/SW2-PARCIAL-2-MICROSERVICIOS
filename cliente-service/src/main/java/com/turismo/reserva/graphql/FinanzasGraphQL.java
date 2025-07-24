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
import com.turismo.reserva.service.ReservaPaqueteService;

@Controller
public class FinanzasGraphQL {
    private final FacturaService facturaService;
    private final PagoService pagoService;
    private final TransaccionService transaccionService;
    private final ReservaPaqueteService reservaPaqueteService;

    public FinanzasGraphQL(FacturaService facturaService, PagoService pagoService, TransaccionService transaccionService, ReservaPaqueteService reservaPaqueteService) {
        this.facturaService = facturaService;
        this.pagoService = pagoService;
        this.transaccionService = transaccionService;
        this.reservaPaqueteService = reservaPaqueteService;
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
        Pago savedPago = pagoService.save(p);
        // Actualizar estado de factura y reserva si corresponde
        Factura factura = facturaService.findById(facturaId);
        double totalPagado = pagoService.findByFacturaId(facturaId).stream().mapToDouble(Pago::getMonto).sum();
        if (factura != null && totalPagado >= factura.getMontoTotal()) {
            factura.setEstado("PAGADO");
            facturaService.save(factura);
            reservaPaqueteService.actualizarEstadoPorFacturaId(facturaId, "PAGADO");
        }
        return savedPago;
    }

    @MutationMapping
    public Pago registrarPagoCompleto(@Argument Long facturaId, @Argument Double monto, @Argument String metodo, @Argument String fecha) {
        Factura factura = facturaService.findById(facturaId);
        if (factura == null) throw new RuntimeException("Factura no encontrada");

        Pago pago = new Pago();
        pago.setFacturaId(facturaId);
        pago.setMonto(monto);
        pago.setMetodo(metodo);
        pago.setEstado("COMPLETADO");
        if (fecha != null) {
            pago.setFecha(java.time.LocalDate.parse(fecha));
        }

        Pago savedPago = pagoService.save(pago);

        // Si el monto pagado cubre el total, actualiza la factura y la reserva
        double totalPagado = pagoService.findByFacturaId(facturaId).stream().mapToDouble(Pago::getMonto).sum();
        if (totalPagado >= factura.getMontoTotal()) {
            factura.setEstado("PAGADO");
            facturaService.save(factura);
            reservaPaqueteService.actualizarEstadoPorFacturaId(facturaId, "PAGADO");
        }
        return savedPago;
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