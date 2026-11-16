import { useState } from 'react'
import { Modal } from '../common/Modal'
import { StatusBadge, ReviewBadge } from '../common/Badges'
import { CommentSection } from '../common/CommentSection'
import { Stamp } from '../common/Stamp'
import {
  allowedStatuses, canCommentOnTask, canEditTask, observationRequired, transitionLabel,
} from '../../services/taskService'
import { validateComment } from '../../utils/validation'
import { canRegisterDeliverable } from '../../services/deliverableService'
import { nameOf } from '../../services/dashboardService'
import { ROLE_LABELS } from '../../utils/labels'
import { isSafeUrl } from '../../utils/url'
import type { DemoState, Project, Task, TaskStatus, User } from '../../types'

interface Props {
  state: DemoState
  user: User
  project: Project
  task: Task | null
  onClose: () => void
  onEdit: () => void
  onStatus: (status: TaskStatus, observation?: string) => void
  onComment: (content: string) => void
  onAttach: () => void
}

interface ActionsProps {
  task: Task
  user: User
  moves: TaskStatus[]
  canEdit: boolean
  onStatus: (status: TaskStatus, observation?: string) => void
  onEdit: () => void
}

function TaskActions({ task, user, moves, canEdit, onStatus, onEdit }: ActionsProps) {
  const [observation, setObservation] = useState('')
  const [error, setError] = useState<string | undefined>()
  const isSupervisor = user.role === 'supervisor'

  const go = (status: TaskStatus) => {
    const invalid = validateComment(observation)
    if (observationRequired(user, status) && invalid) {
      setError('Para solicitar correcciones, escribí una observación para el equipo.')
      return
    }
    if (observation.trim() && invalid) {
      setError(invalid)
      return
    }
    setError(undefined)
    onStatus(status, isSupervisor ? observation : undefined)
    setObservation('')
  }

  return (
    <>
      {isSupervisor && moves.length > 0 && (
        <label className="field" style={{ marginBottom: 12 }}>
          <span>Observación para el equipo</span>
          <textarea rows={3} value={observation} onChange={(e) => setObservation(e.target.value)} aria-invalid={!!error} />
          {error && <span className="field-error" role="alert">{error}</span>}
        </label>
      )}
      <div className="task-actions">
        {moves.map((s) => (
          <button key={s} type="button" className="btn btn-primary btn-sm" onClick={() => go(s)}>
            {transitionLabel(user, task.status, s)}
          </button>
        ))}
        {canEdit && <button type="button" className="btn btn-outline btn-sm" onClick={onEdit}>Editar tarea</button>}
      </div>
    </>
  )
}

export function TaskDetailDialog({ state, user, project, task, onClose, onEdit, onStatus, onComment, onAttach }: Props) {
  const moves = task ? allowedStatuses(user, task, project) : []
  const canEdit = task ? canEditTask(user, project) : false
  const links = task ? state.deliverables.filter((d) => d.taskId === task.id) : []

  return (
    <Modal open={task !== null} title={task?.title ?? ''} onClose={onClose}>
      {task && (
        <div className="task-detail">
          <dl className="detail-list">
            <div><dt>Estado</dt><dd><StatusBadge status={task.status} /></dd></div>
            <div><dt>Responsable</dt><dd>{nameOf(state, task.assigneeId)}</dd></div>
            {task.dueDate && <div><dt>Fecha límite</dt><dd>{task.dueDate}</dd></div>}
            <div><dt>Descripción</dt><dd>{task.description || 'Sin descripción.'}</dd></div>
          </dl>

          {(moves.length > 0 || canEdit) && (
            <TaskActions task={task} user={user} moves={moves} canEdit={canEdit} onStatus={onStatus} onEdit={onEdit} />
          )}
          {moves.length === 0 && !canEdit && (
            <p className="meta">Tu rol no puede modificar esta tarea. Solo podés consultarla.</p>
          )}

          <h3 className="detail-sub">Enlaces y entregables ({links.length})</h3>
          {links.length === 0 ? (
            <p className="empty">No hay enlaces vinculados a esta tarea.</p>
          ) : (
            <ul className="plain-list">
              {links.map((d) => (
                <li key={d.id}>
                  <strong>{d.title}</strong> <ReviewBadge status={d.reviewStatus} />
                  <p className="meta">{d.resourceType}</p>
                  {isSafeUrl(d.url) && (
                    <a href={d.url} target="_blank" rel="noopener noreferrer">Abrir enlace (se abre en otra pestaña)</a>
                  )}
                </li>
              ))}
            </ul>
          )}
          {canRegisterDeliverable(user, project) && (
            <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={onAttach}>
              Adjuntar enlace
            </button>
          )}

          <CommentSection
            comments={task.comments}
            onAdd={canCommentOnTask(user, project) ? onComment : null}
          />

          <h3 className="detail-sub">Historial de cambios</h3>
          {task.history.length === 0 ? (
            <p className="empty">Todavía no hay cambios registrados.</p>
          ) : (
            <ul className="plain-list">
              {[...task.history].reverse().map((h) => (
                <li key={h.id}>
                  {h.actorName} ({ROLE_LABELS[h.actorRole]}): {h.action} · <Stamp simulated={h.simulated} iso={h.createdAt} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  )
}
