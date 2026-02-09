import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiLogOut } from "react-icons/fi"   
import Login from "./pages/Login.jsx"
import Mapa from "./pages/Mapa.jsx"
import Registro from "./pages/Registro.jsx"
import Necesidad from "./pages/NuevaNecesidad.jsx"
import Home from "./pages/Home.jsx"
import PanelPadrino from "./pages/PanelPadrino.jsx"
import "./App.css"

// Componente de navegación separado (para poder usar useNavigate)
function Navegacion({ usuario, cerrarSesion }) {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                Ayuda <span>Montemorelos</span>
            </Link>
            <div className="navbar-links">
                {!usuario ? (
                    <>
                        <Link to="/login">Iniciar Sesion</Link>
                        <Link to="/registro">Registrarse</Link>
                    </>
                ) : (
                    <>
                        <Link to="/mapa">Ver Mapa</Link>
                        {(usuario.rol === "padrino" || usuario.rol === "admin") && (
                            <>
                                <Link to="/necesidades">Crear Necesidad</Link>
                                <Link to="/panel">Mi Panel</Link>
                            </>
                        )}
                        <span style={{ color: "#2d6a4f", fontWeight: 600, padding: "0.5rem" }}>
                            Hola, {usuario.nombre_completo}
                        </span>
                        <button className="btn-logout" onClick={cerrarSesion}>
                             <FiLogOut /> Salir
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

function RutaProtegida({usuario, children, rolesPermitidos=null}){
    if(!usuario){
        return <Navigate to="/login" />
    }

    if(rolesPermitidos && !rolesPermitidos.includes(usuario.rol)){
        return <Navigate to="/" />
    }
    return children
}

// Componente principal que contiene las rutas
function AppContent({ usuario, setUsuario }) {
    const navigate = useNavigate()

    const cerrarSesion = () => {
        setUsuario(null)  // Limpiamos el usuario
        navigate("/")     // Redirigimos al inicio
    }

    return (
        <>
            <Navegacion usuario={usuario} cerrarSesion={cerrarSesion} />

            <Routes>
                <Route path="/login" element={<Login setUsuario={setUsuario} />} />
                <Route path="/registro" element={<Registro />} />

                {/* Ruta protegida: cualquier usuario logueado */}
                <Route path="/mapa" element={
                    <RutaProtegida usuario={usuario}>
                        <Mapa usuario={usuario} />
                    </RutaProtegida>
                } />
                 <Route path="/necesidades" element={
                    <RutaProtegida usuario={usuario} rolesPermitidos={["padrino", "admin"]}>
                        <Necesidad usuario={usuario} />
                    </RutaProtegida>
                } />
    
                <Route path="/panel" element={
                    <RutaProtegida usuario={usuario} rolesPermitidos={["padrino", "admin"]}>
                        <PanelPadrino usuario={usuario} />
                    </RutaProtegida>
                } />
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    )
}

// Componente App principal
// Componente App principal
function App() {
    const [usuario, setUsuario] = useState(() => {
        // Al iniciar, intentar recuperar el usuario de localStorage
        const usuarioGuardado = localStorage.getItem("usuario")
        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null
    })

    // Cada vez que usuario cambie, guardarlo en localStorage
    useEffect(() => {
        if (usuario) {
            localStorage.setItem("usuario", JSON.stringify(usuario))
        } else {
            localStorage.removeItem("usuario")
        }
    }, [usuario])

    return (
        <BrowserRouter>
            <AppContent usuario={usuario} setUsuario={setUsuario} />
        </BrowserRouter>
    )
}


export default App