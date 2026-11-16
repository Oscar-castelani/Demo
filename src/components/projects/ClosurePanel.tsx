import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { ReviewBadge, SimulatedTag } from '../common/Badges'
import {
  canChangeProjectStatus, canEditClosureField, closeBlocker,
} from '../../services/closureService'
import { progressPercent, tasksOfProjects } from '../../services/dashboardService'
import { FULFILLMENT_LABELS, PROJECT_STATUS_LABELS } from '../../utils/labels'
import { CLOSURE_TEXT_MAX, validateClosureText } from '../../utils/validation'
import { isSafeUrl } from '../../utils/url'
import type { ClosureField, Fulfillment, Project, User } from '../../types'

interface FieldProps {
  project: Project
  user: User
  field: ClosureField
  title: string
  hint: string
  onMessage: (text: string) => void
}

function ClosureField({ project, user, field, title, hint, onMessage }: FieldProps) {
  const { state, dispatch } = useDemo()
  const closure = project.closure
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | undefined>()

  const editable = canEditClosureField(state, user, project, field)
  const simulated = closure?.simulatedFields.includes(field) ?? false
  const current = field === 'fulfillment' ? closure?.fulfillment ?? 'partial' : (closure?.[field] ?? '')

  const start = () => {
    setDraft(String(current))
    setError(undefined)
    setEditing(true)
  }

  const save = () => {
    if (field !== 'fulfillment') {
      const found = validateClosureText(draft)
      if (found) {
        setError(found)
        return
      }
    }
    dispatch({ type: 'updateClosureField', actorId: user.id, projectId: project.id, field, value: draft })
    setEditing(false)
    onMessage(`Se guardó: ${title}.`)
  }

  return (
    <section className="panel" aria-label={title}>
      <h2>{title} {simulated && <SimulatedTag />}</h2>
      {!editing ? (
        <>
          {field === 'fulfillment' ? (
            <p><strong>{closure ? FULFILLMENT_LABELS[closure.fulfillment] : 'Sin registrar'}</strong></p>
          ) : (
            <p>{String(current) || 'Todavía no se registró.'}</p>
          )}
          {editable && (
            <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={start}>
              {current ? 'Editar' : 'Registrar'}
            </button>
          )}
          {!editable && <p className="meta">{hint}</p>}
        </>
      ) : (
        <div className="form">
          {field === 'fulfillment' ? (
            <label className="field">
              <span>Estado de cumplimiento</span>
              <select value={draft} onChange={(e) => setDraft(e.target.value)}>
                {(Object.keys(FULFILLMENT_LABELS) as Fulfillment[]).map((f) => (
                  <option key={f} value={f}>{FULFILLMENT_LABELS[f]}</option>
                ))}
              </select>
            </label>
          ) : (
            <label className="field">
              <span>{title}</span>
              <textarea rows={5} value={draft} maxLength={CLOSURE_TEXT_MAX + 100} onChange={(e) => setDraft(e.target.value)}
                aria-invalid={!!error} />
              {error && <span className="field-error" role="alert">{error}</span>}
            </label>
          )}
          <div className="task-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={save}>Guardar</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  )
}

export function ClosurePanel({ project, user }: { project: Project; user: User }) {
  const { state, dispatch } = useDemo()
  const [message, setMessage] = useState('')

  const tasks = tasksOfProjects(state, [project])
  const done = tasks.filter((t) => t.status === 'done').length
  const deliverables = state.deliverables.filter((d) => d.projectId === project.id)
  const blocker = closeBlocker(state, project)
  const canToggle = canChangeProjectStatus(user, project)

  const toggle = () => {
    const status = project.status === 'closed' ? 'active' : 'closed'
    dispatch({ type: 'setProjectStatus', actorId: user.id, projectId: project.id, status })
    setMessage(status === 'closed' ? 'Proyecto cerrado.' : 'Proyecto reabierto.')
  }

  return (
    <div>
      <p className="meta" role="status" aria-live="polite">{message}</p>

      <section className="panel" aria-label="Estado del proyecto">
        <h2>Estado del proyecto</h2>
        <p><span className="badge badge-project">{PROJECT_STATUS_LABELS[project.status]}</span></p>
        {canToggle && (
          <>
            <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}
              disabled={project.status === 'active' && blocker !== null} onClick={toggle}>
              {project.status === 'closed' ? 'Reabrir proyecto' : 'Cerrar proyecto'}
            </button>
            {project.status === 'active' && blocker && <p className="meta">{blocker}</p>}
          </>
        )}
      </section>

      <section className="panel" aria-label="Resumen de objetivos">
        <h2>Resumen de objetivos</h2>
        <p>{project.objective}</p>
        <p className="meta">
          Tareas finalizadas: {done} de {tasks.length} ({progressPercent(tasks)} %)
        </p>
      </section>

      <section className="panel" aria-label="Entregables finales">
        <h2>Entregables finales</h2>
        {deliverables.length === 0 ? (
          <p className="empty">Todavía no hay entregables.</p>
        ) : (
          <ul className="plain-list">
            {deliverables.map((d) => (
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
      </section>

      <ClosureField project={project} user={user} field="fulfillment" title="Estado de cumplimiento"
        hint="Lo registra el supervisor docente." onMessage={setMessage} />
      <ClosureField project={project} user={user} field="businessFeedback" title="Devolución del emprendimiento"
        hint="La registra el emprendimiento." onMessage={setMessage} />
      <ClosureField project={project} user={user} field="supervisorNotes" title="Observaciones del supervisor"
        hint="Las registra el supervisor docente." onMessage={setMessage} />
      <ClosureField project={project} user={user} field="teamReflection" title="Reflexión del equipo"
        hint="La registra el equipo de estudiantes." onMessage={setMessage} />
    </div>
  )
}
