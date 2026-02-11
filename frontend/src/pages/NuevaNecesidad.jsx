import DropdownCategoria from "../components/DropdownCategoria" 
import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
const API_URL = import.meta.env.VITE_API_URL    


function ClickEnMapa({ onClic }) {
    useMapEvents({
        click: (e) => {
            onClic(e.latlng.lat, e.latlng.lng)
        }
    })
    return null
}

function Necesidad({usuario}) {
    const [titulo, setTitulo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [categoria, setCategoria] = useState("")
    const [latitud, setLatitud] = useState(null)
    const [longitud, setLongitud] = useState(null)
    const [direccion_aproximada, setDireccion] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [esError, setEsError] = useState(false)

    const handleCrear = async () => {
        if(!usuario){
            setMensaje("Tienes que iniciar sesión para publicar")
            setEsError(true)
            return
        }
        try {
            const response = await fetch(
                `${API_URL}/necesidades/?usuario_id=${usuario.id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        titulo: titulo,
                        descripcion: descripcion,
                        categoria: categoria,
                        latitud: latitud,
                        longitud: longitud,
                        direccion_aproximada: direccion_aproximada,
                        estado: "abierta"
                    })
                }
            )
            const data = await response.json()
            if (!response.ok) {
                setMensaje(data.detail)
                setEsError(true)
                return
            }
            setMensaje("Necesidad creada exitosamente!")
            setEsError(false)
        } catch (error) {
            setMensaje("Error al crear la necesidad")
            setEsError(true)
        }
    }

    return (
        <div className="necesidad-container">
            <h1>Publicar Necesidad</h1>
            <p>Ayuda a alguien de Montemorelos a ser visible</p>

            <div className="necesidad-form">
                <label>Titulo</label>
                <input
                    placeholder="Ej: Familia necesita despensa"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <label>Descripcion</label>
                <input
                    placeholder="Describe la situacion y que se necesita"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                <label>Categoria</label>
                <DropdownCategoria 
                    valor={categoria}
                    onChange={setCategoria}
                    mostrarTodas={false}
                    placeholder="Selecciona una categoría"
                />

                <label>Direccion aproximada</label>
                <input
                    placeholder="Ej: Col. Centro, cerca del parque"
                    value={direccion_aproximada}
                    onChange={(e) => setDireccion(e.target.value)}
                />

                <div className="mapa-selector">
                    <p>Haz clic en el mapa para marcar la ubicacion:</p>
                    <div className="mapa-wrapper">
                        <MapContainer
                            center={[25.1872, -99.8275]}
                            zoom={13}
                            style={{ height: "350px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <ClickEnMapa
                                onClic={(lat, lng) => {
                                    setLatitud(lat)
                                    setLongitud(lng)
                                }}
                            />
                            {latitud && longitud && (
                                <Marker position={[latitud, longitud]} />
                            )}
                        </MapContainer>
                    </div>

                    {latitud && (
                        <p className="ubicacion-info">
                            Ubicacion seleccionada: {latitud.toFixed(6)}, {longitud.toFixed(6)}
                        </p>
                    )}
                </div>

                <button onClick={handleCrear}>Publicar Necesidad</button>

                {mensaje && (
                    <p className={esError ? "mensaje-error" : "mensaje-exito"}
                       style={{ textAlign: "center", marginTop: "1rem" }}>
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Necesidad
