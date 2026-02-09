import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login({setUsuario}) {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [esError, setEsError] = useState(false)

    const handleLogin = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/usuarios/login?email=${email}&password=${password}`,
                { method: "POST" }
            )

            const data = await response.json()

            if (!response.ok) {
                setMensaje(data.detail)
                setEsError(true)
                return
            }

            setUsuario(data)
            navigate("/mapa")


        } catch (error) {
            setMensaje("Error al conectar con el servidor")
            setEsError(true)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-info">
                <h1>Conectando corazones en <span>Montemorelos</span></h1>
                <p>
                    Somos una plataforma que conecta a personas que necesitan ayuda
                    con donantes generosos de nuestra comunidad. A traves de padrinos
                    de confianza, nos aseguramos de que cada donacion llegue a quien
                    mas lo necesita.
                </p>
                <ul className="auth-features">
                    <li>
                        <div className="feature-icon">&#128205;</div>
                        <span>Localiza necesidades cerca de ti en un mapa interactivo</span>
                    </li>
                    <li>
                        <div className="feature-icon">&#129309;</div>
                        <span>Dona con confianza a traves de padrinos verificados</span>
                    </li>
                    <li>
                        <div className="feature-icon">&#128274;</div>
                        <span>Sistema seguro que protege a donantes y beneficiarios</span>
                    </li>
                    <li>
                        <div className="feature-icon">&#10084;</div>
                        <span>Hecho por y para la comunidad de Montemorelos, N.L.</span>
                    </li>
                </ul>
            </div>

            <div className="auth-form">
                <div className="form-card">
                    <h1>Bienvenido</h1>
                    <h2>Inicia sesion para ayudar a tu comunidad</h2>

                    <input
                        type="email"
                        placeholder="Tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Tu contrasena"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={handleLogin}>Entrar</button>

                    {mensaje && (
                        <p className={esError ? "mensaje-error" : "mensaje-exito"}>
                            {mensaje}
                        </p>
                    )}

                    <div className="form-link">
                        <p>No tienes cuenta? <Link to="/registro">Registrate aqui</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
