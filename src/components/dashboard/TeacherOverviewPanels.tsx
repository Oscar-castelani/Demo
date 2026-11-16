import { Link } from 'react-router-dom'
import { Collapsible } from '../common/Collapsible'
import { LoadExampleButton } from '../common/LoadExampleButton'
import { SkillsHover } from '../common/SkillsHover'
import { teacherOverview } from '../../services/teacherOverview'
import { PROJECT_STATUS_LABELS } from '../../utils/labels'
import type { DashboardProps } from './shared'

function IllustrativeNote({ what }: { what: string }) {
  return (
    <div className="notice" role="note">
      <strong>Ejemplo ilustrativo.</strong> Todavía no hay {what}: esto muestra cómo se verá cuando los haya. No está
      cargado en la demo.
      <div style={{ marginTop: 8 }}><LoadExampleButton className="btn btn-outline btn-sm" /></div>
    </div>
  )
}

/** Estudiantes postulados (con sus habilidades al pasar el mouse) y equipos armados con su proyecto. */
export function TeacherOverviewPanels({ state, user }: DashboardProps) {
  const { students, teams, studentsIllustrative, teamsIllustrative } = teacherOverview(state, user)

  return (
    <>
      <Collapsible title={studentsIllustrative ? 'Estudiantes postulados (ejemplo)' : `Estudiantes postulados (${students.length})`} openOnMobile>
        {studentsIllustrative && <IllustrativeNote what="estudiantes postulados" />}
        <p className="meta">Pasá el mouse por el nombre (o tocalo) para ver sus habilidades principales.</p>
        <ul className="plain-list student-list">
          {students.map((s) => (
            <li key={s.id}>
              <SkillsHover name={s.name} skills={s.skills} detail={s.detail} />
              <span className="meta"> · {s.situation}</span>
            </li>
          ))}
        </ul>
        {!studentsIllustrative && (
          <Link className="btn btn-outline btn-sm" to="/app/equipos">Aceptar estudiantes y armar equipos</Link>
        )}
      </Collapsible>

      <Collapsible title={teamsIllustrative ? 'Equipos armados (ejemplo)' : `Equipos armados (${teams.length})`} openOnMobile>
        {teamsIllustrative && <IllustrativeNote what="equipos armados" />}
        <div className="grid">
          {teams.map((t) => (
            <article className="card team-card" key={t.projectId}>
              <span className="badge badge-project">{PROJECT_STATUS_LABELS[t.status]}</span>
              <h3>{teamsIllustrative ? t.title : <Link to={`/app/proyectos/${t.projectId}`}>{t.title}</Link>}</h3>
              <p className="meta">{t.business} · {t.members.length} de {t.maxMembers} lugares</p>
              <ul className="plain-list">
                {t.members.map((m) => (
                  <li key={m.id}>
                    <SkillsHover name={m.name} skills={m.skills} detail={m.detail} />
                    {m.coordinator && <span className="badge badge-project" style={{ marginLeft: 8 }}>Coordina</span>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Collapsible>
    </>
  )
}
