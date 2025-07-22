package com.turismo.reserva.graphql;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.reserva.model.Cliente;
import com.turismo.reserva.model.Reserva;
import com.turismo.reserva.service.ClienteService;
import com.turismo.reserva.service.NotificacionService;
import com.turismo.reserva.service.ReservaService;
import com.turismo.usuario.model.Usuario;
import com.turismo.usuario.service.UsuarioService;

@Controller
public class ReservaGraphQL {

    private final ReservaService reservaService;
    private final NotificacionService notificacionService;
    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public ReservaGraphQL(ReservaService reservaService, NotificacionService notificacionService, ClienteService clienteService, UsuarioService usuarioService) {
        this.reservaService = reservaService;
        this.notificacionService = notificacionService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    @QueryMapping
    public List<Reserva> reservas() {
        return reservaService.findAll();
    }

    @QueryMapping
    public Reserva reservaPorId(@Argument Long id) {
        return reservaService.findById(id);
    }

    @MutationMapping
    public Reserva crearReserva(
        @Argument Long clienteId,
        @Argument String fecha,
        @Argument Long destinoId,
        @Argument Double monto
    ) {
        Reserva reserva = new Reserva();
        reserva.setClienteId(clienteId);
        reserva.setDestinoId(destinoId);
        reserva.setMonto(monto);
        reserva.setFecha(java.time.LocalDate.parse(fecha));
        Reserva saved = reservaService.save(reserva);
        // Enviar notificación push al usuario correspondiente
        System.out.println("DEBUG: Iniciando proceso de notificación para reserva: " + saved.getId());
        Cliente cliente = clienteService.findById(clienteId);
        if (cliente != null && cliente.getUsuarioId() != null) {
            System.out.println("DEBUG: Cliente encontrado con ID: " + clienteId + " y UsuarioID: " + cliente.getUsuarioId());
            Usuario usuario = usuarioService.findById(cliente.getUsuarioId()).orElse(null);
            if (usuario != null && usuario.getFcmToken() != null && !usuario.getFcmToken().isEmpty()) {
                System.out.println("DEBUG: Usuario encontrado con FCM Token: " + usuario.getFcmToken());
                System.out.println("DEBUG: Enviando notificación...");
                notificacionService.enviarNotificacion(
                    usuario.getFcmToken(),
                    "Reserva creada",
                    "Tu reserva ha sido registrada exitosamente."
                );
                System.out.println("DEBUG: Notificación enviada (sin errores en el llamado).");
            } else {
                if (usuario == null) {
                    System.out.println("DEBUG ERROR: No se encontró el usuario con ID: " + cliente.getUsuarioId());
                } else {
                    System.out.println("DEBUG ERROR: El usuario no tiene un FCM Token válido. Token: " + usuario.getFcmToken());
                }
            }
        } else {
            if (cliente == null) {
                System.out.println("DEBUG ERROR: No se encontró el cliente con ID: " + clienteId);
            } else {
                System.out.println("DEBUG ERROR: El cliente no tiene un usuario_id asociado.");
            }
        }
        return saved;
    }

    @MutationMapping
    public Reserva actualizarReserva(
        @Argument Long id,
        @Argument Long clienteId,
        @Argument String fecha,
        @Argument Long destinoId,
        @Argument Double monto
    ) {
        Reserva reserva = reservaService.findById(id);
        if (reserva == null) return null;
        reserva.setClienteId(clienteId);
        reserva.setDestinoId(destinoId);
        reserva.setMonto(monto);
        reserva.setFecha(java.time.LocalDate.parse(fecha));
        return reservaService.save(reserva);
    }

    @MutationMapping
    public Boolean eliminarReserva(@Argument Long id) {
        reservaService.deleteById(id);
        return true;
    }

    @QueryMapping
    public int totalReservasPorCliente(@Argument String clienteNombre) {
        return reservaService.countByClienteNombre(clienteNombre);
    }

    @QueryMapping
    public double ingresosPorDestino(@Argument String destino) {
        return reservaService.sumMontoByDestinoNombre(destino);
    }

    @QueryMapping
    public int reservasPorMes(@Argument int year, @Argument int month) {
        return reservaService.countReservasPorMes(year, month);
    }
}
