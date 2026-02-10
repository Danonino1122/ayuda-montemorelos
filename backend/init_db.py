import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Usa la URL de Render aquí temporalmente para crear las tablas
DATABASE_URL = "postgresql://ayuda_montemorelos_user:CYP3zEjGWa7YE4gRT6XcOw4LWwCP2Dqc@dpg-d64tl97pm1nc738va7bg-a.oregon-postgres.render.com/ayuda_montemorelos"

def crear_tablas():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Crear tabla usuarios
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre_completo VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                telefono VARCHAR(20),
                rol VARCHAR(20) DEFAULT 'donante',
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Crear tabla necesidades
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS necesidades (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id),
                titulo VARCHAR(200) NOT NULL,
                descripcion TEXT,
                categoria VARCHAR(50),
                latitud DECIMAL(10, 8),
                longitud DECIMAL(11, 8),
                direccion_aproximada VARCHAR(255),
                estado VARCHAR(20) DEFAULT 'abierta',
                fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Crear tabla donaciones
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS donaciones (
                id SERIAL PRIMARY KEY,
                necesidad_id INTEGER REFERENCES necesidades(id),
                donante_id INTEGER REFERENCES usuarios(id),
                mensaje_donante TEXT,
                fecha_compromiso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        print("✅ Tablas creadas exitosamente!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    crear_tablas()