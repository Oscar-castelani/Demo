import { SimulatedTag } from '../common/Badges'
import { isSafeUrl } from '../../utils/url'
import type { StudentProfile } from '../../types'

/** Resumen del perfil de un estudiante para que el docente lo evalúe. */
export function StudentProfileSummary({ profile }: { profile: StudentProfile | undefined }) {
  if (!profile) return <p className="meta">Sin perfil cargado.</p>
  const skills = [...profile.skills, ...(profile.otherSkills ? [profile.otherSkills] : [])]
  return (
    <div className="profile-summary">
      <ul className="chips" aria-label="Habilidades">
        {skills.map((s) => <li key={s} className="chip">{s}</li>)}
      </ul>
      <p className="meta">
        {profile.year || 'Año no informado'} · {profile.weeklyHours || 'Disponibilidad no informada'}
        {profile.email ? ` · ${profile.email}` : ''}{profile.phone ? ` · ${profile.phone}` : ''}{' '}
        {profile.simulated && <SimulatedTag />}
      </p>
      {profile.experience && <p className="meta"><strong>Experiencia:</strong> {profile.experience}</p>}
      {profile.motivation && <p className="meta"><strong>Motivación:</strong> {profile.motivation}</p>}
      {profile.socials.length > 0 && (
        <p className="meta">
          Redes:{' '}
          {profile.socials.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              {isSafeUrl(s.url) ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : s.label}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
