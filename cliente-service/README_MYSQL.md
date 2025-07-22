# Configuración de MySQL para TURISAGO

## Requisitos Previos

1. **MySQL Server** instalado y ejecutándose
2. **Java 17** o superior
3. **Maven** instalado

## Instalación de MySQL

### Windows:
1. Descargar MySQL Community Server desde: https://dev.mysql.com/downloads/mysql/
2. Instalar con configuración por defecto
3. Establecer contraseña root como: `root`

### macOS:
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Configuración de la Base de Datos

### 1. Conectar a MySQL:
```bash
mysql -u root -p
```

### 2. Crear la base de datos (opcional, se crea automáticamente):
```sql
CREATE DATABASE IF NOT EXISTS turisago;
```

### 3. Verificar que el usuario root tenga permisos:
```sql
GRANT ALL PRIVILEGES ON turisago.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Ejecutar la Aplicación

### Primera vez (crear tablas y datos iniciales):
```bash
mvn spring-boot:run
```

### Desarrollo (preservar datos):
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

## Credenciales de Prueba

### Usuarios creados automáticamente:
- **Admin:** admin@turisago.com / admin123
- **Operador:** operador@turisago.com / oper123  
- **Cliente:** cliente@turisago.com / cliente123

## Verificar la Conexión

### 1. Verificar que MySQL esté ejecutándose:
```bash
mysql -u root -p -e "SELECT VERSION();"
```

### 2. Verificar que la aplicación se conecte:
- Ir a: http://localhost:8081/graphql
- Probar la query: `{ usuarios { id nombre email rol } }`

## Solución de Problemas

### Error de conexión:
1. Verificar que MySQL esté ejecutándose
2. Verificar credenciales en `application.properties`
3. Verificar que el puerto 3306 esté disponible

### Error de permisos:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
```

### Reiniciar MySQL:
```bash
# Windows
net stop mysql
net start mysql

# macOS
brew services restart mysql

# Linux
sudo systemctl restart mysql
``` 