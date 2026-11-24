import { useDocumentTitle } from '../hooks/useDocumentTitle'
import step1Img from '../assets/images/paso1-diseno-canva.jpg'
import step2Img from '../assets/images/paso2-equipo.jpg'
import step3Img from '../assets/images/paso3-desarrollo.jpg'
import step4Img from '../assets/images/paso4-resultados.jpg'

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

export function HowItWorksPage() {
  useDocumentTitle('Cómo funciona')

  return (
    <section className="section" aria-labelledby="t-como">
      <div className="container">
        <div className="how-intro">
          <h1 id="t-como">¿Cómo funciona <span>TUCE Conecta?</span></h1>
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
              <h2><span className="visually-hidden">Paso {i + 1}: </span>{s.title}</h2>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
