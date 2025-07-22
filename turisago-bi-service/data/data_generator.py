import random
import json
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from config.database import postgres_engine, Base
from models.kpi_models import KPI, DataPoint, BIReport

def generate_sample_data():
    """Generar datos de prueba para el módulo de BI"""
    
    # Importar modelos antes de crear tablas
    Base.metadata.create_all(postgres_engine)
    
    # Rango de fechas: enero 2022 a junio 2025
    start_year, start_month = 2022, 1
    end_year, end_month = 2025, 6
    kpi_names = [
        ("Ocupación Hotelera", "%", lambda: round(random.uniform(60, 95), 2)),
        ("Ingresos Mensuales", "Bs", lambda: round(random.uniform(30000, 70000), 2)),
        ("Satisfacción Cliente", "/5", lambda: round(random.uniform(3.5, 5.0), 2)),
    ]
    kpi_data = []
    for year in range(start_year, end_year + 1):
        for month in range(1, 13):
            if year == end_year and month > end_month:
                break
            for name, unit, value_fn in kpi_names:
                value = value_fn()
                trend = random.choice(["up", "down", "stable"])
                # Simula datos mensuales para el gráfico
                labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                values = [value_fn() for _ in range(12)]
                data_json = json.dumps({"labels": labels, "values": values})
                timestamp = datetime(year, month, 15)  # Día 15 de cada mes
                kpi_data.append({
                    "name": name,
                    "value": value,
                    "unit": unit,
                    "trend": trend,
                    "data_json": data_json,
                    "timestamp": timestamp
                })
    # Generar datos de puntos históricos (opcional, igual que antes)
    data_points = []
    start_date = datetime(2022, 1, 1)
    end_date = datetime(2025, 6, 30)
    total_days = (end_date - start_date).days
    for i in range(5000):
        kpi_name = random.choice([k[0] for k in kpi_names])
        value = [k for k in kpi_names if k[0] == kpi_name][0][2]()
        days_offset = random.randint(0, total_days)
        date = start_date + timedelta(days=days_offset)
        data_points.append({
            "kpi_name": kpi_name,
            "value": value,
            "label": date.strftime("%Y-%m-%d"),
            "timestamp": date
        })
    # Insertar datos en PostgreSQL
    with postgres_engine.connect() as conn:
        # Limpiar tabla kpis antes de insertar
        conn.execute(text("DELETE FROM kpis"))
        for kpi in kpi_data:
            conn.execute(text("""
                INSERT INTO kpis (name, value, unit, trend, data_json, timestamp)
                VALUES (:name, :value, :unit, :trend, :data_json, :timestamp)
            """), kpi)
        # Insertar puntos de datos
        for point in data_points:
            conn.execute(text("""
                INSERT INTO data_points (kpi_name, value, label, timestamp)
                VALUES (:kpi_name, :value, :label, :timestamp)
            """), point)
        conn.commit()
    return len(kpi_data) + len(data_points)

def generate_bi_reports():
    """Generar reportes de BI"""
    
    reports = [
        {
            "report_name": "Análisis de Ocupación",
            "report_type": "ocupacion",
            "data_json": json.dumps({
                "total_analizado": 2500,
                "promedio_ocupacion": 78.5,
                "tendencia": "ascendente",
                "picos": ["Abril", "Mayo"],
                "valles": ["Marzo"]
            })
        },
        {
            "report_name": "Análisis de Ingresos",
            "report_type": "ingresos",
            "data_json": json.dumps({
                "total_ingresos": 285000,
                "promedio_mensual": 47500,
                "crecimiento": 12.5,
                "mejor_mes": "Abril",
                "peor_mes": "Marzo"
            })
        },
        {
            "report_name": "Análisis de Satisfacción",
            "report_type": "satisfaccion",
            "data_json": json.dumps({
                "promedio_satisfaccion": 4.4,
                "clientes_satisfechos": 85,
                "tendencia": "estable",
                "mejor_aspecto": "Atención al cliente",
                "peor_aspecto": "Tiempo de respuesta"
            })
        }
    ]
    
    with postgres_engine.connect() as conn:
        for report in reports:
            conn.execute(text("""
                INSERT INTO bi_reports (report_name, report_type, data_json, created_at, updated_at)
                VALUES (:report_name, :report_type, :data_json, :created_at, :updated_at)
            """), {**report, "created_at": datetime.now(), "updated_at": datetime.now()})
        
        conn.commit()
    
    return len(reports) 