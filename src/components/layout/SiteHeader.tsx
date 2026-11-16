import { useState } from 'react'

export interface NavItem {
  id: string
  label: string
}

interface Props {
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
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

export function SiteHeader({ items, activeId, onNavigate }: Props) {
  const [open, setOpen] = useState(false)

  const go = (id: string) => {
    setOpen(false)
    onNavigate(id)
  }

  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#inicio" onClick={(e) => { e.preventDefault(); go('inicio') }}>
          <Logo />
          <span>
            <span className="brand-name">TUCE <span>Conecta</span></span>
            <span className="brand-tag">Vinculación académica con el entorno productivo</span>
          </span>
        </a>
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
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'true' : undefined}
              onClick={(e) => { e.preventDefault(); go(item.id) }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
