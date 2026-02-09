from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import usuarios, necesidades, donaciones


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router, prefix ="/usuarios", tags=["Usuarios"])
app.include_router(necesidades.router, prefix="/necesidades", tags=["Necesidades"])
app.include_router(donaciones.router, prefix="/donaciones", tags=["Donaciones"])


@app.get("/")
def home():
    return {"mensaje: ": "Hola Montemorelos, el sistema de ayuda está activo."}
