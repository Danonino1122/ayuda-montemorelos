import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = "postgresql://ayuda_montemorelos_user:CYP3zEjGWa7YE4gRT6XcOw4LWwCP2Dqc@dpg-d64tl97pm1nc738va7bg-a.oregon-postgres.render.com/ayuda_montemorelos"

def ver_tablas():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Ver usuarios
        print("=" * 50)
        print("👤 USUARIOS")
        print("=" * 50)
        cursor.execute("SELECT id, nombre_completo, email, rol, fecha_registro FROM usuarios")
        usuarios = cursor.fetchall()
        if usuarios:
            for u in usuarios:
                print(f"  ID: {u['id']} | {u['nombre_completo']} | {u['email']} | {u['rol']}")
        else:
            print("  (No hay usuarios)")

        # Ver necesidades
        print("\n" + "=" * 50)
        print("📍 NECESIDADES")
        print("=" * 50)
        cursor.execute("SELECT id, titulo, categoria, estado, usuario_id FROM necesidades")
        necesidades = cursor.fetchall()
        if necesidades:
            for n in necesidades:
                print(f"  ID: {n['id']} | {n['titulo']} | {n['categoria']} | {n['estado']}")
        else:
            print("  (No hay necesidades)")

        # Ver donaciones
        print("\n" + "=" * 50)
        print("🤝 DONACIONES")
        print("=" * 50)
        cursor.execute("SELECT id, necesidad_id, donante_id, mensaje_donante FROM donaciones")
        donaciones = cursor.fetchall()
        if donaciones:
            for d in donaciones:
                print(f"  ID: {d['id']} | Necesidad: {d['necesidad_id']} | Donante: {d['donante_id']}")
        else:
            print("  (No hay donaciones)")

        print("\n✅ Consulta completada!")
        
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    ver_tablas()