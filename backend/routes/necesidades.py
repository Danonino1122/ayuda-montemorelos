from fastapi import APIRouter, HTTPException
from database import get_connection
from models import NecesidadCreate, NecesidadResponse
from psycopg2.extras import RealDictCursor

router = APIRouter()

@router.post("/")
def crear_necesidad(necesidad: NecesidadCreate, usuario_id:int):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        query =  """
            INSERT INTO necesidades(titulo, descripcion, categoria, latitud, longitud, direccion_aproximada, estado, usuario_id)
            VALUES(%s, %s, %s, %s, %s, %s, %s,%s)
            RETURNING * 
         """
        
        valores=(
            necesidad.titulo,
            necesidad.descripcion,
            necesidad.categoria,
            necesidad.latitud,
            necesidad.longitud,
            necesidad.direccion_aproximada,
            necesidad.estado,
            usuario_id
        )

        cursor.execute(query, valores)
        nueva_necesidad = cursor.fetchone()
        conn.commit()

        return nueva_necesidad
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

@router.get("/")
def obtenerNecesidades(usuario_id: int = None):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory = RealDictCursor)

    try:
        query="""
        SELECT N.*, COUNT(d.id) as total_donantes
        FROM necesidades n
        LEFT JOIN donaciones d ON n.id = d.necesidad_id
        GROUP BY n.id
        ORDER BY n.id DESC
    """
        cursor.execute(query)
        necesidades = cursor.fetchall()

        if usuario_id:
            cursor.execute("SELECT necesidad_id FROM donaciones WHERE donante_id = %s",(usuario_id,))
            donaciones_usuario= cursor.fetchall()
            necesidades_donadas ={d["necesidad_id"] for d in donaciones_usuario}

            for necesidad in necesidades:
                necesidad["ya_dono"] = necesidad["id"] in necesidades_donadas
        else:
            for necesidad in necesidades:
                necesidad["ya_dono"]= False
        
        return necesidades
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

# Obtener necesidades de un padrino específico
@router.get("/padrino/{usuario_id}")
def obtener_necesidades_padrino(usuario_id: int):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute("SELECT * FROM necesidades WHERE usuario_id = %s ORDER BY id DESC", (usuario_id,))
        necesidades = cursor.fetchall()
        return necesidades

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()


@router.get("/{necesidad_id}")
def obtener_necesidad(necesidad_id:int):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory = RealDictCursor)

    try:
        cursor.execute("SELECT * FROM necesidades WHERE id = %s", (necesidad_id,))
        necesidad = cursor.fetchone()
        return necesidad

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

# Editar una necesidad
@router.put("/{necesidad_id}")
def editar_necesidad(necesidad_id: int, necesidad: NecesidadCreate, usuario_id: int):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # Primero verificamos que la necesidad pertenece al usuario
        cursor.execute("SELECT usuario_id FROM necesidades WHERE id = %s", (necesidad_id,))
        resultado = cursor.fetchone()

        if not resultado:
            raise HTTPException(status_code=404, detail="Necesidad no encontrada")
        
        if resultado["usuario_id"] != usuario_id:
            raise HTTPException(status_code=403, detail="No tienes permiso para editar esta necesidad")

        # Si es el dueño, actualizamos
        query = """
            UPDATE necesidades 
            SET titulo = %s, descripcion = %s, categoria = %s, 
                latitud = %s, longitud = %s, direccion_aproximada = %s, estado = %s
            WHERE id = %s
            RETURNING *
        """
        valores = (
            necesidad.titulo,
            necesidad.descripcion,
            necesidad.categoria,
            necesidad.latitud,
            necesidad.longitud,
            necesidad.direccion_aproximada,
            necesidad.estado,
            necesidad_id
        )

        cursor.execute(query, valores)
        necesidad_actualizada = cursor.fetchone()
        conn.commit()

        return necesidad_actualizada

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()


@router.delete("/{necesidad_id}")
def eliminarNecesidad(necesidad_id: int, usuario_id: int):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory = RealDictCursor)

    try:
        cursor.execute("SELECT usuario_id FROM necesidades WHERE id = %s", (necesidad_id,))
        resultado= cursor.fetchone()


        if not resultado:
            raise HTTPException(status_code=404,detail="Necesidad no encontrada")

        if resultado["usuario_id"]!=usuario_id:
            raise HTTPException(status_code=403, detail="No tiene permiso para eliminar esta necesidad")
        
        cursor.execute("DELETE FROM donaciones WHERE necesidad_id = %s", (necesidad_id,))

        cursor.execute("DELETE FROM necesidades WHERE id = %s RETURNING *", (necesidad_id,))
        necesidad_eliminada = cursor.fetchone()
        conn.commit()

        return {"mensaje": "Necesidad eliminada exitosamente", "necesidad": necesidad_eliminada}
    
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()