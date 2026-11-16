import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ToolsGrid } from '../components/tools/ToolsGrid'
import { SiteHeader, type NavItem } from '../components/layout/SiteHeader'
import heroImg from '../assets/images/equipo-mesa-graficos.jpg'
import step1Img from '../assets/images/paso1-diseno-canva.jpg'
import step2Img from '../assets/images/paso2-equipo.jpg'
import step3Img from '../assets/images/paso3-desarrollo.jpg'
import step4Img from '../assets/images/paso4-resultados.jpg'

const NAV: NavItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'demo', label: 'Demo' },
  { id: 'proyecto', label: 'Sobre el proyecto' },
]

const ROLES = [
  { tag: 'Estudiante', text: 'Se postula con sus habilidades, elige proyectos abiertos, organiza tareas y adjunta entregables.' },
  { tag: 'Emprendimiento', text: 'Postula su proyecto con un formulario breve, sigue cada etapa y revisa los entregables.' },
  { tag: 'Supervisor docente', text: 'Revisa las postulaciones, acompaña los proyectos, deja observaciones y registra la evaluación final.' },
  { tag: 'Administrador de demo', text: 'Configura y presenta la demostración, y restablece los datos originales.' },
]

const BENEFITS = [
  { title: 'Práctica real', text: 'Los estudiantes aplican sus conocimientos en proyectos de comercio electrónico y presencia digital.' },
  { title: 'Acompañamiento docente', text: 'El seguimiento queda visible sin que el docente tenga que intervenir en cada actividad.' },
  { title: 'Todo en un solo lugar', text: 'Tareas, comentarios, entregables y revisiones centralizados en una única plataforma.' },
]

const STEPS = [
  {
    title: 'Se propone un proyecto',
    text: 'Un comercio, emprendimiento o Pyme plantea una necesidad o desafío digital.',
    img: step1Img,
    alt: 'Persona diseñando una publicación en una computadora portátil',
  },
  {
    title: 'Se conforma un equipo',
    text: 'Estudiantes de la TUCE se suman al proyecto según sus conocimientos e intereses.',
    img: step2Img,
    alt: 'Estudiantes trabajando juntos con computadoras portátiles',
  },
  {
    title: 'Se desarrolla la solución',
    text: 'El equipo trabaja de forma colaborativa, con seguimiento y orientación docente.',
    img: step3Img,
    alt: 'Pantalla de computadora con un entorno de desarrollo',
  },
  {
    title: 'Se obtienen resultados',
    text: 'El emprendimiento incorpora la solución y los estudiantes adquieren experiencia real.',
    img: step4Img,
    alt: 'Equipo revisando gráficos e informes junto a una computadora portátil',
  },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function WelcomePage() {
  const [activeId, setActiveId] = useState('inicio')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <SiteHeader items={NAV} activeId={activeId} onNavigate={scrollToSection} />
      <main>
        <section id="inicio" className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div>
              <span className="pill">TUCE · UNPAZ</span>
              <h1 id="hero-title">
                Estudiantes, emprendimientos, comercios, Pymes y docentes <em>conectados.</em>
              </h1>
              <p className="lead">
                Una plataforma que vincula a estudiantes de la Tecnicatura Universitaria en Comercio
                Electrónico con comercios, emprendimientos y pequeñas empresas, para desarrollar
                soluciones digitales con acompañamiento docente.
              </p>
              <div className="actions">
                <a className="btn btn-primary" href="#demo" onClick={(e) => { e.preventDefault(); scrollToSection('demo') }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="currentColor" /></svg>
                  Ver la demo
                </a>
                <a className="btn btn-outline" href="#como-funciona" onClick={(e) => { e.preventDefault(); scrollToSection('como-funciona') }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Cómo funciona
                </a>
              </div>
            </div>
            <img
              className="hero-photo"
              src={heroImg}
              alt="Equipo reunido alrededor de una mesa con informes y gráficos"
              width="2000"
              height="1335"
            />
          </div>
        </section>

        <section id="como-funciona" className="section" aria-labelledby="t-como">
          <div className="container">
            <div className="how-intro">
              <h2 id="t-como">¿Cómo funciona <span>TUCE Conecta?</span></h2>
              <p>
                Articulamos el conocimiento de nuestros estudiantes con las necesidades de comercios,
                emprendimientos, Pymes y organizaciones del entorno, a través de un proceso simple,
                colaborativo y con acompañamiento docente.
              </p>
            </div>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step" key={s.title}>
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <img className="step-photo" src={s.img} alt={s.alt} loading="lazy" width="600" height="400" />
                  <h3><span className="visually-hidden">Paso {i + 1}: </span>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="beneficios" className="section section-alt" aria-labelledby="t-ben">
          <div className="container">
            <h2 id="t-ben"><span>Beneficios</span></h2>
            <p className="intro">Una propuesta pensada para conectar la formación con el entorno productivo local.</p>
            <div className="grid">
              {BENEFITS.map((b) => (
                <article className="card" key={b.title}>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="herramientas" className="section" aria-labelledby="t-tools">
          <div className="container">
            <h2 id="t-tools">Herramientas <span>gratuitas</span></h2>
            <p className="intro">
              Los equipos trabajan con herramientas gratuitas que ya conocen. La plataforma ordena el proceso;
              los documentos y los diseños se siguen creando en cada herramienta.
            </p>
            <ToolsGrid />
          </div>
        </section>

        <section id="demo" className="section section-alt" aria-labelledby="t-demo">
          <div className="container">
            <h2 id="t-demo">Probá la <span>demo</span></h2>
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
          </div>
        </section>

        <section id="proyecto" className="section" aria-labelledby="t-proy">
          <div className="container">
            <h2 id="t-proy">Sobre el <span>proyecto</span></h2>
            <p className="intro">
              Proyecto académico de la Tecnicatura Universitaria en Comercio Electrónico (TUCE) de la
              UNPAZ, en el marco de la materia Gestión de Proyectos. Esta es una demostración
              interactiva: no hay cuentas reales y los cambios se guardan solo en tu navegador.
            </p>
            <p className="note">Los datos marcados como simulados son ejemplos para la demostración, no hechos históricos.</p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">TUCE Conecta · Demo académica · TUCE – UNPAZ</div>
      </footer>
    </>
  )
}
