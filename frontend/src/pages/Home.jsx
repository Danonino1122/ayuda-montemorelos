import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiMapPin, FiSearch, FiGift, FiHeart } from "react-icons/fi"
const API_URL = import.meta.env.VITE_API_URL

function Home() {
    const [estadisticas, setEstadisticas] = useState({
        necesidades: 0,
        donaciones: 0
    })

    // Cargar estadísticas al abrir la página
    useEffect(() => {
        // Obtener cantidad de necesidades
        fetch(`${API_URL}/necesidades/`)
            .then(response => response.json())
            .then(data => setEstadisticas(prev => ({ ...prev, necesidades: data.length })))

        // Obtener cantidad de donaciones
        fetch(`${API_URL}/donaciones/`)
            .then(response => response.json())
            .then(data => setEstadisticas(prev => ({ ...prev, donaciones: data.length })))
    }, [])

    return (
        <div className="home-container">
            {/* SECCION HERO - Lo primero que ven */}
            <section className="hero">
                <h1>Conectando corazones en <span>Montemorelos</span></h1>
                <p>
                    Somos una plataforma que conecta a personas que necesitan ayuda
                    con donantes generosos. A traves de padrinos de confianza,
                    garantizamos que cada donación llegue a quien mas lo necesita.
                </p>
                <div className="hero-buttons">
                    <Link to="/registro" className="btn-primary">Quiero Ayudar</Link>
                    <Link to="/login" className="btn-secondary">Ya tengo cuenta</Link>
                </div>
            </section>

            {/* SECCION ESTADISTICAS */}
            <section className="stats">
                <div className="stat-card">
                    <span className="stat-number">{estadisticas.necesidades}</span>
                    <span className="stat-label">Necesidades activas</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{estadisticas.donaciones}</span>
                    <span className="stat-label">Ofertas de ayuda</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Transparencia</span>
                </div>
            </section>

            {/* SECCION COMO FUNCIONA */}
            <section className="como-funciona">
                <h2>Como funciona</h2>
                <div className="pasos">
                    <div className="paso">
                        <div className="paso-icon"><FiMapPin /></div>
                        <h3>Padrinos publican</h3>
                        <p>Personas de confianza publican necesidades de quienes conocen</p>
                    </div>
                    <div className="paso">
                        <div className="paso-icon"><FiSearch /></div>
                        <h3>Donantes encuentran</h3>
                        <p>Ves en el mapa quien necesita ayuda cerca de ti</p>
                    </div>
                    <div className="paso">
                        <div className="paso-icon"><FiGift /></div>
                        <h3>Entrega segura</h3>
                        <p>El padrino lleva tu donacion a quien la necesita</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <p>Hecho con <FiHeart style={{ color: "#ff6b6b", verticalAlign: "middle" }} /> para Montemorelos, Nuevo Leon</p>
            </footer>
        </div>
    )
}

export default Home
