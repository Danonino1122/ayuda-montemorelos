import { useState, useEffect } from "react"
import { FiUsers, FiMapPin, FiPhone, FiMail, FiChevronDown, FiChevronUp, FiEdit, FiTrash2 } from "react-icons/fi"
const API_URL = import.meta.env.VITE_API_URL    


function PanelPadrino({ usuario }) {
    const [necesidades, setNecesidades] = useState([])
    const [expandida, setExpandida] = useState(null) // ID de necesidad expandida
    const [donaciones, setDonaciones] = useState({}) // Donaciones por necesidad
    const [editando, setEditando] = useState(null)
    const [datosEdicion, setDatosEdicion] = useState({})

    // Cargar las necesidades del padrino
    const CargarNecesidades =() => {
        if (usuario) {
            fetch(`${API_URL}/necesidades/padrino/${usuario.id}`)
                .then(response => response.json())
                .then(data => setNecesidades(data))
        }
    }

    useEffect(()=>{
        CargarNecesidades()
    }, [usuario])

    // Función para expandir/colapsar y cargar donaciones
    const toggleNecesidad = async (necesidadId) => {
        if (expandida === necesidadId) {
            // Si ya está expandida, la colapsamos
            setExpandida(null)
        } else {
            // Si no, la expandimos y cargamos donaciones
            setExpandida(necesidadId)

            // Solo cargar si no las tenemos ya
            if (!donaciones[necesidadId]) {
                try {
                    const response = await fetch(`${API_URL}/donaciones/necesidad/${necesidadId}`)
                    const data = await response.json()
                    setDonaciones(prev => ({ ...prev, [necesidadId]: data }))
                } catch (error) {
                    console.error("Error al cargar donaciones:", error)
                }
            }
        }
    }

    // Función para obtener el color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case "abierta": return "estado-abierta"
            case "en_proceso": return "estado-en_proceso"
            case "completada": return "estado-completada"
            default: return ""
        }
    }

    if (!usuario) {
        return (
            <div className="panel-container">
                <p>Debes iniciar sesión para ver tu panel</p>
            </div>
        )
    }


    // Función para eliminar necesidad
const eliminarNecesidad = async (necesidadId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta necesidad?")) {
        return
    }

    try {
        const response = await fetch(
            `${API_URL}/necesidades/${necesidadId}?usuario_id=${usuario.id}`,
            { method: "DELETE" }
        )

        if (response.ok) {
            alert("Necesidad eliminada exitosamente")
            CargarNecesidades() // Recargar la lista
        } else {
            const data = await response.json()
            alert(data.detail || "Error al eliminar")
        }
    } catch (error) {
        alert("Error al conectar con el servidor")
    }


}

// Función para iniciar edición
const iniciarEdicion = (necesidad) => {
    setEditando(necesidad.id)
    setDatosEdicion({
        titulo: necesidad.titulo,
        descripcion: necesidad.descripcion || "",
        categoria: necesidad.categoria,
        direccion_aproximada: necesidad.direccion_aproximada || "",
        latitud: necesidad.latitud,
        longitud: necesidad.longitud,
        estado: necesidad.estado
    })
}

// Función para cancelar edición
const cancelarEdicion = () => {
    setEditando(null)
    setDatosEdicion({})
}

// Función para guardar edición
const guardarEdicion = async (necesidadId) => {
    try {
        const response = await fetch(
            `${API_URL}/necesidades/${necesidadId}?usuario_id=${usuario.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosEdicion)
            }
        )

        if (response.ok) {
            alert("Necesidad actualizada exitosamente")
            setEditando(null)
            CargarNecesidades()
        } else {
            const data = await response.json()
            alert(data.detail || "Error al actualizar")
        }
    } catch (error) {
        alert("Error al conectar con el servidor")
    }
}





    return (
        <div className="panel-container">
            <div className="panel-header">
                <div>
                    <h1>Panel de Padrino</h1>
                    <p>Gestiona las necesidades que has publicado</p>
                </div>
                <div className="panel-stats">
                    <span className="stat-badge">
                        <FiMapPin /> {necesidades.length} necesidades publicadas
                    </span>
                </div>
            </div>

            {necesidades.length === 0 ? (
                <div className="panel-vacio">
                    <p>No has publicado ninguna necesidad aún</p>
                </div>
            ) : (
                <div className="necesidades-lista">
                    {necesidades.map(necesidad => (
                        <div key={necesidad.id} className="necesidad-card">
                            <div
                                className="necesidad-header"
                                onClick={() => toggleNecesidad(necesidad.id)}
                            >
                                <div className="necesidad-info">
                                    <h3>{necesidad.titulo}</h3>
                                    <p className="necesidad-categoria">{necesidad.categoria}</p>
                                </div>
                                <div className="necesidad-acciones">
                                    <span className={`estado-badge ${getEstadoColor(necesidad.estado)}`}>
                                        {necesidad.estado}
                                    </span>
                                    {expandida === necesidad.id ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                            </div>

                            {expandida === necesidad.id && (
    <div className="necesidad-detalle">
        
        {/* Botones de Editar y Eliminar */}
        <div className="necesidad-botones">
            <button 
                className="btn-editar" 
                onClick={() => iniciarEdicion(necesidad)}
            >
                <FiEdit /> Editar
            </button>
            <button 
                className="btn-eliminar" 
                onClick={() => eliminarNecesidad(necesidad.id)}
            >
                <FiTrash2 /> Eliminar
            </button>
        </div>

        {/* Formulario de edición o vista normal */}
        {editando === necesidad.id ? (
            <div className="formulario-edicion">
                <label>Título:</label>
                <input
                    value={datosEdicion.titulo}
                    onChange={(e) => setDatosEdicion({...datosEdicion, titulo: e.target.value})}
                />
                
                <label>Descripción:</label>
                <input
                    value={datosEdicion.descripcion}
                    onChange={(e) => setDatosEdicion({...datosEdicion, descripcion: e.target.value})}
                />
                
                <label>Categoría:</label>
                <input
                    value={datosEdicion.categoria}
                    onChange={(e) => setDatosEdicion({...datosEdicion, categoria: e.target.value})}
                />
                
                <label>Dirección aproximada:</label>
                <input
                    value={datosEdicion.direccion_aproximada}
                    onChange={(e) => setDatosEdicion({...datosEdicion, direccion_aproximada: e.target.value})}
                />

                <label>Estado:</label>
                <select
                    value={datosEdicion.estado}
                    onChange={(e) => setDatosEdicion({...datosEdicion, estado: e.target.value})}
                >
                    <option value="abierta">Abierta</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completada">Completada</option>
                </select>
                
                <div className="botones-edicion">
                    <button className="btn-guardar" onClick={() => guardarEdicion(necesidad.id)}>
                        Guardar
                    </button>
                    <button className="btn-cancelar" onClick={cancelarEdicion}>
                        Cancelar
                    </button>
                </div>
            </div>
        ) : (
            <>
                <p className="necesidad-descripcion">{necesidad.descripcion}</p>

                {necesidad.direccion_aproximada && (
                    <p className="necesidad-direccion">
                        <FiMapPin /> {necesidad.direccion_aproximada}
                    </p>
                )}
            </>
        )}


                                    <div className="donantes-seccion">
                                        <h4>
                                            <FiUsers /> Personas que quieren ayudar
                                        </h4>

                                        {!donaciones[necesidad.id] ? (
                                            <p className="cargando">Cargando...</p>
                                        ) : donaciones[necesidad.id].length === 0 ? (
                                            <p className="sin-donantes">Aún nadie ha ofrecido ayuda</p>
                                        ) : (
                                            <div className="donantes-lista">
                                                {donaciones[necesidad.id].map(donacion => (
                                                    <div key={donacion.id} className="donante-card">
                                                        <div className="donante-info">
                                                            <h5>{donacion.nombre_completo}</h5>
                                                            <p className="donante-mensaje">
                                                                "{donacion.mensaje_donante}"
                                                            </p>
                                                        </div>
                                                        <div className="donante-contacto">
                                                            <a href={`mailto:${donacion.email}`}>
                                                                <FiMail /> {donacion.email}
                                                            </a>
                                                            {donacion.telefono && (
                                                                <a href={`tel:${donacion.telefono}`}>
                                                                    <FiPhone /> {donacion.telefono}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PanelPadrino
