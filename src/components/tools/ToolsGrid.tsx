import { TOOLS, TOOL_CATEGORIES, type Tool } from '../../data/tools'
import { Collapsible } from '../common/Collapsible'

function ToolLogo({ tool }: { tool: Tool }) {
  if (tool.icon) {
    return (
      <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" focusable="false">
        <path d={tool.icon.path} fill={tool.icon.hex} />
      </svg>
    )
  }
  // Símbolos genéricos propios (no son los logos de las marcas).
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" focusable="false" fill="none" stroke="#0b2a6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {tool.glyph === 'place' ? (
        <>
          <path d="M12 21s-6-5.6-6-10a6 6 0 0 1 12 0c0 4.4-6 10-6 10z" />
          <circle cx="12" cy="11" r="2.2" />
        </>
      ) : (
        <>
          <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.4-1.2-1.6-1.2-2.7 0-.9.8-1.5 1.7-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z" />
          <circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7.5" r="1" /><circle cx="14.5" cy="7.5" r="1" />
        </>
      )}
    </svg>
  )
}

/** Herramientas gratuitas, agrupadas por categoría, con logo, para qué sirven y enlace. */
export function ToolsGrid({ headingLevel = 3, openOnMobile = false }: { headingLevel?: 2 | 3; openOnMobile?: boolean }) {
  return (
    <div className="tools">
      {TOOL_CATEGORIES.map((cat) => (
        <Collapsible key={cat} title={cat} headingLevel={headingLevel} className="tools-group" openOnMobile={openOnMobile}>
          <ul className="tools-list">
            {TOOLS.filter((t) => t.category === cat).map((t) => (
              <li key={t.id} className="tool-card">
                <span className="tool-logo"><ToolLogo tool={t} /></span>
                <div>
                  <p className="tool-name">
                    {t.name} {t.pilot && <span className="badge badge-sim">Se usó en el piloto</span>}
                  </p>
                  <p className="meta">{t.usage}</p>
                  <p className="meta"><strong>{t.free}</strong></p>
                  <a href={t.url} target="_blank" rel="noopener noreferrer">
                    Abrir {t.name}<span className="visually-hidden"> (se abre en otra pestaña)</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Collapsible>
      ))}
      <p className="meta tools-note">
        Los planes gratuitos pueden cambiar: revisá las condiciones en cada sitio. Los logos pertenecen a sus
        respectivas marcas; esta demostración no está afiliada a ellas.
      </p>
    </div>
  )
}
