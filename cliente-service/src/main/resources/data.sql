-- Script de inicialización para TURISAGO
-- Este script se ejecutará automáticamente al iniciar la aplicación

-- Insertar usuarios principales
INSERT IGNORE INTO usuario (nombre, email, password, rol, activo) VALUES
('Admin Principal', 'admin@turisago.com', 'admin123', 'ADMIN', true),
('Operador Test', 'operador@turisago.com', 'oper123', 'OPERADOR', true),
('Cliente Test', 'cliente@turisago.com', 'cliente123', 'CLIENTE', true); 