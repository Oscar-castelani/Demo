import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TourBanner } from '../components/common/TourBanner'
import { useDemo } from '../hooks/useDemo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { WarningBanner } from '../components/common/WarningBanner'
import { LoadExampleButton } from '../components/common/LoadExampleButton'
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_ORDER } from '../utils/labels'
import type { Role } from '../types'

const NEW_LINKS: Partial<Record<Role, { to: string; label: string }>> = {
  business: { to: '/postular/comercio', label: 'Postular mi comercio' },
  student: { to: '/postular/estudiante', label: 'Postularme como estudiante' },
}

export function RoleSelectPage() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  useDocumentTitle('Ingresar')
  const [params] = useSearchParams()
  const [role, setRole] = useState<Role | null>(() => {
    const asked = params.get('rol') as Role | null
    if (asked && ROLE_ORDER.includes(asked)) return asked
    return state.users.find((u) => u.id === state.activeUserId)?.role ?? null
  })

  const users = role ? state.users.filter((u) => u.role === role) : []
  const newLink = role ? NEW_LINKS[role] : undefined

  const enter = (userId: string) => {
    dispatch({ type: 'setActiveUser', userId })
    navigate('/app')
  }

  return (
    <main className="select-page">
      <WarningBanner />
      <div className="select-card">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <h1>Ingresar a la <span>demo</span></h1>
        <p className="intro">No se piden contraseñas. Elegí con qué rol querés recorrer la plataforma.</p>
        <TourBanner />

        <h2 className="step-title">1. Elegí un rol</h2>
        <div className="role-grid" role="group" aria-label="Roles disponibles">
          {ROLE_ORDER.map((r) => (
            <button
              key={r}
              type="button"
              className={`role-card${role === r ? ' selected' : ''}`}
              aria-pressed={role === r}
              onClick={() => setRole(r)}
            >
              <strong>{ROLE_LABELS[r]}</strong>
              <span>{ROLE_DESCRIPTIONS[r]}</span>
            </button>
          ))}
        </div>

        <h2 className="step-title">2. {newLink ? 'Postulate o volvé a entrar' : 'Elegí un usuario'}</h2>
        {role === null ? (
          <p className="empty">Primero elegí un rol.</p>
        ) : (
          <>
            {newLink && (
              <Link className="btn btn-primary" to={newLink.to}>{newLink.label}</Link>
            )}
            {users.length > 0 ? (
              <>
                {newLink && <p className="meta" style={{ marginTop: 16 }}>O volvé a entrar como alguien que ya se postuló:</p>}
                <ul className="user-list" aria-label={`Usuarios con rol ${ROLE_LABELS[role]}`} style={{ marginTop: 10 }}>
                  {users.map((u) => (
                    <li key={u.id}>
                      <button type="button" className={newLink ? 'btn btn-outline' : 'btn btn-primary'} onClick={() => enter(u.id)}>
                        Ingresar como {u.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              !newLink && <p className="empty">No hay usuarios con este rol.</p>
            )}
            {newLink && users.length === 0 && (
              <p className="meta" style={{ marginTop: 12 }}>Todavía nadie se postuló con este rol.</p>
            )}
          </>
        )}

        <div className="example-box">
          <div>
            <strong>¿Querés ver un caso ya armado?</strong>
            <p className="meta">Carga un ejemplo ficticio con equipo, tareas y entregables, todo marcado como simulado.</p>
          </div>
          <LoadExampleButton />
        </div>
      </div>
    </main>
  )
}
