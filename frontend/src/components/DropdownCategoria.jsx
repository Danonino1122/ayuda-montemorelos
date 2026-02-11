import { useState, useRef, useEffect } from "react"
import { FiChevronDown } from "react-icons/fi"
import {
    MdLocationOn,
    MdRestaurant,
    MdCheckroom,
    MdLocalHospital,
    MdHome,
    MdAttachMoney,
    MdBuild,
    MdInventory
} from "react-icons/md"

// Lista de categorías con iconos profesionales
const CATEGORIAS = [
    { value: "todas", label: "Todas las categorías", icon: MdLocationOn, color: "#2d6a4f" },
    { value: "alimentos", label: "Alimentos", icon: MdRestaurant, color: "#e63946" },
    { value: "ropa", label: "Ropa", icon: MdCheckroom, color: "#457b9d" },
    { value: "medicina", label: "Medicina", icon: MdLocalHospital, color: "#2a9d8f" },
    { value: "hogar", label: "Artículos del hogar", icon: MdHome, color: "#e9c46a" },
    { value: "dinero", label: "Dinero", icon: MdAttachMoney, color: "#52b788" },
    { value: "servicios", label: "Servicios", icon: MdBuild, color: "#f4a261" },
    { value: "otro", label: "Otro", icon: MdInventory, color: "#6c757d" }
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
                            <span className="dropdown-icono" style={{ color: categoriaSeleccionada.color }}>
                                <categoriaSeleccionada.icon size={20} />
                            </span>
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
                            <span className="dropdown-icono" style={{ color: valor === categoria.value ? "white" : categoria.color }}>
                                <categoria.icon size={20} />
                            </span>
                            {categoria.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DropdownCategoria
