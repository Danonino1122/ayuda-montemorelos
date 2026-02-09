# database.py - Conexión a PostgreSQL
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Obtener la URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

def get_connection():
    """
    Crea y retorna una conexión a la base de datos.
    """
    if DATABASE_URL:
        # Para producción
        connection = psycopg2.connect(DATABASE_URL)
    else:
        # Para desarrollo local (fallback)
        connection = psycopg2.connect(
            host="localhost",
            database="ayuda_montemorelos",
            user="postgres",
            password="admin",
            port="5432"
        )
    return connection


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
        conn.close()
        return True
    except Exception as error:
        print(f"Error al conectar: {error}")
        return False


if __name__ == "__main__":
    test_connection()
