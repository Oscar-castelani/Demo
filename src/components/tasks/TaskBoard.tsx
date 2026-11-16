import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { StatusBadge } from '../common/Badges'
import { TaskDetailDialog } from './TaskDetailDialog'
import { TaskFormDialog } from './TaskFormDialog'
import { DeliverableFormDialog } from '../deliverables/DeliverableFormDialog'
import { TASK_STATUSES, nameOf } from '../../services/dashboardService'
import { canCreateTask } from '../../services/taskService'
import { TASK_STATUS_ICONS, TASK_STATUS_LABELS } from '../../utils/labels'
import type { Project, Task, User } from '../../types'
import type { DeliverableFormValues, TaskFormValues } from '../../utils/validation'

interface Props {
  project: Project
  user: User
  /** Tarea que se abre al entrar (por ejemplo, desde el panel de supervisión). */
  initialTaskId?: string | null
}

export function TaskBoard({ project, user, initialTaskId = null }: Props) {
  const { state, dispatch } = useDemo()
  const [selectedId, setSelectedId] = useState<string | null>(initialTaskId)
  const [formMode, setFormMode] = useState<'closed' | 'create' | 'edit' | 'attach'>('closed')
  const [message, setMessage] = useState('')

  const tasks = state.tasks.filter((t) => t.projectId === project.id)
  const selected = tasks.find((t) => t.id === selectedId) ?? null
  const members = state.users.filter((u) => project.memberIds.includes(u.id))

  const submitDeliverable = (values: DeliverableFormValues) => {
    dispatch({ type: 'registerDeliverable', actorId: user.id, input: { ...values, projectId: project.id } })
    setMessage('Enlace registrado y vinculado a la tarea.')
    setFormMode('closed')
  }

  const submit = (values: TaskFormValues) => {
    if (formMode === 'create') {
      dispatch({ type: 'createTask', actorId: user.id, input: { ...values, projectId: project.id } })
      setMessage('Tarea creada en Pendiente.')
    } else if (selected) {
      dispatch({ type: 'updateTask', actorId: user.id, taskId: selected.id, patch: values })
      setMessage('Tarea actualizada.')
    }
    setFormMode('closed')
  }

  return (
    <div>
      <h2 className="visually-hidden">Tablero de tareas</h2>
      <div className="board-head">
        <p className="meta" role="status" aria-live="polite">{message}</p>
        {canCreateTask(user, project) && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormMode('create')}>
            Nueva tarea
          </button>
        )}
      </div>

      <p className="board-hint">Deslizá hacia los costados para ver todas las columnas.</p>
      <div className="board">
        {TASK_STATUSES.map((status) => {
          const column = tasks.filter((t) => t.status === status)
          return (
            <section className="column" key={status} aria-label={`Columna ${TASK_STATUS_LABELS[status]}`}>
              <h3>
                <span aria-hidden="true">{TASK_STATUS_ICONS[status]}</span> {TASK_STATUS_LABELS[status]}
                <span className="count">{column.length}</span>
              </h3>
              {column.length === 0 ? (
                <p className="empty">Sin tareas.</p>
              ) : (
                <ul className="plain-list">
                  {column.map((t) => <TaskCard key={t.id} task={t} state={state} links={state.deliverables.filter((d) => d.taskId === t.id).length} onOpen={() => setSelectedId(t.id)} />)}
                </ul>
              )}
            </section>
          )
        })}
      </div>

      <TaskDetailDialog
        state={state}
        user={user}
        project={project}
        task={formMode === 'closed' ? selected : null}
        onClose={() => setSelectedId(null)}
        onEdit={() => setFormMode('edit')}
        onComment={(content) => {
          if (!selected) return
          dispatch({ type: 'addTaskComment', actorId: user.id, taskId: selected.id, content })
          setMessage('Comentario agregado.')
        }}
        onAttach={() => setFormMode('attach')}
        onStatus={(status, observation) => {
          if (!selected) return
          dispatch({ type: 'changeTaskStatus', actorId: user.id, taskId: selected.id, status, observation })
          setMessage(`Estado actualizado: ${TASK_STATUS_LABELS[status]}.`)
        }}
      />
      <DeliverableFormDialog
        open={formMode === 'attach'}
        tasks={tasks}
        presetTaskId={selected?.id ?? null}
        onSubmit={submitDeliverable}
        onClose={() => setFormMode('closed')}
      />
      <TaskFormDialog
        open={formMode === 'create' || formMode === 'edit'}
        task={formMode === 'edit' ? selected ?? undefined : undefined}
        members={members}
        onSubmit={submit}
        onClose={() => setFormMode('closed')}
      />
    </div>
  )
}

function TaskCard({ task, state, links, onOpen }: { task: Task; state: ReturnType<typeof useDemo>['state']; links: number; onOpen: () => void }) {
  return (
    <li className="task-li">
      <button type="button" className="task-card" onClick={onOpen}>
        <strong>{task.title}</strong>
        <span className="meta">Responsable: {nameOf(state, task.assigneeId)}</span>
        <span className="task-card-foot">
          <StatusBadge status={task.status} />
          {task.dueDate && <span className="meta">Límite: {task.dueDate}</span>}
          {links > 0 && <span className="meta">Entregables: {links}</span>}
          {task.comments.length > 0 && <span className="meta">Comentarios: {task.comments.length}</span>}
        </span>
      </button>
    </li>
  )
}
