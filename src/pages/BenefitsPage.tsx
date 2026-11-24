import { useDocumentTitle } from '../hooks/useDocumentTitle'

const BENEFITS = [
  { title: 'Práctica real', text: 'Los estudiantes aplican sus conocimientos en proyectos de comercio electrónico y presencia digital.' },
  { title: 'Acompañamiento docente', text: 'El seguimiento queda visible sin que el docente tenga que intervenir en cada actividad.' },
  { title: 'Todo en un solo lugar', text: 'Tareas, comentarios, entregables y revisiones centralizados en una única plataforma.' },
]

export function BenefitsPage() {
  useDocumentTitle('Beneficios')

  return (
    <section className="section" aria-labelledby="t-ben">
      <div className="container">
        <h1 id="t-ben"><span>Beneficios</span></h1>
        <p className="intro">Una propuesta pensada para conectar la formación con el entorno productivo local.</p>
        <div className="grid">
          {BENEFITS.map((b) => (
            <article className="card" key={b.title}>
              <h2>{b.title}</h2>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
