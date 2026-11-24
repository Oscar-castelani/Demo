import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import heroImg from '../assets/images/equipo-mesa-graficos.jpg'

export function WelcomePage() {
  useDocumentTitle('')

  return (
    <section className="hero" aria-labelledby="hero-title">
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
            <Link className="btn btn-primary" to="/demo">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="currentColor" /></svg>
              Ver la demo
            </Link>
            <Link className="btn btn-outline" to="/como-funciona">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Cómo funciona
            </Link>
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
  )
}
