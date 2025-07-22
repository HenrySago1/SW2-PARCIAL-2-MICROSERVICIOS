-- Script para inicializar la base de datos TURISAGO
-- Ejecutar este script en phpMyAdmin o en el cliente MySQL

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS turisago;

-- Usar la base de datos
USE turisago;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'OPERADOR', 'CLIENTE') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS cliente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    documento VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(255),
    email VARCHAR(255) NOT NULL
);

-- Crear tabla de destinos
CREATE TABLE IF NOT EXISTS destino (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255) NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    cupos INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear tabla de alojamientos
CREATE TABLE IF NOT EXISTS alojamiento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255) NOT NULL,
    servicios TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar datos de prueba
INSERT INTO usuario (nombre, email, password, rol, activo) VALUES
('Admin Principal', 'admin@turisago.com', 'admin123', 'ADMIN', true),
('Operador Test', 'operador@turisago.com', 'oper123', 'OPERADOR', true),
('Cliente Test', 'cliente@turisago.com', 'cliente123', 'CLIENTE', true);

INSERT INTO cliente (nombre, apellidos, documento, direccion, telefono, email) VALUES
('Juan', 'Pérez', '12345678', 'Av. Principal 123', '591-12345678', 'juan.perez@email.com'),
('María', 'González', '87654321', 'Calle Secundaria 456', '591-87654321', 'maria.gonzalez@email.com'),
('Carlos', 'López', '11223344', 'Plaza Central 789', '591-11223344', 'carlos.lopez@email.com');

INSERT INTO destino (nombre, descripcion, ubicacion, precio_base, cupos, activo) VALUES
('Copacabana', 'Hermoso lago Titicaca y la Virgen de Copacabana', 'Copacabana, La Paz', 1500.00, 50, true),
('Salar de Uyuni', 'El salar más grande del mundo', 'Uyuni, Potosí', 2500.00, 30, true),
('Tiwanaku', 'Sitio arqueológico preincaico', 'Tiwanaku, La Paz', 800.00, 40, true);

INSERT INTO alojamiento (nombre, tipo, descripcion, ubicacion, servicios, activo) VALUES
('Hotel Titicaca', 'Hotel', 'Hotel con vista al lago Titicaca', 'Copacabana, La Paz', 'WiFi, Restaurante, Estacionamiento', true),
('Hostal Uyuni', 'Hostal', 'Hostal cerca del salar', 'Uyuni, Potosí', 'WiFi, Desayuno incluido', true),
('Cabañas Tiwanaku', 'Cabaña', 'Cabañas rústicas cerca del sitio arqueológico', 'Tiwanaku, La Paz', 'Cocina equipada, Jardín', true);

-- Verificar que los datos se insertaron correctamente
SELECT 'Usuarios creados:' as info;
SELECT id, nombre, email, rol FROM usuario;

SELECT 'Clientes creados:' as info;
SELECT id, nombre, apellidos, email FROM cliente;

SELECT 'Destinos creados:' as info;
SELECT id, nombre, ubicacion, precio_base FROM destino;

SELECT 'Alojamientos creados:' as info;
SELECT id, nombre, tipo, ubicacion FROM alojamiento; 