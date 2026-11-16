import { useDemo } from '../../hooks/useDemo'

export function WarningBanner() {
  const { warning, dismissWarning } = useDemo()
  if (!warning) return null
  return (
    <div className="warning" role="alert">
      <span>{warning}</span>
      <button type="button" className="btn btn-outline btn-sm" onClick={dismissWarning}>Cerrar</button>
    </div>
  )
}
