package com.turismo.usuario.service;

import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import jakarta.annotation.PostConstruct;

@Service
public class FirebaseNotificationService {

    private boolean initialized = false;

    @PostConstruct
    public void initialize() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                FileInputStream serviceAccount = new FileInputStream("src/main/resources/firebase/service-account.json");
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);
                initialized = true;
                System.out.println("FirebaseApp inicializado correctamente");
            } catch (IOException e) {
                System.err.println("Error al inicializar FirebaseApp: " + e.getMessage());
            }
        } else {
            initialized = true;
        }
    }

    public void sendNotification(String fcmToken, String title, String body) {
        if (!initialized) {
            System.err.println("FirebaseApp no está inicializado");
            return;
        }
        try {
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Notificación enviada, response: " + response);
        } catch (Exception e) {
            System.err.println("Error al enviar notificación: " + e.getMessage());
        }
    }
} 