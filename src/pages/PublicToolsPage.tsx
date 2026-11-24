import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ToolsGrid } from '../components/tools/ToolsGrid'

export function PublicToolsPage() {
  useDocumentTitle('Herramientas')

  return (
    <section className="section" aria-labelledby="t-tools">
      <div className="container">
        <h1 id="t-tools">Herramientas <span>gratuitas</span></h1>
        <p className="intro">
          Los equipos trabajan con herramientas gratuitas que ya conocen. La plataforma ordena el proceso;
          los documentos y los diseños se siguen creando en cada herramienta.
        </p>
        <ToolsGrid headingLevel={2} />
      </div>
    </section>
  )
}
