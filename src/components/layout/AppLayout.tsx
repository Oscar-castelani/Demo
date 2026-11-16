import type { ReactNode } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useActiveUser } from '../../hooks/useActiveUser'
import { ResetDemoButton } from '../common/ResetDemoButton'
import { WarningBanner } from '../common/WarningBanner'
import { TourBanner } from '../common/TourBanner'
import { ROLE_LABELS } from '../../utils/labels'

/** Si no hay usuario elegido, lleva al selector. */
export function RequireUser({ children }: { children: ReactNode }) {
  const user = useActiveUser()
  if (!user) return <Navigate to="/ingresar" replace />
  return <>{children}</>
}

export function AppLayout() {
  const user = useActiveUser()
  const navigate = useNavigate()
  if (!user) return null

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/app" className="app-brand">TUCE <span>Conecta</span></Link>
          <nav aria-label="Principal" className="app-nav">
            <NavLink to="/app" end>Panel</NavLink>
            {user.role === 'student' && <NavLink to="/app/abiertos">Proyectos abiertos</NavLink>}
            {user.role !== 'student' && <NavLink to="/app/postulaciones">{user.role === 'business' ? 'Mis postulaciones' : 'Postulaciones'}</NavLink>}
            <NavLink to="/app/proyectos">{user.role === 'student' ? 'Mis proyectos' : 'Proyectos'}</NavLink>
            <NavLink to="/app/herramientas">Herramientas</NavLink>
            {(user.role === 'supervisor' || user.role === 'admin') && (
              <>
                <NavLink to="/app/equipos">Equipos</NavLink>
                <NavLink to="/app/supervision">Supervisión</NavLink>
              </>
            )}
          </nav>
          <div className="app-user">
            <span className="user-chip">
              <strong>{user.name}</strong>
              <span className="role-label">{ROLE_LABELS[user.role]}</span>
            </span>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/ingresar')}>
              Cambiar usuario
            </button>
            <ResetDemoButton />
          </div>
        </div>
        <p className="demo-ribbon">Demostración: permisos simulados; lo cargado queda en este navegador. No uses datos reales.</p>
      </header>
      <WarningBanner />
      <div className="tour-wrap"><TourBanner /></div>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
