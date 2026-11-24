import { Outlet } from 'react-router-dom'
import { SiteHeader, type NavItem } from './SiteHeader'

const NAV: NavItem[] = [
  { to: '/', label: 'Inicio' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/beneficios', label: 'Beneficios' },
  { to: '/herramientas', label: 'Herramientas' },
  { to: '/demo', label: 'Demo' },
  { to: '/proyecto', label: 'Sobre el proyecto' },
]

/** Estructura común de las páginas públicas: encabezado con el menú, contenido de la página y pie. */
export function PublicLayout() {
  return (
    <>
      <SiteHeader items={NAV} />
      <main tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">TUCE Conecta · Demo académica · TUCE – UNPAZ</div>
      </footer>
    </>
  )
}
