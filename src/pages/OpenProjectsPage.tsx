import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Collapsible } from '../components/common/Collapsible'
import { Modal } from '../components/common/Modal'
import { TextArea } from '../components/forms/Fields'
import { openProjects } from '../services/applicationService'
import { HELP_TYPE_LABELS, INTEREST_STATUS_LABELS } from '../utils/labels'
import { NOTE_MAX, validateNote } from '../utils/applicationValidation'
import { isSafeUrl } from '../utils/url'
import type { Project } from '../types'

function ApplyDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { dispatch } = useDemo()
  const user = useActiveUser()
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | undefined>()

  const submit = () => {
    const found = validateNote(message, false)
    setError(found)
    if (found || !project || !user) return
    dispatch({ type: 'applyToProject', actorId: user.id, projectId: project.id, message })
    setMessage('')
    onClose()
  }

  return (
    <Modal open={project !== null} title="Postularme al proyecto" onClose={onClose}>
      {project && (
        <div className="form">
          <p><strong>{project.title}</strong></p>
          <TextArea label="Mensaje para el docente (opcional)" name="message" value={message} rows={4}
            maxLength={NOTE_MAX + 50} error={error} hint="Contale por qué te interesa y qué podés aportar."
            onChange={setMessage} />
          <div className="dialog-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={submit}>Enviar postulación</button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export function OpenProjectsPage() {
  const { state } = useDemo()
  const user = useActiveUser()
  const [params] = useSearchParams()
  const [target, setTarget] = useState<Project | null>(null)
  useDocumentTitle('Proyectos abiertos')
  if (!user) return null

  if (user.role !== 'student') {
    return (
      <div className="dashboard">
        <h1>Proyectos abiertos</h1>
        <p className="intro">Esta pantalla es para estudiantes.</p>
        <Link className="btn btn-primary" to="/app">Volver al panel</Link>
      </div>
    )
  }

  const profile = state.studentProfiles.find((p) => p.userId === user.id)
  const open = openProjects(state).filter((p) => !p.memberIds.includes(user.id))
  const mine = state.interests.filter((i) => i.studentId === user.id)

  return (
    <div className="dashboard">
      <h1>Proyectos abiertos</h1>
      {params.get('bienvenida') === '1' && (
        <section className="notice big-notice" role="status" aria-label="Perfil creado">
          <h2>¡Listo, {user.name.split(' ')[0]}! Tu perfil quedó creado.</h2>
          <p>Elegí un proyecto y postulate. Un docente revisa las postulaciones y arma los equipos.</p>
        </section>
      )}
      <p className="intro">Proyectos de comercios que ya aprobó un docente y buscan estudiantes.</p>

      {open.length === 0 ? (
        <p className="empty">
          Por ahora no hay proyectos abiertos. Cuando un comercio postule y un docente lo apruebe, va a aparecer acá.
        </p>
      ) : (
        <div className="stack">
          {open.map((p) => {
            const business = state.businesses.find((b) => b.id === p.businessId)
            const app = state.applications.find((a) => a.id === p.applicationId)
            const interest = mine.find((i) => i.projectId === p.id && (i.status === 'pending' || i.status === 'accepted'))
            return (
              <article className="card" key={p.id}>
                <h2 className="card-title">{p.title}</h2>
                <p className="meta">{business?.name} · {business?.activity} · {business?.city}</p>
                <p style={{ marginTop: 8 }}>{p.description}</p>
                {app && (
                  <p className="meta" style={{ marginTop: 8 }}>
                    Ayuda: {app.helpTypes.map((h) => HELP_TYPE_LABELS[h]).join(', ')} · Plazo: {app.timeframe}
                  </p>
                )}
                {business && business.socials.length > 0 && (
                  <p className="meta">
                    Redes:{' '}
                    {business.socials.map((s, i) => (
                      <span key={s.url}>{i > 0 && ' · '}{isSafeUrl(s.url) ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : s.label}</span>
                    ))}
                  </p>
                )}
                <p className="meta">Lugares disponibles: {p.maxMembers - p.memberIds.length} de {p.maxMembers}</p>
                {interest ? (
                  <p className="badge badge-sim" style={{ marginTop: 10 }}>
                    Ya te postulaste · {INTEREST_STATUS_LABELS[interest.status]}
                  </p>
                ) : (
                  <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setTarget(p)}>
                    Postularme a este proyecto
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}

      <Collapsible title={`Mis postulaciones a proyectos (${mine.length})`} openOnMobile={mine.length > 0}>
        {mine.length === 0 ? (
          <p className="empty">Todavía no te postulaste a ningún proyecto.</p>
        ) : (
          <ul className="plain-list">
            {mine.map((i) => (
              <li key={i.id}>
                <strong>{state.projects.find((p) => p.id === i.projectId)?.title}</strong>
                <p className="meta">{INTEREST_STATUS_LABELS[i.status]}{i.message ? ` · "${i.message}"` : ''}</p>
              </li>
            ))}
          </ul>
        )}
      </Collapsible>

      {profile && (
        <Collapsible title="Mi perfil">
          <p className="meta">Año: {profile.year || 'No informado'} · Disponibilidad: {profile.weeklyHours || 'No informada'}</p>
          <p style={{ marginTop: 8 }}><strong>Habilidades:</strong> {[...profile.skills, profile.otherSkills].filter(Boolean).join(', ')}</p>
          {profile.experience && <p className="meta">Experiencia: {profile.experience}</p>}
          {profile.motivation && <p className="meta">Motivación: {profile.motivation}</p>}
          {profile.socials.length > 0 && (
            <p className="meta">
              Redes:{' '}
              {profile.socials.map((s, i) => (
                <span key={s.url}>{i > 0 && ' · '}{isSafeUrl(s.url) ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : s.label}</span>
              ))}
            </p>
          )}
          {profile.simulated && <span className="badge badge-sim">Dato simulado</span>}
        </Collapsible>
      )}

      <ApplyDialog project={target} onClose={() => setTarget(null)} />
    </div>
  )
}
