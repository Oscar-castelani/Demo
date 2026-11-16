import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { PresentationContext } from '../context/PresentationContext'
import type { PresentationContextValue } from '../context/PresentationContext'
import { PRESENTATION_STEPS } from '../data/presentationSteps'
import { scenarioForStep } from '../data/scenarios'
import { useDemo } from './useDemo'

export function usePresentation(): PresentationContextValue {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentation debe usarse dentro de <PresentationProvider>')
  return ctx
}

/**
 * Acciones del modo presentación: cargar el escenario de un paso, dejar activa a la persona ficticia
 * que corresponde y llevar a la pantalla del paso.
 */
export function usePresentationActions() {
  const { setStep } = usePresentation()
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()

  /** Carga el escenario del paso (reemplaza los datos) y va a su pantalla. */
  const goTo = useCallback(
    (n: number) => {
      const step = PRESENTATION_STEPS.find((s) => s.n === n)
      const scenario = scenarioForStep(n)
      if (!step || !scenario) return
      const built = scenario.build()
      const user = step.userName ? built.users.find((u) => u.name === step.userName) : undefined
      // En los pasos con formulario público no hay persona que actúe. Se deja activo al docente de
      // demostración (que existe siempre) para que la pantalla protegida de la que se viene no redirija
      // al ingreso mientras se navega al formulario.
      const active = user?.id ?? built.users.find((u) => u.id === 'u-docente')?.id ?? null
      setStep(n)
      dispatch({ type: 'replace', state: { ...built, activeUserId: active } })
      navigate(step.route(built))
    },
    [dispatch, navigate, setStep],
  )

  /** Va a la pantalla del paso con la persona que corresponde, sin cambiar los datos. */
  const showScreen = useCallback(
    (n: number) => {
      const step = PRESENTATION_STEPS.find((s) => s.n === n)
      if (!step) return
      const user = step.userName ? state.users.find((u) => u.name === step.userName) : undefined
      if (user) dispatch({ type: 'setActiveUser', userId: user.id })
      navigate(step.route(state))
    },
    [dispatch, navigate, state],
  )

  return { goTo, showScreen, exit: () => setStep(null) }
}
