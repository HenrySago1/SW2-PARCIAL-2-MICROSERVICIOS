-- Script de esquema para TURISAGO
-- Este script creará todas las tablas necesarias

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'OPERADOR', 'CLIENTE') NOT NULL,
    activo BOOLEAN DEFAULT true
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS cliente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de destinos
CREATE TABLE IF NOT EXISTS destino (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(200) NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    cupos INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de alojamientos
CREATE TABLE IF NOT EXISTS alojamiento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    descripcion TEXT,
    ubicacion VARCHAR(500),
    servicios TEXT,
    activo BOOLEAN DEFAULT true
);

-- Tabla de habitaciones
CREATE TABLE IF NOT EXISTS habitacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alojamiento_id BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    capacidad INT,
    precio_noche DECIMAL(10,2),
    descripcion TEXT,
    disponible BOOLEAN DEFAULT true,
    FOREIGN KEY (alojamiento_id) REFERENCES alojamiento(id)
);

-- Tabla de reservas de alojamiento
CREATE TABLE IF NOT EXISTS reserva_alojamiento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    habitacion_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    FOREIGN KEY (habitacion_id) REFERENCES habitacion(id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- Tabla de reservas (para destinos)
CREATE TABLE IF NOT EXISTS reserva (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    destino_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (destino_id) REFERENCES destino(id)
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS factura (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    cliente_id BIGINT NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    metodo_pago VARCHAR(100),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pago (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    factura_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    FOREIGN KEY (factura_id) REFERENCES factura(id)
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transaccion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    referencia_id BIGINT,
    referencia_tipo VARCHAR(100)
); 