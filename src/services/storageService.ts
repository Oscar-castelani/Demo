import { createInitialState, SCHEMA_VERSION } from '../data/demoData'
import type { DemoState } from '../types'

export const STORAGE_KEY = 'tuce-conecta-demo'

export interface LoadResult {
  state: DemoState
  /** true si se restauró lo guardado; false si se usaron los datos iniciales. */
  restored: boolean
  /** Mensaje para mostrar al usuario cuando algo falló o se descartó. */
  warning?: string
}

function isValidState(value: unknown): value is DemoState {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return (
    s.schemaVersion === SCHEMA_VERSION &&
    Array.isArray(s.users) &&
    Array.isArray(s.businesses) &&
    Array.isArray(s.projects) &&
    Array.isArray(s.tasks) &&
    Array.isArray(s.deliverables) &&
    Array.isArray(s.applications) &&
    Array.isArray(s.studentProfiles) &&
    Array.isArray(s.interests) &&
    (s.activeUserId === null || typeof s.activeUserId === 'string')
  )
}

/** Carga el estado guardado o, si no existe o no es válido, los datos iniciales. */
export function loadState(): LoadResult {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return {
      state: createInitialState(),
      restored: false,
      warning: 'No se pudo acceder al almacenamiento del navegador. Los cambios no se conservarán.',
    }
  }
  if (raw === null) return { state: createInitialState(), restored: false }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isValidState(parsed)) return { state: parsed, restored: true }
    return {
      state: createInitialState(),
      restored: false,
      warning: 'Los datos guardados eran de una versión anterior y se restablecieron.',
    }
  } catch {
    return {
      state: createInitialState(),
      restored: false,
      warning: 'Los datos guardados estaban dañados y se restablecieron.',
    }
  }
}

/** Guarda el estado. Devuelve false si el navegador no lo permitió (cuota, modo privado). */
export function saveState(state: DemoState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

/** Borra lo guardado y devuelve los datos iniciales. La confirmación previa la pide la interfaz. */
export function resetState(): DemoState {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Si falla el borrado igualmente se devuelven los datos iniciales.
  }
  return createInitialState()
}
