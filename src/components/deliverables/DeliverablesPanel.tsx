import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { DeliverableFormDialog } from './DeliverableFormDialog'
import { DeliverableItem } from './DeliverableItem'
import { canRegisterDeliverable } from '../../services/deliverableService'
import type { Project, User } from '../../types'
import type { DeliverableFormValues } from '../../utils/validation'

export function DeliverablesPanel({ project, user }: { project: Project; user: User }) {
  const { state, dispatch } = useDemo()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const deliverables = state.deliverables.filter((d) => d.projectId === project.id)
  const tasks = state.tasks.filter((t) => t.projectId === project.id)

  const submit = (values: DeliverableFormValues) => {
    dispatch({ type: 'registerDeliverable', actorId: user.id, input: { ...values, projectId: project.id } })
    setMessage('Entregable registrado. Queda pendiente de revisión.')
    setOpen(false)
  }

  return (
    <div>
      <h2 className="visually-hidden">Entregables del proyecto</h2>
      <div className="board-head">
        <p className="meta" role="status" aria-live="polite">{message}</p>
        {canRegisterDeliverable(user, project) && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            Registrar entregable
          </button>
        )}
      </div>
      {deliverables.length === 0 ? (
        <p className="empty">Todavía no hay entregables registrados.</p>
      ) : (
        <div className="stack">
          {deliverables.map((d) => (
            <DeliverableItem key={d.id} deliverable={d} project={project} user={user} onMessage={setMessage} />
          ))}
        </div>
      )}
      <DeliverableFormDialog open={open} tasks={tasks} onSubmit={submit} onClose={() => setOpen(false)} />
    </div>
  )
}
