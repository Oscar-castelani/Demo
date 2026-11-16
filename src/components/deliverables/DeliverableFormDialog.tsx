import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../common/Modal'
import type { Task } from '../../types'
import {
  DESCRIPTION_MAX, RESOURCE_TYPES, TITLE_MAX, hasErrors, validateDeliverableInput,
  type DeliverableFormErrors, type DeliverableFormValues,
} from '../../utils/validation'

interface Props {
  open: boolean
  tasks: Task[]
  /** Tarea preseleccionada (por ejemplo, al adjuntar desde el detalle de una tarea). */
  presetTaskId?: string | null
  onSubmit: (values: DeliverableFormValues) => void
  onClose: () => void
}

function DeliverableForm({ tasks, presetTaskId, onSubmit, onClose }: Omit<Props, 'open'>) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [resourceType, setResourceType] = useState<string>(RESOURCE_TYPES[0])
  const [url, setUrl] = useState('')
  const [taskId, setTaskId] = useState(presetTaskId ?? '')
  const [errors, setErrors] = useState<DeliverableFormErrors>({})

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validateDeliverableInput({ title, description, url })
    setErrors(found)
    if (hasErrors(found)) {
      const first = (['title', 'description', 'url'] as const).find((k) => found[k])
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    onSubmit({ title, description, resourceType, url: url.trim(), taskId: taskId || null })
  }

  return (
    <form onSubmit={submit} noValidate className="form">
      <label className="field">
        <span>Título *</span>
        <input name="title" value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title} aria-describedby={errors.title ? 'dl-err-title' : undefined} />
        {errors.title && <span id="dl-err-title" className="field-error" role="alert">{errors.title}</span>}
      </label>
      <label className="field">
        <span>Descripción</span>
        <textarea name="description" rows={3} value={description} maxLength={DESCRIPTION_MAX + 50}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description} aria-describedby={errors.description ? 'dl-err-desc' : undefined} />
        {errors.description && <span id="dl-err-desc" className="field-error" role="alert">{errors.description}</span>}
      </label>
      <label className="field">
        <span>Tipo de recurso</span>
        <select name="resourceType" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
          {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Enlace al recurso *</span>
        <input name="url" type="url" inputMode="url" placeholder="https://" value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={!!errors.url} aria-describedby={errors.url ? 'dl-err-url' : undefined} />
        {errors.url && <span id="dl-err-url" className="field-error" role="alert">{errors.url}</span>}
      </label>
      <label className="field">
        <span>Tarea vinculada (opcional)</span>
        <select name="taskId" value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">Entregable del proyecto (sin tarea)</option>
          {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </label>
      <p className="meta">Solo se guardan enlaces: la demo no almacena archivos.</p>
      <div className="dialog-actions">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Registrar entregable</button>
      </div>
    </form>
  )
}

export function DeliverableFormDialog({ open, tasks, presetTaskId, onSubmit, onClose }: Props) {
  return (
    <Modal open={open} title="Registrar entregable" onClose={onClose}>
      <DeliverableForm tasks={tasks} presetTaskId={presetTaskId} onSubmit={onSubmit} onClose={onClose} />
    </Modal>
  )
}
