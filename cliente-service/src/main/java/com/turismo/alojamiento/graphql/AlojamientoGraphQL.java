package com.turismo.alojamiento.graphql;

import java.time.LocalDate;
import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.turismo.alojamiento.model.Alojamiento;
import com.turismo.alojamiento.model.Habitacion;
import com.turismo.alojamiento.model.ReservaAlojamiento;
import com.turismo.alojamiento.service.AlojamientoService;
import com.turismo.alojamiento.service.HabitacionService;
import com.turismo.alojamiento.service.ReservaAlojamientoService;
import com.turismo.reserva.model.Cliente;
import com.turismo.reserva.service.ClienteService;
import com.turismo.reserva.service.NotificacionService;
import com.turismo.usuario.model.Usuario;
import com.turismo.usuario.service.UsuarioService;

@Controller
public class AlojamientoGraphQL {
    private final AlojamientoService alojamientoService;
    private final HabitacionService habitacionService;
    private final ReservaAlojamientoService reservaAlojamientoService;
    private final NotificacionService notificacionService;
    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public AlojamientoGraphQL(AlojamientoService alojamientoService, HabitacionService habitacionService, 
                             ReservaAlojamientoService reservaAlojamientoService, NotificacionService notificacionService, ClienteService clienteService, UsuarioService usuarioService) {
        this.alojamientoService = alojamientoService;
        this.habitacionService = habitacionService;
        this.reservaAlojamientoService = reservaAlojamientoService;
        this.notificacionService = notificacionService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    // --- QUERIES ---
    @QueryMapping
    public List<Alojamiento> alojamientos() {
        return alojamientoService.findAll();
    }

    @QueryMapping
    public Alojamiento alojamientoPorId(@Argument Long id) {
        return alojamientoService.findById(id);
    }

    @QueryMapping
    public List<Habitacion> habitaciones(@Argument Long alojamientoId) {
        if (alojamientoId != null) {
            return habitacionService.findByAlojamientoId(alojamientoId);
        }
        return habitacionService.findAll();
    }

    @QueryMapping
    public Habitacion habitacionPorId(@Argument Long id) {
        return habitacionService.findById(id);
    }

    @QueryMapping
    public List<ReservaAlojamiento> reservasAlojamiento(@Argument Long clienteId) {
        if (clienteId != null) {
            return reservaAlojamientoService.findByClienteId(clienteId);
        }
        return reservaAlojamientoService.findAll();
    }

    @QueryMapping
    public ReservaAlojamiento reservaAlojamientoPorId(@Argument Long id) {
        return reservaAlojamientoService.findById(id);
    }

    // --- MUTATIONS ---
    @MutationMapping
    public Alojamiento crearAlojamiento(
            @Argument String nombre,
            @Argument String tipo,
            @Argument String descripcion,
            @Argument String ubicacion,
            @Argument String servicios,
            @Argument Boolean activo) {
        Alojamiento alojamiento = new Alojamiento();
        alojamiento.setNombre(nombre);
        alojamiento.setTipo(tipo);
        alojamiento.setDescripcion(descripcion);
        alojamiento.setUbicacion(ubicacion);
        alojamiento.setServicios(servicios);
        alojamiento.setActivo(activo);
        return alojamientoService.save(alojamiento);
    }

    @MutationMapping
    public Alojamiento actualizarAlojamiento(
            @Argument Long id,
            @Argument String nombre,
            @Argument String tipo,
            @Argument String descripcion,
            @Argument String ubicacion,
            @Argument String servicios,
            @Argument Boolean activo) {
        Alojamiento alojamiento = alojamientoService.findById(id);
        if (alojamiento == null) return null;
        alojamiento.setNombre(nombre);
        alojamiento.setTipo(tipo);
        alojamiento.setDescripcion(descripcion);
        alojamiento.setUbicacion(ubicacion);
        alojamiento.setServicios(servicios);
        alojamiento.setActivo(activo);
        return alojamientoService.save(alojamiento);
    }

    @MutationMapping
    public Boolean eliminarAlojamiento(@Argument Long id) {
        alojamientoService.deleteById(id);
        return true;
    }

    @MutationMapping
    public Habitacion crearHabitacion(
            @Argument Long alojamientoId,
            @Argument String nombre,
            @Argument String tipo,
            @Argument Integer capacidad,
            @Argument Double precioNoche,
            @Argument String descripcion,
            @Argument Boolean disponible) {
        Habitacion habitacion = new Habitacion();
        habitacion.setNombre(nombre);
        habitacion.setTipo(tipo);
        habitacion.setCapacidad(capacidad);
        habitacion.setPrecioNoche(precioNoche);
        habitacion.setDescripcion(descripcion);
        habitacion.setDisponible(disponible);
        // Relación con alojamiento
        Alojamiento alojamiento = alojamientoService.findById(alojamientoId);
        habitacion.setAlojamiento(alojamiento);
        return habitacionService.save(habitacion);
    }

    @MutationMapping
    public Habitacion actualizarHabitacion(
            @Argument Long id,
            @Argument Long alojamientoId,
            @Argument String nombre,
            @Argument String tipo,
            @Argument Integer capacidad,
            @Argument Double precioNoche,
            @Argument String descripcion,
            @Argument Boolean disponible) {
        Habitacion habitacion = habitacionService.findById(id);
        if (habitacion == null) return null;
        habitacion.setNombre(nombre);
        habitacion.setTipo(tipo);
        habitacion.setCapacidad(capacidad);
        habitacion.setPrecioNoche(precioNoche);
        habitacion.setDescripcion(descripcion);
        habitacion.setDisponible(disponible);
        // Relación con alojamiento
        Alojamiento alojamiento = alojamientoService.findById(alojamientoId);
        habitacion.setAlojamiento(alojamiento);
        return habitacionService.save(habitacion);
    }

    @MutationMapping
    public Boolean eliminarHabitacion(@Argument Long id) {
        habitacionService.deleteById(id);
        return true;
    }

    @MutationMapping
    public ReservaAlojamiento crearReservaAlojamiento(
            @Argument Long habitacionId,
            @Argument Long clienteId,
            @Argument String fechaInicio,
            @Argument String fechaFin,
            @Argument Double montoTotal,
            @Argument String estado) {
        ReservaAlojamiento reserva = new ReservaAlojamiento();
        reserva.setHabitacionId(habitacionId);
        reserva.setClienteId(clienteId);
        reserva.setFechaInicio(LocalDate.parse(fechaInicio));
        reserva.setFechaFin(LocalDate.parse(fechaFin));
        reserva.setMontoTotal(montoTotal);
        reserva.setEstado(estado);
        ReservaAlojamiento saved = reservaAlojamientoService.save(reserva);
        // Notificación push
        System.out.println("DEBUG: Intentando enviar notificación push al cliente desde crearReservaAlojamiento");
        Cliente cliente = clienteService.findById(clienteId);
        if (cliente != null && cliente.getUsuarioId() != null) {
            System.out.println("DEBUG: Cliente encontrado con ID: " + clienteId + " y UsuarioID: " + cliente.getUsuarioId());
            Usuario usuario = usuarioService.findById(cliente.getUsuarioId()).orElse(null);
            if (usuario != null && usuario.getFcmToken() != null && !usuario.getFcmToken().isEmpty()) {
                System.out.println("DEBUG: Usuario encontrado con FCM Token: " + usuario.getFcmToken());
                System.out.println("DEBUG: Enviando notificación...");
                notificacionService.enviarNotificacion(
                    usuario.getFcmToken(),
                    "Reserva de alojamiento creada",
                    "Tu reserva de alojamiento ha sido registrada exitosamente."
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
    public ReservaAlojamiento actualizarReservaAlojamiento(
            @Argument Long id,
            @Argument Long habitacionId,
            @Argument Long clienteId,
            @Argument String fechaInicio,
            @Argument String fechaFin,
            @Argument Double montoTotal,
            @Argument String estado) {
        ReservaAlojamiento reserva = reservaAlojamientoService.findById(id);
        if (reserva == null) return null;
        reserva.setHabitacionId(habitacionId);
        reserva.setClienteId(clienteId);
        reserva.setFechaInicio(LocalDate.parse(fechaInicio));
        reserva.setFechaFin(LocalDate.parse(fechaFin));
        reserva.setMontoTotal(montoTotal);
        reserva.setEstado(estado);
        return reservaAlojamientoService.save(reserva);
    }

    @MutationMapping
    public Boolean eliminarReservaAlojamiento(@Argument Long id) {
        reservaAlojamientoService.deleteById(id);
        return true;
    }
} 