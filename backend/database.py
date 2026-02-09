# database.py - Conexión a PostgreSQL
# =====================================
# Este archivo maneja toda la comunicación con tu base de datos

import psycopg2  # El driver que instalamos para "hablar" con PostgreSQL
from psycopg2.extras import RealDictCursor  # Esto hace que los resultados vengan como diccionarios

# Configuración de la base de datos
# En un proyecto real, estos datos irían en variables de entorno (.env)
# Por ahora los ponemos aquí para que entiendas cómo funciona
DB_CONFIG = {
    "host": "localhost",       # Dónde está PostgreSQL (tu computadora)
    "database": "ayuda_montemorelos",  # Nombre de tu base de datos
    "user": "postgres",        # Usuario por defecto de PostgreSQL
    "password": "admin",       # Tu contraseña
    "port": "5432"             # Puerto por defecto de PostgreSQL
}


def get_connection():
    """
    Crea y retorna una conexión a la base de datos.

    ¿Por qué una función?
    - Cada vez que necesites hablar con la BD, llamas a esta función
    - Te da una conexión "fresca"
    - Centraliza la configuración en un solo lugar
    """
    connection = psycopg2.connect(**DB_CONFIG)
    # **DB_CONFIG "desempaqueta" el diccionario, es como escribir:
    # psycopg2.connect(host="localhost", database="ayuda_montemorelos", ...)
    return connection


def test_connection():
    """
    Función para probar si la conexión funciona.
    Útil para debugging.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Ejecutamos una consulta simple
        cursor.execute("SELECT version();")
        version = cursor.fetchone()

        print(f"Conexión exitosa!")
        print(f"PostgreSQL version: {version[0]}")

        # Siempre cerramos cursor y conexión cuando terminamos
        cursor.close()
        conn.close()
        return True

    except Exception as error:
        print(f"Error al conectar: {error}")
        return False


# Si ejecutas este archivo directamente (python database.py),
# se ejecuta la prueba de conexión
if __name__ == "__main__":
    test_connection()
