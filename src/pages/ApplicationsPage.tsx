import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Modal } from '../components/common/Modal'
import { ApplicationItem } from '../components/applications/ApplicationItem'
import { EMPTY_PROJECT_INFO, ProjectInfoFields } from '../components/applications/ProjectInfoFields'
import { APPLICATION_STATUS_LABELS } from '../utils/labels'
import { validateProjectInfo, type Errors, type ProjectInfoValues } from '../utils/applicationValidation'
import { hasErrors } from '../utils/validation'
import type { ApplicationStatus } from '../types'

function SentBanner() {
  return (
    <section className="notice big-notice" role="status" aria-label="Postulación enviada">
      <h2>¡Recibimos tu postulación!</h2>
      <p>Esto es lo que pasa ahora:</p>
      <ol>
        <li>Un docente revisa tu proyecto y puede pedirte más información.</li>
        <li>Si lo aprueba, se abre a los estudiantes que quieran participar.</li>
        <li>El docente arma el equipo y el trabajo empieza.</li>
      </ol>
      <p className="meta">Podés seguir cada etapa acá abajo.</p>
    </section>
  )
}

function AnotherProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useDemo()
  const user = useActiveUser()
  const [values, setValues] = useState<ProjectInfoValues>(EMPTY_PROJECT_INFO)
  const [errors, setErrors] = useState<Errors<ProjectInfoValues>>({})

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validateProjectInfo(values)
    setErrors(found)
    if (hasErrors(found) || !user) return
    dispatch({ type: 'submitAnotherApplication', actorId: user.id, input: values })
    setValues(EMPTY_PROJECT_INFO)
    onClose()
  }

  return (
    <Modal open={open} title="Postular otro proyecto" onClose={onClose}>
      <form onSubmit={submit} noValidate className="form">
        <ProjectInfoFields values={values} errors={errors} onChange={setValues} />
        <div className="dialog-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Enviar postulación</button>
        </div>
      </form>
    </Modal>
  )
}

const FILTERS: { value: 'all' | 'pending' | ApplicationStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Para revisar' },
  { value: 'info_requested', label: APPLICATION_STATUS_LABELS.info_requested },
  { value: 'approved', label: APPLICATION_STATUS_LABELS.approved },
  { value: 'rejected', label: APPLICATION_STATUS_LABELS.rejected },
]

export function ApplicationsPage() {
  const { state } = useDemo()
  const user = useActiveUser()
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('all')
  const [open, setOpen] = useState(false)
  const reviewer = user?.role === 'supervisor' || user?.role === 'admin'
  useDocumentTitle(reviewer ? 'Postulaciones de comercios' : 'Mis postulaciones')
  if (!user) return null

  if (user.role === 'student') {
    return (
      <div className="dashboard">
        <h1>Postulaciones de comercios</h1>
        <p className="intro">Esta pantalla es para comercios y docentes. Mirá los proyectos abiertos para postularte.</p>
        <Link className="btn btn-primary" to="/app/abiertos">Ver proyectos abiertos</Link>
      </div>
    )
  }

  const own = state.applications.filter((a) => (reviewer ? true : a.applicantId === user.id))
  const visible = own.filter((a) =>
    filter === 'all' ? true : filter === 'pending' ? a.status === 'received' || a.status === 'in_review' : a.status === filter,
  )

  return (
    <div className="dashboard">
      <h1>{reviewer ? 'Postulaciones de comercios' : 'Mis postulaciones'}</h1>
      <p className="intro">
        {reviewer
          ? 'Revisá los proyectos que presentan los comercios: aprobalos, pedí más información o no los apruebes.'
          : 'Seguí el estado de tus proyectos y conversá con el docente.'}
      </p>
      {params.get('enviada') === '1' && !reviewer && <SentBanner />}

      {reviewer ? (
        <label className="field filter-field">
          <span>Mostrar</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            {FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </label>
      ) : (
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>Postular otro proyecto</button>
      )}

      {visible.length === 0 ? (
        <p className="empty" style={{ marginTop: 20 }}>
          {reviewer ? 'No hay postulaciones para mostrar. Cuando un comercio se postule, la vas a ver acá.' : 'Todavía no postulaste ningún proyecto.'}
        </p>
      ) : (
        <div className="stack" style={{ marginTop: 20 }}>
          {visible.map((a) => <ApplicationItem key={a.id} app={a} user={user} />)}
        </div>
      )}
      {!reviewer && <AnotherProjectDialog open={open} onClose={() => setOpen(false)} />}
    </div>
  )
}
