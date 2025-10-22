import React from 'react'

function BotonCerrarSesion() {
  const cerrarSesion = () => {
    console.log("Sesión cerrada")
    // Aquí puedes agregar lógica adicional como limpiar el estado, redirigir, etc.
  }

  return (
    <button onClick={cerrarSesion}>
      Cerrar sesión
    </button>
  )
}

export default BotonCerrarSesion

