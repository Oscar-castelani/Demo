import { useEffect } from 'react'

const BASE = 'TUCE Conecta'

/** Título de la pestaña del navegador según la pantalla (ayuda a lectores de pantalla y al historial). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE
    return () => {
      document.title = BASE
    }
  }, [title])
}
