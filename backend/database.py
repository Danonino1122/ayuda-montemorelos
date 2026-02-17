# database.py - Conexión a PostgreSQL con Connection Pool
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Obtener la URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

# Pool de conexiones (se crean al iniciar el servidor y se reutilizan)
if DATABASE_URL:
    connection_pool = pool.SimpleConnectionPool(
        minconn=1,
        maxconn=10,
        dsn=DATABASE_URL
    )
else:
    connection_pool = pool.SimpleConnectionPool(
        minconn=1,
        maxconn=10,
        host="localhost",
        database="ayuda_montemorelos",
        user="postgres",
        password="admin",
        port="5432"
    )

def get_connection():
    """
    Obtiene una conexión del pool (mucho más rápido que crear una nueva).
    """
    return connection_pool.getconn()

def release_connection(conn):
    """
    Devuelve la conexión al pool para que se reutilice.
    """
    connection_pool.putconn(conn)


def test_connection():
    """
    Función para probar si la conexión funciona.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"Conexión exitosa!")
        print(f"PostgreSQL version: {version[0]}")
        cursor.close()
        release_connection(conn)
        return True
    except Exception as error:
        print(f"Error al conectar: {error}")
        return False


if __name__ == "__main__":
    test_connection()
