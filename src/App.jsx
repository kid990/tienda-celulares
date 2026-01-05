import { useState, useEffect } from 'react'
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'

function App() {
  const [menuActual, setMenuActual] = useState('inicio')
  const [celulares, setCelulares] = useState([])
  const [celularEditando, setCelularEditando] = useState(null)
  const [celularDetalle, setCelularDetalle] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Cargar datos desde la API al iniciar
  useEffect(() => {
    fetch('http://localhost:3000/api/celulares')
      .then(response => response.json())
      .then(data => {
        setCelulares(data)
      })
      .catch(error => {
        console.error('Error al cargar celulares:', error)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const celularData = {
      marca: formData.get('marca'),
      modelo: formData.get('modelo'),
      almacenamiento: formData.get('almacenamiento'),
      ram: formData.get('ram'),
      precioVenta: formData.get('precioVenta'),
      cantidad: formData.get('cantidad'),
      color: formData.get('color')
    }
    
    try {
      if (celularEditando) {
        // Editar celular existente
        const response = await fetch(`http://localhost:3000/api/celulares/${celularEditando.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(celularData)
        })
        
        const celularActualizado = await response.json()
        
        setCelulares(celulares.map(cel => 
          cel.id === celularEditando.id ? celularActualizado : cel
        ))
        setCelularEditando(null)
        
        // Alerta de éxito para edición
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Celular actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        })
      } else {
        // Crear nuevo celular
        const response = await fetch('http://localhost:3000/api/celulares', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(celularData)
        })
        
        const nuevoCelular = await response.json()
        setCelulares([...celulares, nuevoCelular])
        
        // Alerta de éxito para registro
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Celular registrado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        })
      }
      
      e.target.reset()
      setMenuActual('inicio')
    } catch (error) {
      console.error('Error al guardar celular:', error)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al guardar el celular',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    }
  }

  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:3000/api/celulares/${id}`, {
            method: 'DELETE'
          })
          
          const celularesActualizados = celulares.filter(cel => cel.id !== id)
          setCelulares(celularesActualizados)
          
          // Alerta de éxito para eliminación
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Celular eliminado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            toast: true
          })
        } catch (error) {
          console.error('Error al eliminar celular:', error)
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al eliminar el celular',
            showConfirmButton: false,
            timer: 2000,
            toast: true
          })
        }
      }
    })
  }

  const handleEditar = (celular) => {
    setCelularEditando(celular)
    setMenuActual('registrar')
  }

  const handleVerDetalle = (celular) => {
    setCelularDetalle(celular)
  }

  const cerrarModal = () => {
    setCelularDetalle(null)
  }

  // Filtrar celulares por búsqueda
  const celularesFiltrados = celulares.filter(celular => {
    const searchTerm = busqueda.toLowerCase()
    return (
      celular.marca.toLowerCase().includes(searchTerm) ||
      celular.modelo.toLowerCase().includes(searchTerm) ||
      celular.almacenamiento.toLowerCase().includes(searchTerm) ||
      celular.ram.toLowerCase().includes(searchTerm) ||
      celular.color.toLowerCase().includes(searchTerm) ||
      celular.precioVenta.toString().includes(searchTerm)
    )
  })

  // Calcular paginación
  const indexUltimo = paginaActual * itemsPorPagina
  const indexPrimero = indexUltimo - itemsPorPagina
  const celularesActuales = celularesFiltrados.slice(indexPrimero, indexUltimo)
  const totalPaginas = Math.ceil(celularesFiltrados.length / itemsPorPagina)

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina)
  }

  // Cambiar items por página
  const cambiarItemsPorPagina = (e) => {
    setItemsPorPagina(Number(e.target.value))
    setPaginaActual(1)
  }

  // Resetear página al buscar
  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <h1 className="text-lg md:text-2xl font-bold text-center mb-2">Tienda de Celulares</h1>
          <div className="flex flex-row gap-3 justify-center">
            <button 
              className={`px-5 py-1.5 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
                menuActual === 'inicio' 
                  ? 'bg-white text-purple-600 shadow-md' 
                  : 'bg-transparent border-2 border-white hover:bg-white hover:text-purple-600'
              }`}
              onClick={() => setMenuActual('inicio')}
            >
              Inicio
            </button>
            <button 
              className={`px-5 py-1.5 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
                menuActual === 'registrar' 
                  ? 'bg-white text-purple-600 shadow-md' 
                  : 'bg-transparent border-2 border-white hover:bg-white hover:text-purple-600'
              }`}
              onClick={() => {
                setCelularEditando(null)
                setMenuActual('registrar')
              }}
            >
              Registrar
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {menuActual === 'inicio' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
              Registro de Celulares
            </h2>
            
            {celulares.length === 0 ? (
              <p className="text-center text-gray-600 bg-white rounded-xl shadow-md p-8 text-lg">
                No hay celulares registrados. Ve a "Registrar" para agregar uno.
              </p>
            ) : (
              <>
                {/* Barra de búsqueda y selector de items por página */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Buscador */}
                  <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por marca, modelo, RAM, almacenamiento..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Selector de items por página */}
                  <div className="flex items-center gap-3">
                    <label className="text-gray-700 font-semibold whitespace-nowrap">
                      Mostrar:
                    </label>
                    <select
                      value={itemsPorPagina}
                      onChange={cambiarItemsPorPagina}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-gray-700 whitespace-nowrap">por página</span>
                  </div>
                </div>

                {/* Contador de resultados */}
                <div className="mb-4 text-gray-600 text-center md:text-left">
                  Mostrando {indexPrimero + 1} - {Math.min(indexUltimo, celularesFiltrados.length)} de {celularesFiltrados.length} {celularesFiltrados.length === 1 ? 'resultado' : 'resultados'}
                </div>

                {celularesFiltrados.length === 0 ? (
                  <p className="text-center text-gray-600 bg-white rounded-xl shadow-md p-8 text-lg">
                    No se encontraron resultados para "{busqueda}"
                  </p>
                ) : (
                  <>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      {/* Vista de tabla para pantallas grandes */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                            <tr>
                              <th className="px-6 py-4 text-left font-semibold uppercase text-sm tracking-wider">Marca</th>
                              <th className="px-6 py-4 text-left font-semibold uppercase text-sm tracking-wider">Modelo</th>
                              <th className="px-6 py-4 text-left font-semibold uppercase text-sm tracking-wider">Precio de Venta</th>
                              <th className="px-6 py-4 text-center font-semibold uppercase text-sm tracking-wider">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {celularesActuales.map((celular) => (
                              <tr key={celular.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-800">{celular.marca}</td>
                                <td className="px-6 py-4 text-gray-800">{celular.modelo}</td>
                                <td className="px-6 py-4 text-purple-600 font-bold">${celular.precioVenta}</td>
                                <td className="px-6 py-4">
                                  <div className="flex gap-2 justify-center">
                                    <button 
                                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
                                      onClick={() => handleVerDetalle(celular)}
                                      title="Ver detalles"
                                    >
                                      <FaEye />
                                    </button>
                                    <button 
                                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-200"
                                      onClick={() => handleEditar(celular)}
                                      title="Editar"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button 
                                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
                                      onClick={() => handleEliminar(celular.id)}
                                      title="Eliminar"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Vista de tarjetas para móviles */}
                      <div className="md:hidden divide-y divide-gray-200">
                        {celularesActuales.map((celular) => (
                          <div key={celular.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start gap-3 mb-3">
                              {/* Información del celular */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base text-gray-800 truncate">{celular.marca} {celular.modelo}</h3>
                                <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                                  <p><span className="font-semibold">RAM:</span> {celular.ram} | <span className="font-semibold">Almacenamiento:</span> {celular.almacenamiento}</p>
                                  <p><span className="font-semibold">Color:</span> {celular.color} | <span className="font-semibold">Stock:</span> {celular.cantidad}</p>
                                </div>
                                <p className="text-purple-600 font-bold text-lg mt-2">${celular.precioVenta}</p>
                              </div>
                              
                              {/* Botones de acción */}
                              <div className="flex flex-col gap-2">
                                <button 
                                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
                                  onClick={() => handleVerDetalle(celular)}
                                  title="Ver detalles"
                                >
                                  <FaEye className="text-sm" />
                                </button>
                                <button 
                                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition-all"
                                  onClick={() => handleEditar(celular)}
                                  title="Editar"
                                >
                                  <FaEdit className="text-sm" />
                                </button>
                                <button 
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all"
                                  onClick={() => handleEliminar(celular.id)}
                                  title="Eliminar"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-1 overflow-x-auto pb-2">
                        <button
                          onClick={() => cambiarPagina(paginaActual - 1)}
                          disabled={paginaActual === 1}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all whitespace-nowrap ${
                            paginaActual === 1
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          Ant
                        </button>

                        {[...Array(totalPaginas)].map((_, index) => {
                          const numeroPagina = index + 1
                          // Mostrar solo algunas páginas alrededor de la actual
                          if (
                            numeroPagina === 1 ||
                            numeroPagina === totalPaginas ||
                            (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
                          ) {
                            return (
                              <button
                                key={numeroPagina}
                                onClick={() => cambiarPagina(numeroPagina)}
                                className={`min-w-[28px] px-2 py-1 rounded text-xs font-semibold transition-all ${
                                  paginaActual === numeroPagina
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {numeroPagina}
                              </button>
                            )
                          } else if (
                            numeroPagina === paginaActual - 2 ||
                            numeroPagina === paginaActual + 2
                          ) {
                            return <span key={numeroPagina} className="px-1 text-gray-500 text-xs">...</span>
                          }
                          return null
                        })}

                        <button
                          onClick={() => cambiarPagina(paginaActual + 1)}
                          disabled={paginaActual === totalPaginas}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all whitespace-nowrap ${
                            paginaActual === totalPaginas
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          Sig
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {menuActual === 'registrar' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
              {celularEditando ? 'Editar Celular' : 'Registrar Nuevo Celular'}
            </h2>
            <form className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="marca">
                    Marca:
                  </label>
                  <input 
                    type="text" 
                    id="marca" 
                    name="marca" 
                    placeholder="Ej: Samsung, Apple, Xiaomi" 
                    defaultValue={celularEditando?.marca || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="modelo">
                    Modelo:
                  </label>
                  <input 
                    type="text" 
                    id="modelo" 
                    name="modelo" 
                    placeholder="Ej: Galaxy S23, iPhone 15" 
                    defaultValue={celularEditando?.modelo || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="almacenamiento">
                    Almacenamiento:
                  </label>
                  <input 
                    type="text" 
                    id="almacenamiento" 
                    name="almacenamiento" 
                    placeholder="Ej: 128GB, 256GB, 512GB" 
                    defaultValue={celularEditando?.almacenamiento || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="ram">
                    RAM:
                  </label>
                  <input 
                    type="text" 
                    id="ram" 
                    name="ram" 
                    placeholder="Ej: 4GB, 8GB, 12GB" 
                    defaultValue={celularEditando?.ram || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="precioVenta">
                    Precio de Venta:
                  </label>
                  <input 
                    type="number" 
                    id="precioVenta" 
                    name="precioVenta" 
                    placeholder="0.00" 
                    step="0.01" 
                    defaultValue={celularEditando?.precioVenta || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="cantidad">
                    Cantidad:
                  </label>
                  <input 
                    type="number" 
                    id="cantidad" 
                    name="cantidad" 
                    placeholder="0" 
                    defaultValue={celularEditando?.cantidad || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="color">
                    Color:
                  </label>
                  <input 
                    type="text" 
                    id="color" 
                    name="color" 
                    placeholder="Ej: Negro, Blanco, Azul" 
                    defaultValue={celularEditando?.color || ''}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    required 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                {celularEditando ? 'Actualizar Celular' : 'Registrar Celular'}
              </button>
              
              {celularEditando && (
                <button 
                  type="button" 
                  className="w-full mt-3 px-6 py-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 hover:shadow-lg transition-all duration-200"
                  onClick={() => {
                    setCelularEditando(null)
                    setMenuActual('inicio')
                  }}
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Modal de Detalles */}
      {celularDetalle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={cerrarModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl leading-none transition-all hover:rotate-90"
              onClick={cerrarModal}
            >
              ×
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 text-center mb-6">
              Detalles del Celular
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">Marca:</strong>
                <span className="text-gray-600">{celularDetalle.marca}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">Modelo:</strong>
                <span className="text-gray-600">{celularDetalle.modelo}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">Almacenamiento:</strong>
                <span className="text-gray-600">{celularDetalle.almacenamiento}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">RAM:</strong>
                <span className="text-gray-600">{celularDetalle.ram}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">Precio de Venta:</strong>
                <span className="text-purple-600 font-bold text-xl">${celularDetalle.precioVenta}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">Cantidad:</strong>
                <span className="text-gray-600">{celularDetalle.cantidad} unidades</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-purple-600">
                <strong className="text-gray-700">Color:</strong>
                <span className="text-gray-600">{celularDetalle.color}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
