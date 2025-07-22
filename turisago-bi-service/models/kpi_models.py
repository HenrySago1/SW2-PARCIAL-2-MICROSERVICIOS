from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class KPI(Base):
    __tablename__ = 'kpis'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    trend = Column(String(20), nullable=False)
    timestamp = Column(DateTime, default=datetime.now)
    data_json = Column(Text)  # Para almacenar datos históricos en JSON

class DataPoint(Base):
    __tablename__ = 'data_points'
    
    id = Column(Integer, primary_key=True)
    kpi_name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    label = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

class BIReport(Base):
    __tablename__ = 'bi_reports'
    
    id = Column(Integer, primary_key=True)
    report_name = Column(String(100), nullable=False)
    report_type = Column(String(50), nullable=False)
    data_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now) 