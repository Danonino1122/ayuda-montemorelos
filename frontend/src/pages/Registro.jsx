import { useState } from "react"
import { Link } from "react-router-dom"

function Registro() {
    const [nombre_completo, setNombre_completo] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [telefono, setTelefono] = useState("")
    const [rol, setRol] = useState("donante")
    const [mensaje, setMensaje] = useState("")
    const [esError, setEsError] = useState(false)

    const handleRegistro = async () => {
        try {
            const response = await fetch("http://localhost:8000/usuarios/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre_completo: nombre_completo,
                    email: email,
                    password: password,
                    telefono: telefono,
                    rol: rol
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setMensaje(data.detail)
                setEsError(true)
                return
            }
            setMensaje("Registro exitoso! Ya puedes iniciar sesion.")
            setEsError(false)

        } catch (error) {
            setMensaje("Error al registrarse")
            setEsError(true)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-info">
                <h1>Se parte del <span>cambio</span></h1>
                <p>
                    En Montemorelos hay personas que necesitan tu ayuda.
                    Registrate y se parte de una red de apoyo que esta
                    transformando nuestra comunidad, una donacion a la vez.
                </p>
                <ul className="auth-features">
                    <li>
                        <div className="feature-icon">&#127873;</div>
                        <span><strong>Como donante:</strong> Encuentra necesidades reales y ayuda directamente</span>
                    </li>
                    <li>
                        <div className="feature-icon">&#128101;</div>
                        <span><strong>Como padrino:</strong> Publica necesidades de personas que conoces</span>
                    </li>
                    <li>
                        <div className="feature-icon">&#128663;</div>
                        <span>Los padrinos llevan las donaciones a quienes las necesitan</span>
                    </li>
                    <li>
                        <div className="feature-icon">&#127758;</div>
                        <span>Todo se muestra en un mapa para mayor transparencia</span>
                    </li>
                </ul>
            </div>

            <div className="auth-form">
                <div className="form-card">
                    <h1>Crear Cuenta</h1>
                    <h2>Unete a la comunidad</h2>

                    <input
                        placeholder="Nombre completo"
                        value={nombre_completo}
                        onChange={(e) => setNombre_completo(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        placeholder="Numero celular"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />

                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                    >
                        <option value="donante">Donante - Quiero ayudar</option>
                        <option value="padrino">Padrino - Conozco personas que necesitan ayuda</option>
                    </select>

                    <button onClick={handleRegistro}>Crear mi cuenta</button>

                    {mensaje && (
                        <p className={esError ? "mensaje-error" : "mensaje-exito"}>
                            {mensaje}
                        </p>
                    )}

                    <div className="form-link">
                        <p>Ya tienes cuenta? <Link to="/login">Inicia sesion</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registro
