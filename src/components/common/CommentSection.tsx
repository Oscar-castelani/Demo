import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Stamp } from './Stamp'
import { COMMENT_MAX, validateComment } from '../../utils/validation'
import { ROLE_LABELS } from '../../utils/labels'
import type { Comment } from '../../types'

interface Props {
  comments: Comment[]
  /** Si es null, la persona puede leer pero no comentar. */
  onAdd: ((content: string) => void) | null
  label?: string
  /** Solo el formulario: los comentarios ya se muestran en una línea de tiempo. */
  formOnly?: boolean
  /** Lleva la vista y el foco al campo al mostrarse (por ejemplo, cuando la guía pide responder). */
  focusOnMount?: boolean
}

export function CommentSection({ comments, onAdd, label = 'Comentarios', formOnly = false, focusOnMount = false }: Props) {
  const [text, setText] = useState('')
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!focusOnMount) return
    const t = setTimeout(() => {
      fieldRef.current?.scrollIntoView({ block: 'center' })
      fieldRef.current?.focus({ preventScroll: true })
    }, 150) // después de que RouteFocus lleve el foco al título
    return () => clearTimeout(t)
  }, [focusOnMount])
  const [error, setError] = useState<string | undefined>()
  const errId = useId()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateComment(text)
    setError(found)
    if (found || !onAdd) return
    onAdd(text)
    setText('')
  }

  return (
    <div className="comments">
      {!formOnly && <h3 className="detail-sub">{label} ({comments.length})</h3>}
      {formOnly ? null : comments.length === 0 ? (
        <p className="empty">Todavía no hay comentarios.</p>
      ) : (
        <ul className="plain-list">
          {comments.map((c) => (
            <li key={c.id}>
              <p>{c.content}</p>
              <p className="meta">
                {c.authorName} ({ROLE_LABELS[c.authorRole]}) · <Stamp simulated={c.simulated} iso={c.createdAt} />
              </p>
            </li>
          ))}
        </ul>
      )}
      {onAdd && (
        <form onSubmit={submit} noValidate className="form comment-form">
          <label className="field">
            <span>Agregar comentario</span>
            <textarea
              ref={fieldRef} rows={3} value={text} maxLength={COMMENT_MAX + 50} onChange={(e) => setText(e.target.value)}
              aria-invalid={!!error} aria-describedby={error ? errId : undefined}
            />
            {error && <span id={errId} className="field-error" role="alert">{error}</span>}
          </label>
          <button type="submit" className="btn btn-outline btn-sm">Comentar</button>
        </form>
      )}
    </div>
  )
}
