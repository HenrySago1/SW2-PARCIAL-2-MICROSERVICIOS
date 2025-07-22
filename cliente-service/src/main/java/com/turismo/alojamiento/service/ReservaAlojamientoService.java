package com.turismo.alojamiento.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.turismo.alojamiento.model.ReservaAlojamiento;
import com.turismo.alojamiento.repository.ReservaAlojamientoRepository;
import com.turismo.usuario.repository.UsuarioRepository;
import com.turismo.usuario.service.FirebaseNotificationService;

@Service
public class ReservaAlojamientoService {
    private final ReservaAlojamientoRepository reservaAlojamientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final FirebaseNotificationService firebaseNotificationService;

    public ReservaAlojamientoService(ReservaAlojamientoRepository reservaAlojamientoRepository, UsuarioRepository usuarioRepository, FirebaseNotificationService firebaseNotificationService) {
        this.reservaAlojamientoRepository = reservaAlojamientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.firebaseNotificationService = firebaseNotificationService;
    }

    public List<ReservaAlojamiento> findAll() {
        try {
            System.out.println("=== DEBUG: ReservaAlojamientoService.findAll() iniciado ===");
            List<ReservaAlojamiento> reservas = reservaAlojamientoRepository.findAll();
            System.out.println("=== DEBUG: reservas encontradas: " + (reservas != null ? reservas.size() : "null") + " ===");
            if (reservas != null) {
                for (ReservaAlojamiento r : reservas) {
                    System.out.println("=== DEBUG: Reserva ID: " + r.getId() + ", Estado: " + r.getEstado() + " ===");
                }
            }
            return reservas != null ? reservas : List.of();
        } catch (Exception e) {
            System.err.println("=== ERROR al obtener reservas: " + e.getMessage() + " ===");
            e.printStackTrace();
            return List.of();
        }
    }

    public ReservaAlojamiento findById(Long id) {
        return reservaAlojamientoRepository.findById(id).orElse(null);
    }

    public List<ReservaAlojamiento> findByClienteId(Long clienteId) {
        return reservaAlojamientoRepository.findByClienteId(clienteId);
    }

    public List<ReservaAlojamiento> findByHabitacionId(Long habitacionId) {
        return reservaAlojamientoRepository.findByHabitacionId(habitacionId);
    }

    public ReservaAlojamiento save(ReservaAlojamiento reserva) {
        ReservaAlojamiento saved = reservaAlojamientoRepository.save(reserva);
        System.out.println("=== DEBUG: Intentando enviar notificación push al cliente ===");
        if (saved.getClienteId() != null) {
            usuarioRepository.findById(saved.getClienteId()).ifPresent(usuario -> {
                String token = usuario.getFcmToken();
                System.out.println("=== DEBUG: Token FCM del usuario: " + token);
                if (token != null && !token.isEmpty()) {
                    String title = "Reserva actualizada";
                    String body = "Tu reserva ha sido creada o actualizada. Estado: " + saved.getEstado();
                    System.out.println("=== DEBUG: Enviando notificación con título: " + title + ", body: " + body);
                    firebaseNotificationService.sendNotification(token, title, body);
                } else {
                    System.out.println("=== DEBUG: El usuario no tiene token FCM registrado ===");
                }
            });
        } else {
            System.out.println("=== DEBUG: La reserva no tiene clienteId ===");
        }
        return saved;
    }

    public void deleteById(Long id) {
        reservaAlojamientoRepository.deleteById(id);
    }
} 