import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { ReviewBadge } from '../common/Badges'
import { CommentSection } from '../common/CommentSection'
import { Stamp } from '../common/Stamp'
import { Timeline } from '../common/Timeline'
import { entityTimeline } from '../../services/timelineService'
import {
  canCommentOnDeliverable, canReviewDeliverable,
} from '../../services/deliverableService'
import { isStudentMember } from '../../services/taskService'
import { nameOf } from '../../services/dashboardService'
import { validateComment } from '../../utils/validation'
import { isSafeUrl } from '../../utils/url'
import type { Deliverable, Project, User } from '../../types'

interface Props {
  deliverable: Deliverable
  project: Project
  user: User
  onMessage: (text: string) => void
}

export function DeliverableItem({ deliverable: d, project, user, onMessage }: Props) {
  const { state, dispatch } = useDemo()
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState<string | undefined>()

  const task = d.taskId ? state.tasks.find((t) => t.id === d.taskId) : undefined
  const canReview = canReviewDeliverable(state, user, project) && d.reviewStatus === 'pending'
  const canResubmit =
    d.reviewStatus === 'changes_requested' &&
    (user.role === 'admin' || (isStudentMember(user, project) && d.ownerId === user.id))
  const canComment = canCommentOnDeliverable(state, user, project)

  const review = (decision: 'approved' | 'changes_requested') => {
    if (decision === 'changes_requested') {
      const found = validateComment(feedback)
      setError(found ? 'Para solicitar modificaciones, explicá qué hay que cambiar.' : undefined)
      if (found) return
    } else if (feedback.trim() && validateComment(feedback)) {
      setError(validateComment(feedback))
      return
    } else {
      setError(undefined)
    }
    dispatch({ type: 'reviewDeliverable', actorId: user.id, deliverableId: d.id, decision, comment: feedback })
    setFeedback('')
    onMessage(decision === 'approved' ? 'Entregable aprobado.' : 'Se solicitaron modificaciones.')
  }

  return (
    <article className="card deliverable">
      <div className="deliverable-head">
        <h3>{d.title}</h3>
        <ReviewBadge status={d.reviewStatus} />
      </div>
      {d.description && <p>{d.description}</p>}
      <p className="meta">
        {d.resourceType} · Responsable: {nameOf(state, d.ownerId)} · Registrado: <Stamp simulated={d.simulated} iso={d.registeredAt} />
      </p>
      {task && <p className="meta">Tarea vinculada: {task.title}</p>}
      {isSafeUrl(d.url) ? (
        <a href={d.url} target="_blank" rel="noopener noreferrer">Abrir enlace (se abre en otra pestaña)</a>
      ) : (
        <p className="field-error">El enlace guardado no es válido.</p>
      )}

      {canReview && (
        <div className="review-box">
          <label className="field">
            <span>Devolución del emprendimiento</span>
            <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)}
              aria-invalid={!!error} />
            {error && <span className="field-error" role="alert">{error}</span>}
          </label>
          <div className="task-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => review('approved')}>Aprobar</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => review('changes_requested')}>
              Solicitar modificaciones
            </button>
          </div>
        </div>
      )}
      {canResubmit && (
        <div className="task-actions">
          <button type="button" className="btn btn-primary btn-sm"
            onClick={() => {
              dispatch({ type: 'resubmitDeliverable', actorId: user.id, deliverableId: d.id })
              onMessage('Entregable enviado nuevamente a revisión.')
            }}>
            Volver a enviar a revisión
          </button>
        </div>
      )}

      <h4 className="detail-sub">Línea de tiempo ({entityTimeline(d.history, d.comments).length})</h4>
      <Timeline items={entityTimeline(d.history, d.comments)} />
      <CommentSection
        comments={d.comments}
        formOnly
        onAdd={canComment ? (content) => {
          dispatch({ type: 'addDeliverableComment', actorId: user.id, deliverableId: d.id, content })
          onMessage('Comentario agregado.')
        } : null}
      />
    </article>
  )
}
