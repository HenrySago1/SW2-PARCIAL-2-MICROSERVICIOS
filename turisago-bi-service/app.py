from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import json
from datetime import datetime
from sqlalchemy import text

from config.database import get_postgres_session, postgres_engine
from models.kpi_models import KPI, DataPoint, BIReport, Base
from data.data_generator import generate_sample_data

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar dashboard estático
app.mount("/dashboard", StaticFiles(directory="dashboard", html=True), name="dashboard")

# Endpoint para servir el dashboard principal (index.html)
@app.get("/dashboard", include_in_schema=False)
def serve_dashboard():
    return FileResponse("dashboard/index.html")

# Endpoint para generar datos de prueba
@app.post("/api/data/generate")
def generate_data():
    count = generate_sample_data()
    return {"message": f"{count} registros generados"}

# Endpoint para obtener estadísticas generales
@app.get("/api/data/stats")
def get_stats():
    session = get_postgres_session()
    try:
        kpi_count = session.query(KPI).count()
        data_point_count = session.query(DataPoint).count()
        report_count = session.query(BIReport).count()
        return {
            "kpis": kpi_count,
            "data_points": data_point_count,
            "reports": report_count
        }
    finally:
        session.close()

# Endpoint para obtener todos los KPI
@app.get("/api/kpi/all")
def get_all_kpis(year: int = Query(None), month: int = Query(None)):
    session = get_postgres_session()
    try:
        query = session.query(KPI)
        # Filtro por año y mes si se proveen
        if year:
            query = query.filter(text("EXTRACT(YEAR FROM timestamp) = :year")).params(year=year)
        if month:
            query = query.filter(text("EXTRACT(MONTH FROM timestamp) = :month")).params(month=month)
        kpis = query.all()
        return [
            {
                "id": k.id,
                "name": k.name,
                "value": k.value,
                "unit": k.unit,
                "trend": k.trend,
                "timestamp": k.timestamp,
                "data_json": json.loads(k.__dict__["data_json"]) if k.__dict__["data_json"] else None
            }
            for k in kpis
        ]
    finally:
        session.close()

# Endpoints individuales para cada KPI
@app.get("/api/kpi/ocupacion")
def get_ocupacion():
    session = get_postgres_session()
    try:
        kpi = session.query(KPI).filter(KPI.name == "Ocupación Hotelera").order_by(KPI.timestamp.desc()).first()
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI no encontrado")
        return {
            "id": kpi.id,
            "name": kpi.name,
            "value": kpi.value,
            "unit": kpi.unit,
            "trend": kpi.trend,
            "timestamp": kpi.timestamp,
            "data_json": json.loads(kpi.__dict__["data_json"]) if kpi.__dict__["data_json"] else None
        }
    finally:
        session.close()

@app.get("/api/kpi/ingresos")
def get_ingresos():
    session = get_postgres_session()
    try:
        kpi = session.query(KPI).filter(KPI.name == "Ingresos Mensuales").order_by(KPI.timestamp.desc()).first()
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI no encontrado")
        return {
            "id": kpi.id,
            "name": kpi.name,
            "value": kpi.value,
            "unit": kpi.unit,
            "trend": kpi.trend,
            "timestamp": kpi.timestamp,
            "data_json": json.loads(kpi.__dict__["data_json"]) if kpi.__dict__["data_json"] else None
        }
    finally:
        session.close()

@app.get("/api/kpi/satisfaccion")
def get_satisfaccion():
    session = get_postgres_session()
    try:
        kpi = session.query(KPI).filter(KPI.name == "Satisfacción Cliente").order_by(KPI.timestamp.desc()).first()
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI no encontrado")
        return {
            "id": kpi.id,
            "name": kpi.name,
            "value": kpi.value,
            "unit": kpi.unit,
            "trend": kpi.trend,
            "timestamp": kpi.timestamp,
            "data_json": json.loads(kpi.__dict__["data_json"]) if kpi.__dict__["data_json"] else None
        }
    finally:
        session.close()

# Endpoint para obtener puntos históricos de los KPI por año y mes
@app.get("/api/data/points")
def get_data_points(year: int = Query(None), month: int = Query(None)):
    session = get_postgres_session()
    try:
        query = session.query(DataPoint)
        if year:
            query = query.filter(text("EXTRACT(YEAR FROM timestamp) = :year")).params(year=year)
        if month:
            query = query.filter(text("EXTRACT(MONTH FROM timestamp) = :month")).params(month=month)
        points = query.all()
        # Devolver un array plano
        return [
            {
                "id": point.id,
                "kpi_name": point.kpi_name,
                "value": point.value,
                "label": point.label,
                "timestamp": point.timestamp
            }
            for point in points
        ]
    finally:
        session.close()