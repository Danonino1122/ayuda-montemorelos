from fastapi import APIRouter, HTTPException
from database import get_connection
from models import UsuarioCreate, UsuarioResponse
from psycopg2.extras import RealDictCursor
from security import hashear_password, verificar_password

router = APIRouter()

@router.post("/registro")
def registrar_usuario(usuario: UsuarioCreate):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        query = """
            INSERT INTO usuarios(nombre_completo, email, password_hash, telefono, rol)
            VALUES(%s, %s, %s, %s, %s)
            RETURNING *
        """
        valores = (
            usuario.nombre_completo,
            usuario.email,
            hashear_password(usuario.password),
            usuario.telefono,
            usuario.rol
        )

        cursor.execute(query, valores)
        nuevo_usuario = cursor.fetchone()
        conn.commit()

        return nuevo_usuario

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    finally:
        cursor.close()
        conn.close()


@router.post("/login")
def login(email:str, password:str):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute("SELECT * FROM usuarios WHERE email = %s",(email,))
        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(status_code = 404, detail="Usuario no encontrado")
        
        if not verificar_password(password, usuario["password_hash"]):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        else:
            return usuario
        
    finally:
        cursor.close()
        conn.close()
        
        
