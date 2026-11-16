import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Diálogo modal nativo. El contenido solo se monta mientras está abierto, así los formularios arrancan limpios. */
export function Modal({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const closedByCode = useRef(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) {
      // El evento "close" de un cierre hecho por código no debe avisar como si la persona hubiera cerrado.
      closedByCode.current = true
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="dialog dialog-wide"
      aria-labelledby={titleId}
      onClose={() => {
        if (closedByCode.current) {
          closedByCode.current = false
          return
        }
        onClose()
      }}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
    >
      {open && (
        <>
          <div className="dialog-head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cerrar</button>
          </div>
          {children}
        </>
      )}
    </dialog>
  )
}
