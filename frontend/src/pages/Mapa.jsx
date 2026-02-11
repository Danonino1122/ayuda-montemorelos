import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import DropdownCategoria from "../components/DropdownCategoria"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
const API_URL = import.meta.env.VITE_API_URL    


function Mapa({usuario}) {
    const [necesidades, setNecesidades] = useState([])
    const [filtroCategoria, setFiltroCategoria] = useState("todas")



    const cargarNecesidades = () => {
    const url = usuario 
        ? `${API_URL}/necesidades/?usuario_id=${usuario.id}`
        : `${API_URL}/necesidades/`
    
    fetch(url)
        .then(response => response.json())
        .then(data => setNecesidades(data))
}


    useEffect(()=>{
        cargarNecesidades()
    },[])

    const ofrecerAyuda = async (necesidadId)=>{
        try{
            const response = await fetch(
                `${API_URL}/donaciones/?donante_id=${usuario.id}`,
            {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body:JSON.stringify({
                    necesidad_id: necesidadId,
                    mensaje_donante:"Quiero ayudar con esta necesidad"
                })
            })
            if(response.ok){
                alert("¡Gracias! Tu oferta de ayuda fue registrada")
                cargarNecesidades()
            }else{
                const data = await response.json()
                alert(data.detail || "Error al registrar tu ayuda")
            }
        }catch(error){
            alert("Error al conectar con el servidor")
        }
    }

    const necesidadesFiltradas = filtroCategoria === "todas"
    ? necesidades
    : necesidades.filter(n => n.categoria === filtroCategoria)

    return (
       <div className="mapa-container">
        <div className="mapa-header">
            <div>
                <h1>Mapa de Necesidades</h1>
                <p>Haz clic en los marcadores para ver los detalles</p>
            </div>
            <div className="mapa-filtros">
                <DropdownCategoria 
                    valor={filtroCategoria}
                    onChange={setFiltroCategoria}
                    mostrarTodas={true}
                />
                <span className="contador-necesidades">
                    {necesidadesFiltradas.length} necesidades
                </span>
            </div>
        </div>

            <div className="mapa-wrapper">
                <MapContainer
                    center={[25.1872, -99.8275]}
                    zoom={13}
                    style={{ height: "calc(100vh - 150px)", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {necesidadesFiltradas.map((necesidad) => (
                        <Marker
                            key={necesidad.id}
                            position={[necesidad.latitud, necesidad.longitud]}
                        >
                            <Popup>
                                <div className="popup-content">
                                    <h3>{necesidad.titulo}</h3>
                                    <p>{necesidad.descripcion}</p>
                                    <p>Categoria: {necesidad.categoria}</p>
                                    {necesidad.direccion_aproximada && (
                                        <p>Direccion: {necesidad.direccion_aproximada}</p>
                                    )}
                                    <p className="donantes-count">
                                         🙋 {necesidad.total_donantes} personas(s) quieren ayudar
                                    </p>
                                    <span className={`estado-badge estado-${necesidad.estado}`}>
                                        {necesidad.estado}
                                    </span>
                                    {necesidad.ya_dono ? (
                                        <p className="ya-ayudaste">✅ Ya ofreciste tu ayuda</p>
                                    ) : (
                                        <button className="btn-ayudar" onClick={() => ofrecerAyuda(necesidad.id)}>
                                            Quiero Ayudar
                                        </button>
                                    )}

                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}

export default Mapa
