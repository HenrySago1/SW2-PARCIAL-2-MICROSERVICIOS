package com.turismo.reserva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"com.turismo.reserva", "com.turismo.usuario", "com.turismo.alojamiento"})
@EntityScan({"com.turismo.reserva.model", "com.turismo.usuario.model", "com.turismo.alojamiento.model"})
@EnableJpaRepositories({"com.turismo.reserva.repository", "com.turismo.usuario.repository", "com.turismo.alojamiento.repository"})
public class ClienteServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClienteServiceApplication.class, args);
    }
} 