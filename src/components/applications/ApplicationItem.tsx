import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../../hooks/useDemo'
import { Collapsible } from '../common/Collapsible'
import { CommentSection } from '../common/CommentSection'
import { Stamp } from '../common/Stamp'
import { SimulatedTag } from '../common/Badges'
import { ApplicationTracker } from './ApplicationTracker'
import { TextArea } from '../forms/Fields'
import {
  applicationStage, reviewActionsFor, reviewNoteRequired, type ReviewAction,
} from '../../services/applicationService'
import { projectsForUser } from '../../services/dashboardService'
import {
  APPLICATION_STATUS_ICONS, APPLICATION_STATUS_LABELS, HELP_TYPE_LABELS,
} from '../../utils/labels'
import { NOTE_MAX, validateNote } from '../../utils/applicationValidation'
import { isSafeUrl } from '../../utils/url'
import type { ProjectApplication, User } from '../../types'

const ACTION_LABELS: Record<ReviewAction, string> = {
  start_review: 'Comenzar revisión',
  request_info: 'Pedir más información',
  approve: 'Aprobar y crear proyecto',
  reject: 'No aprobar',
}

function ReviewControls({ app, user }: { app: ProjectApplication; user: User }) {
  const { dispatch } = useDemo()
  const [note, setNote] = useState('')
  const [size, setSize] = useState('3')
  const [error, setError] = useState<string | undefined>()
  const actions = reviewActionsFor(app.status)
  if (actions.length === 0) return null

  const run = (action: ReviewAction) => {
    const found = validateNote(note, reviewNoteRequired(action))
    if (found) {
      setError(reviewNoteRequired(action) ? 'Para esta acción, escribí un mensaje para el comercio.' : found)
      return
    }
    setError(undefined)
    dispatch({ type: 'reviewApplication', actorId: user.id, applicationId: app.id, action, note, maxMembers: Number(size) })
    setNote('')
  }

  const needsNote = actions.some((a) => a !== 'start_review')
  return (
    <div className="review-box">
      {needsNote && (
        <TextArea label="Mensaje para el comercio" name="note" value={note} rows={3} maxLength={NOTE_MAX + 50}
          error={error} hint="Obligatorio para pedir información o no aprobar; opcional al aprobar." onChange={setNote} />
      )}
      {actions.includes('approve') && (
        <label className="field">
          <span>Estudiantes que formarán el equipo</span>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
      <div className="task-actions">
        {actions.map((a) => (
          <button key={a} type="button" className={a === 'approve' || a === 'start_review' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
            onClick={() => run(a)}>
            {ACTION_LABELS[a]}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Una postulación de comercio, vista por el propio comercio o por el docente. */
export function ApplicationItem({ app, user }: { app: ProjectApplication; user: User }) {
  const { state, dispatch } = useDemo()
  const business = state.businesses.find((b) => b.id === app.businessId)
  const stage = applicationStage(state, app)
  const isOwner = user.role === 'business' && app.applicantId === user.id
  const isReviewer = user.role === 'supervisor' || user.role === 'admin'
  const canOpenProject = app.projectId ? projectsForUser(state, user).some((p) => p.id === app.projectId) : false

  return (
    <article className="card application">
      <div className="deliverable-head">
        <h3>{app.projectTitle}</h3>
        <span className={`badge badge-app-${app.status}`}>
          <span aria-hidden="true">{APPLICATION_STATUS_ICONS[app.status]}</span> {APPLICATION_STATUS_LABELS[app.status]}
        </span>
      </div>
      <p className="meta">
        {business?.name}{business?.city ? ` · ${business.city}` : ''}{' '}
        {app.simulated ? <SimulatedTag /> : <>· <Stamp simulated={false} iso={app.createdAt} /></>}
      </p>

      <ApplicationTracker stage={stage} />
      {stage.waitingForBusiness && (
        <p className="notice" role="status">
          {isOwner
            ? 'El docente te pidió más información. Respondé en la conversación para continuar.'
            : 'Esperando la respuesta del comercio.'}
        </p>
      )}
      {stage.stopped && <p className="notice" role="status">La postulación no continuó. Mirá el mensaje del docente en la conversación.</p>}
      {canOpenProject && (
        <Link className="btn btn-outline btn-sm" to={`/app/proyectos/${app.projectId}`}>Ver el proyecto</Link>
      )}

      <Collapsible title="Detalle de la postulación" headingLevel={3} className="sub-panel">
        <p>{app.description}</p>
        {app.expectedResult && <p style={{ marginTop: 8 }}><strong>Resultado esperado:</strong> {app.expectedResult}</p>}
        <p className="meta" style={{ marginTop: 8 }}>
          Ayuda: {app.helpTypes.map((h) => HELP_TYPE_LABELS[h]).join(', ')} · Plazo: {app.timeframe}
          {app.contactHours ? ` · Horario: ${app.contactHours}` : ''}
        </p>
        {business && (
          <>
            <p className="meta" style={{ marginTop: 8 }}>
              Rubro: {business.activity} · A cargo: {business.ownerName} · Teléfono: {business.phone || 'No informado'}
              {business.email ? ` · Correo: ${business.email}` : ''}
            </p>
            {business.currentChannels && <p className="meta">Hoy vende o se muestra en: {business.currentChannels}</p>}
            {business.socials.length > 0 && (
              <p className="meta">
                Redes:{' '}
                {business.socials.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ' · '}
                    {isSafeUrl(s.url) ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : s.label}
                  </span>
                ))}
              </p>
            )}
          </>
        )}
      </Collapsible>

      <Collapsible title={`Conversación (${app.comments.length})`} headingLevel={3} className="sub-panel" openOnMobile={stage.waitingForBusiness}>
        <CommentSection
          comments={app.comments}
          label="Mensajes"
          onAdd={isOwner || isReviewer
            ? (content) => dispatch({ type: 'addApplicationComment', actorId: user.id, applicationId: app.id, content })
            : null}
        />
      </Collapsible>

      {isReviewer && <ReviewControls app={app} user={user} />}
    </article>
  )
}
