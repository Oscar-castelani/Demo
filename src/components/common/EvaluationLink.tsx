import { EVALUATION_FORM_URL } from '../../data/evaluation'

/** Invita a evaluar la demo en un formulario externo, que se abre en otra pestaña. */
export function EvaluationLink({ className = 'notice' }: { className?: string }) {
  return (
    <p className={className}>
      <strong>¿Probaste la demo?</strong> Contanos cómo te fue en una breve encuesta de usabilidad (formulario externo de
      Google, sin datos personales).{' '}
      <a href={EVALUATION_FORM_URL} target="_blank" rel="noopener noreferrer">
        Responder la encuesta (se abre en otra pestaña)
      </a>
    </p>
  )
}
