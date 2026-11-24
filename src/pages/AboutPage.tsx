import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function AboutPage() {
  useDocumentTitle('Sobre el proyecto')

  return (
    <section className="section" aria-labelledby="t-proy">
      <div className="container">
        <h1 id="t-proy">Sobre el <span>proyecto</span></h1>
        <p className="intro">
          Proyecto académico de la Tecnicatura Universitaria en Comercio Electrónico (TUCE) de la
          UNPAZ, en el marco de la materia Gestión de Proyectos. Esta es una demostración
          interactiva: no hay cuentas reales y los cambios se guardan solo en tu navegador.
        </p>
        <p className="note">Los datos marcados como simulados son ejemplos para la demostración, no hechos históricos.</p>
      </div>
    </section>
  )
}
