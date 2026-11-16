import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../common/Modal'
import type { Task, User } from '../../types'
import {
  DESCRIPTION_MAX, TITLE_MAX, hasErrors, validateTaskInput,
  type TaskFormErrors, type TaskFormValues,
} from '../../utils/validation'

interface Props {
  open: boolean
  /** Si hay tarea, el formulario edita; si no, crea. */
  task?: Task
  members: User[]
  onSubmit: (values: TaskFormValues) => void
  onClose: () => void
}

function TaskForm({ task, members, onSubmit, onClose }: Omit<Props, 'open'>) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [errors, setErrors] = useState<TaskFormErrors>({})

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validateTaskInput({ title, description, dueDate })
    setErrors(found)
    if (hasErrors(found)) {
      const first = (['title', 'description', 'dueDate'] as const).find((k) => found[k])
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    onSubmit({ title, description, assigneeId: assigneeId || null, dueDate: dueDate || undefined })
  }

  return (
    <form onSubmit={submit} noValidate className="form">
      <label className="field">
        <span>Título *</span>
        <input
          name="title" value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title} aria-describedby={errors.title ? 'err-title' : undefined}
        />
        {errors.title && <span id="err-title" className="field-error" role="alert">{errors.title}</span>}
      </label>
      <label className="field">
        <span>Descripción</span>
        <textarea
          name="description" rows={4} value={description} maxLength={DESCRIPTION_MAX + 50}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description} aria-describedby={errors.description ? 'err-desc' : undefined}
        />
        {errors.description && <span id="err-desc" className="field-error" role="alert">{errors.description}</span>}
      </label>
      <label className="field">
        <span>Responsable</span>
        <select name="assigneeId" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Sin asignar</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Fecha límite (opcional)</span>
        <input
          name="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
          aria-invalid={!!errors.dueDate} aria-describedby={errors.dueDate ? 'err-due' : undefined}
        />
        {errors.dueDate && <span id="err-due" className="field-error" role="alert">{errors.dueDate}</span>}
      </label>
      <div className="dialog-actions">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{task ? 'Guardar cambios' : 'Crear tarea'}</button>
      </div>
    </form>
  )
}

export function TaskFormDialog({ open, task, members, onSubmit, onClose }: Props) {
  return (
    <Modal open={open} title={task ? 'Editar tarea' : 'Nueva tarea'} onClose={onClose}>
      <TaskForm task={task} members={members} onSubmit={onSubmit} onClose={onClose} />
    </Modal>
  )
}
