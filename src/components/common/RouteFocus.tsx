import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Al cambiar de pantalla (no de pestaña ni de consulta dentro de la misma), lleva la vista al inicio y el foco
 * al título principal, para que quien usa teclado o lector de pantalla sepa que cambió el contenido.
 * En la primera carga no mueve el foco.
 */
export function RouteFocus() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
      const target = document.querySelector<HTMLElement>('main h1') ?? document.querySelector<HTMLElement>('main')
      if (!target) return
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
