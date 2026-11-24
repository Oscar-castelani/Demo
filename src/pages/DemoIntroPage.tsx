import { Link } from 'react-router-dom'
import { EvaluationLink } from '../components/common/EvaluationLink'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const ROLES = [
  { tag: 'Estudiante', text: 'Se postula con sus habilidades, elige proyectos abiertos, organiza tareas y adjunta entregables.' },
  { tag: 'Emprendimiento', text: 'Postula su proyecto con un formulario breve, sigue cada etapa y revisa los entregables.' },
  { tag: 'Supervisor docente', text: 'Revisa las postulaciones, acompaña los proyectos, deja observaciones y registra la evaluación final.' },
  { tag: 'Administrador de demo', text: 'Configura y presenta la demostración, y restablece los datos originales.' },
]

export function DemoIntroPage() {
  useDocumentTitle('Demo')

  return (
    <section className="section" aria-labelledby="t-demo">
      <div className="container">
        <h1 id="t-demo">Probá la <span>demo</span></h1>
        <p className="intro">
          Elegí un rol y recorré la plataforma: los comercios postulan sus proyectos, los estudiantes
          se postulan con sus habilidades y los docentes revisan y arman los equipos. También podés
          cargar un caso de ejemplo ya armado.
        </p>
        <div className="grid" style={{ marginBottom: 32 }}>
          {ROLES.map((r) => (
            <article className="card" key={r.tag}>
              <span className="tag">{r.tag}</span>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
        <p className="note" style={{ marginBottom: 20 }}>
          Es una demostración: los permisos son simulados, lo que cargues queda solo en tu navegador y los formularios
          no son una postulación real. No uses datos personales reales.
        </p>
        <Link className="btn btn-primary" to="/ingresar">Iniciar la demostración</Link>
        <EvaluationLink />
      </div>
    </section>
  )
}
