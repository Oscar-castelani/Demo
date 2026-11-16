import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Collapsible } from '../components/common/Collapsible'
import { StudentProfileSummary } from '../components/teams/StudentProfileSummary'
import { nameOf, projectsForUser } from '../services/dashboardService'
import { MAX_TEAM_SIZE, canManageTeam, spotsLeft } from '../services/teamService'
import { INTEREST_STATUS_LABELS, PROJECT_STATUS_LABELS, SKILLS } from '../utils/labels'
import type { Project, User } from '../types'

function hasSkill(skill: string, skills: string[]): boolean {
  return skill === '' || skills.includes(skill)
}

function ProjectTeam({ project, user, skill }: { project: Project; user: User; skill: string }) {
  const { state, dispatch } = useDemo()
  const [message, setMessage] = useState('')
  const manage = canManageTeam(user, project)
  const business = state.businesses.find((b) => b.id === project.businessId)
  const profileOf = (id: string) => state.studentProfiles.find((p) => p.userId === id)
  const skillsOf = (id: string) => [...(profileOf(id)?.skills ?? []), ...(profileOf(id)?.otherSkills ? [profileOf(id)!.otherSkills] : [])]

  const pending = state.interests.filter((i) => i.projectId === project.id && i.status === 'pending' && hasSkill(skill, skillsOf(i.studentId)))
  const pendingAll = state.interests.filter((i) => i.projectId === project.id && i.status === 'pending').length
  const available = state.users.filter(
    (u) => u.role === 'student' && !project.memberIds.includes(u.id) && hasSkill(skill, skillsOf(u.id)),
  )
  const full = spotsLeft(project) <= 0
  const active = project.status === 'active'
  const send = (text: string, action: Parameters<typeof dispatch>[0]) => {
    dispatch(action)
    setMessage(text)
  }

  return (
    <section className="supervision" aria-label={project.title}>
      <h2 className="project-title">{project.title}</h2>
      <p className="meta">
        <span className="badge badge-project">{PROJECT_STATUS_LABELS[project.status]}</span>{' '}
        {business?.name} · Lugares ocupados: {project.memberIds.length} de {project.maxMembers} ·{' '}
        <Link to={`/app/proyectos/${project.id}`}>Abrir el proyecto</Link> ·{' '}
        <Link to={`/app/proyectos/${project.id}?tab=board`}>Tablero</Link>
      </p>
      <p className="meta" role="status" aria-live="polite">{message}</p>

      {manage && (
        <label className="field" style={{ maxWidth: 260, marginTop: 8 }}>
          <span>Lugares del equipo</span>
          <select value={project.maxMembers}
            onChange={(e) => send('Lugares actualizados.', { type: 'setMaxMembers', actorId: user.id, projectId: project.id, size: Number(e.target.value) })}>
            {Array.from({ length: MAX_TEAM_SIZE }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} disabled={n < project.memberIds.length}>{n}</option>
            ))}
          </select>
        </label>
      )}

      {/* Las postulaciones pendientes van primero: son lo que el docente tiene que atender. */}
      <Collapsible title={`Postulaciones de estudiantes (${pending.length}${skill ? ` de ${pendingAll}` : ''})`} headingLevel={3} openOnMobile={pending.length > 0}>
        {pending.length === 0 ? (
          <p className="empty">No hay postulaciones pendientes{skill ? ' con esa habilidad' : ''}.</p>
        ) : (
          <ul className="plain-list">
            {pending.map((i) => (
              <li key={i.id}>
                <strong>{nameOf(state, i.studentId)}</strong>
                {i.message && <p>"{i.message}"</p>}
                <StudentProfileSummary profile={profileOf(i.studentId)} />
                {manage && (
                  <div className="task-actions">
                    <button type="button" className="btn btn-primary btn-sm" disabled={full || !active}
                      onClick={() => send(`${nameOf(state, i.studentId)} se sumó al equipo.`, { type: 'respondToInterest', actorId: user.id, interestId: i.id, decision: 'accepted' })}>
                      Aceptar
                    </button>
                    <button type="button" className="btn btn-outline btn-sm"
                      onClick={() => send('Postulación no aceptada.', { type: 'respondToInterest', actorId: user.id, interestId: i.id, decision: 'declined' })}>
                      No aceptar
                    </button>
                    {full && <span className="meta">No quedan lugares: ampliá el equipo para aceptar.</span>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Collapsible>

      <Collapsible title={`Equipo (${project.memberIds.length} de ${project.maxMembers})`} headingLevel={3} openOnMobile>
        {project.memberIds.length === 0 ? (
          <p className="empty">Todavía no hay estudiantes en el equipo. Aceptá una postulación o sumá a alguien.</p>
        ) : (
          <>
            {!project.coordinatorId && manage && <p className="notice">Definí quién coordina el equipo.</p>}
            <ul className="plain-list">
              {project.memberIds.map((id) => (
                <li key={id}>
                  <strong>{nameOf(state, id)}</strong>{' '}
                  {project.coordinatorId === id && <span className="badge badge-project">Coordina el equipo</span>}
                  <StudentProfileSummary profile={profileOf(id)} />
                  {manage && (
                    <div className="task-actions">
                      {project.coordinatorId === id ? (
                        <button type="button" className="btn btn-outline btn-sm"
                          onClick={() => send('Se quitó la coordinación.', { type: 'setCoordinator', actorId: user.id, projectId: project.id, studentId: null })}>
                          Quitar coordinación
                        </button>
                      ) : (
                        <button type="button" className="btn btn-outline btn-sm"
                          onClick={() => send(`${nameOf(state, id)} coordina el equipo.`, { type: 'setCoordinator', actorId: user.id, projectId: project.id, studentId: id })}>
                          Designar coordinador/a
                        </button>
                      )}
                      <button type="button" className="btn btn-outline btn-sm"
                        onClick={() => send(`${nameOf(state, id)} salió del equipo.`, { type: 'removeTeamMember', actorId: user.id, projectId: project.id, studentId: id })}>
                        Quitar del equipo
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </Collapsible>

      <Collapsible title={`Estudiantes con perfil (${available.length})`} headingLevel={3}>
        {available.length === 0 ? (
          <p className="empty">No hay otros estudiantes{skill ? ' con esa habilidad' : ''}.</p>
        ) : (
          <ul className="plain-list">
            {available.map((s) => {
              const interest = state.interests.find((i) => i.projectId === project.id && i.studentId === s.id && i.status === 'pending')
              const past = state.interests.find((i) => i.projectId === project.id && i.studentId === s.id && i.status !== 'pending')
              return (
                <li key={s.id}>
                  <strong>{s.name}</strong>{' '}
                  {interest && <span className="badge badge-sim">Se postuló</span>}
                  {past && <span className="badge badge-sim">{INTEREST_STATUS_LABELS[past.status]}</span>}
                  <StudentProfileSummary profile={profileOf(s.id)} />
                  {manage && (
                    <button type="button" className="btn btn-outline btn-sm" disabled={full || !active}
                      onClick={() => send(`${s.name} se sumó al equipo.`, { type: 'addTeamMember', actorId: user.id, projectId: project.id, studentId: s.id })}>
                      Sumar al equipo
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Collapsible>
    </section>
  )
}

export function TeamsPage() {
  const { state } = useDemo()
  const user = useActiveUser()
  const [skill, setSkill] = useState('')
  useDocumentTitle('Equipos')
  if (!user) return null

  if (user.role !== 'supervisor' && user.role !== 'admin') {
    return (
      <div className="dashboard">
        <h1>Equipos</h1>
        <p className="intro">Esta pantalla es para docentes.</p>
        <Link className="btn btn-primary" to="/app">Volver al panel</Link>
      </div>
    )
  }

  const projects = projectsForUser(state, user)
  return (
    <div className="dashboard">
      <h1>Equipos</h1>
      <p className="intro">Revisá los perfiles, aceptá a los estudiantes que se postularon y armá cada equipo.</p>
      <label className="field filter-field">
        <span>Filtrar estudiantes por habilidad</span>
        <select value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="">Todas las habilidades</option>
          {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      {projects.length === 0 ? (
        <p className="empty" style={{ marginTop: 20 }}>
          Todavía no hay proyectos. Aprobá una postulación de comercio para abrir un proyecto y armar su equipo.
        </p>
      ) : (
        projects.map((p) => <ProjectTeam key={p.id} project={p} user={user} skill={skill} />)
      )}
    </div>
  )
}
