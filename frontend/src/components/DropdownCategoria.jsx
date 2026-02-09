import { useState, useRef, useEffect } from "react"
import { FiChevronDown } from "react-icons/fi"

// Lista de categorías que usaremos
const CATEGORIAS = [
    { value: "todas", label: "Todas las categorías", emoji: "📍" },
    { value: "alimentos", label: "Alimentos", emoji: "🍎" },
    { value: "ropa", label: "Ropa", emoji: "👕" },
    { value: "medicina", label: "Medicina", emoji: "💊" },
    { value: "hogar", label: "Artículos del hogar", emoji: "🏠" },
    { value: "dinero", label: "Dinero", emoji: "💰" },
    { value: "servicios", label: "Servicios", emoji: "🔧" },
    { value: "otro", label: "Otro", emoji: "📦" }
]

function DropdownCategoria({ valor, onChange, mostrarTodas = true, placeholder = "Selecciona una categoría" }) {
    const [abierto, setAbierto] = useState(false)
    const dropdownRef = useRef(null)

    // Filtrar categorías (quitar "todas" si no se necesita)
    const categorias = mostrarTodas 
        ? CATEGORIAS 
        : CATEGORIAS.filter(c => c.value !== "todas")

    // Encontrar la categoría seleccionada
    const categoriaSeleccionada = categorias.find(c => c.value === valor)

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickFuera = (evento) => {
            if (dropdownRef.current && !dropdownRef.current.contains(evento.target)) {
                setAbierto(false)
            }
        }

        document.addEventListener("mousedown", handleClickFuera)
        return () => document.removeEventListener("mousedown", handleClickFuera)
    }, [])

    const seleccionarOpcion = (categoria) => {
        onChange(categoria.value)
        setAbierto(false)
    }

    return (
        <div className="dropdown-categoria" ref={dropdownRef}>
            {/* Botón principal */}
            <button 
                type="button"
                className={`dropdown-boton ${abierto ? "abierto" : ""}`}
                onClick={() => setAbierto(!abierto)}
            >
                <span className="dropdown-texto">
                    {categoriaSeleccionada ? (
                        <>
                            <span className="dropdown-emoji">{categoriaSeleccionada.emoji}</span>
                            {categoriaSeleccionada.label}
                        </>
                    ) : (
                        <span className="dropdown-placeholder">{placeholder}</span>
                    )}
                </span>
                <FiChevronDown className={`dropdown-flecha ${abierto ? "rotada" : ""}`} />
            </button>

            {/* Lista de opciones */}
            {abierto && (
                <div className="dropdown-lista">
                    {categorias.map((categoria) => (
                        <div
                            key={categoria.value}
                            className={`dropdown-opcion ${valor === categoria.value ? "seleccionada" : ""}`}
                            onClick={() => seleccionarOpcion(categoria)}
                        >
                            <span className="dropdown-emoji">{categoria.emoji}</span>
                            {categoria.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DropdownCategoria