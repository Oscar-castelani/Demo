import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const KEY = 'tuce-presentation-step'

function read(): number | null {
  try {
    const raw = localStorage.getItem(KEY)
    const n = raw === null ? NaN : Number(raw)
    return Number.isInteger(n) && n >= 1 && n <= 9 ? n : null
  } catch {
    return null
  }
}

function write(step: number | null) {
  try {
    if (step === null) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, String(step))
  } catch {
    // Sin almacenamiento, el modo presentación dura mientras no se recargue la página.
  }
}

export interface PresentationContextValue {
  /** Paso actual (1 a 9) o null si el modo presentación está desactivado. */
  step: number | null
  setStep: (step: number | null) => void
}

export const PresentationContext = createContext<PresentationContextValue | null>(null)

/** Preferencia de pantalla (no es un dato de la demo): no se borra al restablecerla. */
export function PresentationProvider({ children }: { children: ReactNode }) {
  const [step, setStepState] = useState<number | null>(read)
  const setStep = useCallback((next: number | null) => {
    write(next)
    setStepState(next)
  }, [])
  const value = useMemo(() => ({ step, setStep }), [step, setStep])
  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>
}
