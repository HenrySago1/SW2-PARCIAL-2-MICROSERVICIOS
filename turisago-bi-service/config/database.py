import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# MySQL Configuration (datos principales)
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'turisago')

# PostgreSQL Configuration (BI)
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = os.getenv('POSTGRES_PORT', '5432')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', '123456')
POSTGRES_DATABASE = os.getenv('POSTGRES_DATABASE', 'turisago_bi')

# MySQL Engine
mysql_url = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
mysql_engine = create_engine(mysql_url, pool_pre_ping=True)

# PostgreSQL Engine
postgres_url = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DATABASE}"
postgres_engine = create_engine(postgres_url, pool_pre_ping=True)

# Sessions
MySQLSession = sessionmaker(bind=mysql_engine)
PostgresSession = sessionmaker(bind=postgres_engine)

# Base for models
Base = declarative_base()

def get_mysql_session():
    return MySQLSession()

def get_postgres_session():
    return PostgresSession() 