import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ToolsGrid } from '../components/tools/ToolsGrid'

export function ToolsPage() {
  useDocumentTitle('Herramientas')
  return (
    <div className="dashboard">
      <h1>Herramientas</h1>
      <p className="intro">
        Herramientas gratuitas que usan los equipos para organizarse, comunicarse y entregar el trabajo.
        La plataforma las centraliza, pero los documentos y los diseños se siguen creando en cada una.
      </p>
      <ToolsGrid headingLevel={2} openOnMobile />
    </div>
  )
}
