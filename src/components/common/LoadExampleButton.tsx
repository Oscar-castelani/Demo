import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { createExampleState } from '../../data/demoData'
import { ConfirmDialog } from './ConfirmDialog'

/** Reemplaza lo que haya en la demo por un caso de ejemplo ficticio, con confirmación si hay datos. */
export function LoadExampleButton({ className = 'btn btn-outline btn-sm' }: { className?: string }) {
  const { state, dispatch } = useDemo()
  const [open, setOpen] = useState(false)
  const hasData = state.applications.length > 0 || state.studentProfiles.length > 0

  const load = () => {
    dispatch({ type: 'replace', state: createExampleState() })
    setOpen(false)
  }

  return (
    <>
      <button type="button" className={className} onClick={() => (hasData ? setOpen(true) : load())}>
        Cargar ejemplo
      </button>
      <ConfirmDialog
        open={open}
        title="¿Cargar el caso de ejemplo?"
        message="Se reemplazarán las postulaciones y los datos que cargaste en este navegador por un caso de ejemplo ficticio."
        confirmLabel="Sí, cargar ejemplo"
        onConfirm={load}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
