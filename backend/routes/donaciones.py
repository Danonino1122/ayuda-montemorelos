from fastapi import APIRouter, HTTPException
from database import get_connection, release_connection
from models import DonacionCreate, DonacionResponse
from psycopg2.extras import RealDictCursor

router = APIRouter()

@router.post("/")
def crear_donacion(donacion: DonacionCreate, donante_id:int ):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            "SELECT * FROM donaciones WHERE necesidad_id = %s AND donante_id =%s",(donacion.necesidad_id, donante_id,)
        )
        donacion_existente = cursor.fetchone()

        if donacion_existente:
            raise HTTPException(
                status_code=400,
                detail="Ya ofreciste ayuda a esta necesidad"
            )

        query="""
            INSERT INTO donaciones(mensaje_donante, necesidad_id, donante_id)
            VALUES(%s, %s, %s)
            RETURNING *
        """

        valores=(
            donacion.mensaje_donante,
            donacion.necesidad_id,
            donante_id
        )

        cursor.execute(query, valores)
        donacion = cursor.fetchone()
        conn.commit()

        return donacion

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        release_connection(conn)

@router.get("/")
def obtenerDonaciones():
    conn = get_connection()
    cursor = conn.cursor(cursor_factory = RealDictCursor)

    try:
        cursor.execute("SELECT * FROM donaciones")
        donaciones = cursor.fetchall()
        return donaciones

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        release_connection(conn)

# Obtener donaciones de una necesidad específica (con info del donante)
@router.get("/necesidad/{necesidad_id}")
def obtener_donaciones_necesidad(necesidad_id: int):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # JOIN para traer también los datos del donante
        query = """
            SELECT d.*, u.nombre_completo, u.email, u.telefono
            FROM donaciones d
            JOIN usuarios u ON d.donante_id = u.id
            WHERE d.necesidad_id = %s
            ORDER BY d.id DESC
        """
        cursor.execute(query, (necesidad_id,))
        donaciones = cursor.fetchall()
        return donaciones

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        release_connection(conn)