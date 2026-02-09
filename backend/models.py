from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UsuarioCreate(BaseModel):
    
    nombre_completo: str
    email: EmailStr
    password: str
    telefono: Optional[str] =None
    rol: str = "donante"

class UsuarioResponse(BaseModel):
    id : int
    nombre_completo : str
    email: EmailStr
    telefono: Optional[str] = None
    rol: str
    fecha_registro: datetime

class NecesidadCreate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    categoria: str
    latitud:Optional[float] = None
    longitud: Optional[float] = None
    direccion_aproximada: Optional[str] = None
    estado: str = "abierta"

class NecesidadResponse(BaseModel):
    id: int
    usuario_id: int
    titulo: str
    descripcion: Optional[str] = None
    categoria: str
    latitud:Optional[float] = None
    longitud: Optional[float] = None
    direccion_aproximada: Optional[str] = None
    estado: str = "abierta"
    fecha_publicacion: datetime

class DonacionCreate(BaseModel):
    necesidad_id:int
    mensaje_donante:Optional[str] =None

class DonacionResponse(BaseModel):
    id: int
    necesidad_id: int
    donante_id: int
    mensaje_donante:Optional[str] = None
    fecha_compromiso :datetime

    