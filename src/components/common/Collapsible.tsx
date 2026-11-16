import { createElement, useState } from 'react'
import type { ReactNode } from 'react'

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
}

interface Props {
  title: string
  /** Nivel del encabezado dentro del resumen (2 o 3). */
  headingLevel?: 2 | 3
  /** En pantallas angostas arranca cerrado, salvo que se pida abierto. En escritorio siempre arranca abierto. */
  openOnMobile?: boolean
  className?: string
  children: ReactNode
}

/** Panel plegable con `<details>`: en el celular permite recorrer los títulos sin desplazarse tanto. */
export function Collapsible({ title, headingLevel = 2, openOnMobile = false, className = 'panel', children }: Props) {
  const [open, setOpen] = useState(() => openOnMobile || !isMobile())
  return (
    <details
      className={`${className} collapsible`}
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>{createElement(`h${headingLevel}`, null, title)}</summary>
      <div className="collapsible-body">{children}</div>
    </details>
  )
}
