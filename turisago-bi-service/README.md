# TURISAGO BI Service

## Microservicio de Inteligencia de Negocios

Este módulo implementa un sistema de Business Intelligence (BI) para TURISAGO, cumpliendo con los requerimientos del examen parcial.

### 🎯 Características

- ✅ **3 KPI implementados** (Ocupación, Ingresos, Satisfacción)
- ✅ **2000+ datos de prueba** generados automáticamente
- ✅ **Dashboard interactivo** con gráficos en tiempo real
- ✅ **API REST** para integración con otros sistemas
- ✅ **Base de datos PostgreSQL** para análisis de datos
- ✅ **Arquitectura de microservicios** independiente

### 📊 KPI Implementados

1. **Ocupación Hotelera** - Porcentaje de ocupación mensual
2. **Ingresos Mensuales** - Ingresos totales por período
3. **Satisfacción Cliente** - Calificación promedio de clientes

### 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   BI Service    │    │   PostgreSQL    │
│   Dashboard     │◄──►│   Python +      │◄──►│   (Datos BI)    │
│   HTML + JS     │    │   FastAPI       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   MySQL         │
                       │   (Datos        │
                       │   principales)  │
                       └─────────────────┘
```

### 🚀 Instalación y Configuración

#### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

#### 2. Configurar base de datos PostgreSQL

Crear la base de datos `turisago_bi` en PostgreSQL:

```sql
CREATE DATABASE turisago_bi;
```

#### 3. Configurar variables de entorno

Crear archivo `.env`:

```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DATABASE=turisago_bi

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

#### 4. Ejecutar el servicio

```bash
python app.py
```

### 📈 Endpoints de la API

#### KPI Endpoints

- `GET /api/kpi/ocupacion` - Obtener KPI de ocupación
- `GET /api/kpi/ingresos` - Obtener KPI de ingresos
- `GET /api/kpi/satisfaccion` - Obtener KPI de satisfacción
- `GET /api/kpi/all` - Obtener todos los KPI

#### Data Endpoints

- `POST /api/data/generate` - Generar datos de prueba
- `GET /api/data/stats` - Obtener estadísticas generales

#### Dashboard

- `GET /dashboard` - Dashboard interactivo

### 📊 Dashboard

El dashboard incluye:

- **KPI Cards** - Valores actuales con tendencias
- **Gráficos interactivos** - Barras, líneas y dispersión
- **Estadísticas generales** - Resumen de datos
- **Auto-refresh** - Actualización automática cada 30 segundos

### 🔧 Generación de Datos

El sistema genera automáticamente:

- **2000+ registros** de datos históricos
- **3 KPI principales** con datos realistas
- **Reportes de BI** con análisis detallados

### 🎨 Tecnologías Utilizadas

- **Backend**: Python + FastAPI
- **Base de Datos**: PostgreSQL
- **Visualización**: Plotly + Chart.js
- **Frontend**: HTML + CSS + JavaScript
- **Análisis**: Pandas + NumPy

### 📋 Cumplimiento de Requisitos

#### ✅ Punto 2: Inteligencia de Negocios con Python

- ✅ **Dashboard basado en 3 KPI** implementados
- ✅ **2000+ datos poblados** generados automáticamente
- ✅ **Implementado en Python** con FastAPI
- ✅ **Análisis de datos** con Pandas y NumPy
- ✅ **Visualización interactiva** con Plotly

### 🔗 Integración con Sistema Principal

El módulo BI se integra con el sistema principal de TURISAGO:

- **Lectura de datos** desde MySQL principal
- **Análisis independiente** en PostgreSQL
- **API REST** para comunicación
- **Dashboard accesible** desde el frontend principal

### 📝 Uso

1. **Iniciar el servicio**: `python app.py`
2. **Acceder al dashboard**: `http://localhost:8000/dashboard`
3. **Generar datos**: `POST http://localhost:8000/api/data/generate`
4. **Consultar KPI**: `GET http://localhost:8000/api/kpi/all`

### 🎯 Próximos Pasos

- [ ] Integración con app móvil
- [ ] Servicios de IA (NLP, ML)
- [ ] Despliegue en nube
- [ ] Microservicios adicionales

---

**Desarrollado para el 2do Examen Parcial - Software para Turismo** 