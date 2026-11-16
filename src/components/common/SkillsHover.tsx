import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'

const MAX_SHOWN = 4

interface Props {
  name: string
  skills: string[]
  /** Dato extra para mostrar debajo de las habilidades (por ejemplo, año y disponibilidad). */
  detail?: string
}

/**
 * Nombre de una persona que muestra sus habilidades principales al pasar el mouse, al enfocarlo con el
 * teclado o al tocarlo en el celular. Escape lo cierra. El contenido también se anuncia a los lectores de pantalla.
 */
export function SkillsHover({ name, skills, detail }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const shown = skills.slice(0, MAX_SHOWN)
  const rest = skills.length - shown.length

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <span className="skills-hover" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="name-trigger"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKey}
      >
        {name}
      </button>
      <span role="tooltip" id={id} className="skills-pop" hidden={!open}>
        <strong>Habilidades principales</strong>
        {shown.length === 0 ? (
          <span className="meta">Sin habilidades cargadas.</span>
        ) : (
          <span className="chips" aria-hidden="false">
            {shown.map((s) => <span key={s} className="chip">{s}</span>)}
            {rest > 0 && <span className="chip chip-more">+{rest} más</span>}
          </span>
        )}
        {detail && <span className="meta">{detail}</span>}
      </span>
    </span>
  )
}
