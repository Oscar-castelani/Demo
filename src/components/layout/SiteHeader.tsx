import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export interface NavItem {
  to: string
  label: string
}

interface Props {
  items: NavItem[]
}

function Logo() {
  return (
    <svg width="76" height="52" viewBox="0 0 76 52" fill="none" aria-hidden="true">
      <path d="M38 4 4 19l34 15 34-15z" stroke="#0b2a6b" strokeWidth="4" strokeLinejoin="round" />
      <path d="M18 27v11c0 5 9 10 20 10s20-5 20-10V27" stroke="#0b2a6b" strokeWidth="4" strokeLinejoin="round" />
      <path d="M70 21v14" stroke="#0b2a6b" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function SiteHeader({ items }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <Logo />
          <span>
            <span className="brand-name">TUCE <span>Conecta</span></span>
            <span className="brand-tag">Vinculación académica con el entorno productivo</span>
          </span>
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menú
        </button>
        <nav id="main-nav" className={`nav${open ? ' open' : ''}`} aria-label="Principal">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
