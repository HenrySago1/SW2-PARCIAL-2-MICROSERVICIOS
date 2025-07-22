from config.database import postgres_engine, Base
from models.kpi_models import KPI, DataPoint, BIReport

if __name__ == "__main__":
    print("Creando tablas en la base de datos BI...")
    Base.metadata.create_all(postgres_engine)
    print("¡Tablas creadas correctamente!") 