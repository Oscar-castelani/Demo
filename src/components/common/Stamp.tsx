import { SimulatedTag } from './Badges'

/**
 * Fecha y hora de un registro. Los datos simulados no muestran fecha (no son hechos históricos):
 * solo la etiqueta "Dato simulado".
 */
export function Stamp({ simulated, iso }: { simulated: boolean; iso: string }) {
  if (simulated) return <SimulatedTag />
  const date = new Date(iso)
  const text = date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
  return <time dateTime={iso}>{text}</time>
}
