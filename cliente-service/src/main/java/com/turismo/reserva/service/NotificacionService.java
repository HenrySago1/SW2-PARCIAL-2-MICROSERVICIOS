package com.turismo.reserva.service;

import java.io.FileInputStream;
import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Service
public class NotificacionService {
    private boolean initialized = false;

    @PostConstruct
    public void init() {
        if (!initialized) {
            try {
                FileInputStream serviceAccount = new FileInputStream("src/main/resources/firebase/turisagoapp-firebase-adminsdk-fbsvc-dba9493b00.json");
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(com.google.auth.oauth2.GoogleCredentials.fromStream(serviceAccount))
                        .build();
                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                }
                initialized = true;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void enviarNotificacion(String fcmToken, String titulo, String cuerpo) {
        if (!initialized) init();
        try {
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(titulo)
                            .setBody(cuerpo)
                            .build())
                    .build();
            FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
} 