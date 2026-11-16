import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemo } from '../hooks/useDemo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { FormPage } from '../components/forms/FormPage'
import { CheckboxField, CheckGroup, SelectField, TextArea, TextField } from '../components/forms/Fields'
import { SKILLS, STUDENT_YEARS, WEEKLY_HOURS } from '../utils/labels'
import { validateStudent, type Errors, type StudentValues } from '../utils/applicationValidation'
import { hasErrors } from '../utils/validation'

const EMPTY: StudentValues = {
  name: '', email: '', phone: '', year: '', weeklyHours: '', skills: [], otherSkills: '',
  experience: '', motivation: '', instagram: '', linkedin: '', website: '', accepted: false,
}

export function ApplyStudentPage() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  useDocumentTitle('Crear mi perfil de estudiante')
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors<StudentValues>>({})

  const set = <K extends keyof StudentValues>(key: K, value: StudentValues[K]) => setV({ ...v, [key]: value })

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validateStudent(v)
    setErrors(found)
    if (hasErrors(found)) {
      const form = e.currentTarget
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    dispatch({ type: 'submitStudentProfile', input: v })
    navigate('/app/abiertos?bienvenida=1')
  }

  return (
    <FormPage
      title="Postularme como estudiante"
      intro="Contanos quién sos y qué sabés hacer. Después vas a poder elegir en qué proyectos participar. Los datos con * son obligatorios."
    >
      <form onSubmit={submit} noValidate className="form app-form">
        <fieldset className="form-section">
          <legend>Tus datos</legend>
          <TextField label="Nombre y apellido" name="name" required value={v.name} maxLength={80} autoComplete="name"
            error={errors.name} onChange={(x) => set('name', x)} />
          <TextField label="Correo electrónico" name="email" type="email" required value={v.email} autoComplete="email"
            error={errors.email} onChange={(x) => set('email', x)} />
          <TextField label="Teléfono (opcional)" name="phone" type="tel" value={v.phone} autoComplete="tel"
            error={errors.phone} onChange={(x) => set('phone', x)} />
          <SelectField label="Año de cursada" name="year" required value={v.year} options={STUDENT_YEARS}
            placeholder="Elegí una opción" error={errors.year} onChange={(x) => set('year', x)} />
          <SelectField label="Horas semanales que podrías dedicar" name="weeklyHours" required value={v.weeklyHours}
            options={WEEKLY_HOURS} placeholder="Elegí una opción" error={errors.weeklyHours}
            onChange={(x) => set('weeklyHours', x)} />
        </fieldset>

        <fieldset className="form-section">
          <legend>Tus habilidades</legend>
          <CheckGroup legend="¿En qué podés ayudar?" name="skills" required error={errors.skills}
            hint="Elegí todas las que correspondan." selected={v.skills}
            options={SKILLS.map((s) => ({ value: s, label: s }))} onChange={(s) => set('skills', s)} />
          <TextField label="Otras habilidades" name="otherSkills" value={v.otherSkills} maxLength={80}
            error={errors.otherSkills} onChange={(x) => set('otherSkills', x)} />
          <TextArea label="Experiencia previa (opcional)" name="experience" value={v.experience} rows={3} maxLength={650}
            error={errors.experience} hint="Trabajos, cursos o proyectos relacionados."
            onChange={(x) => set('experience', x)} />
          <TextArea label="¿Por qué querés participar? (opcional)" name="motivation" value={v.motivation} rows={3}
            maxLength={650} error={errors.motivation} onChange={(x) => set('motivation', x)} />
        </fieldset>

        <fieldset className="form-section">
          <legend>Redes y portafolio (opcional)</legend>
          <TextField label="Instagram" name="instagram" type="url" value={v.instagram} error={errors.instagram}
            placeholder="https://instagram.com/…" onChange={(x) => set('instagram', x)} />
          <TextField label="LinkedIn" name="linkedin" type="url" value={v.linkedin} error={errors.linkedin}
            placeholder="https://linkedin.com/in/…" onChange={(x) => set('linkedin', x)} />
          <TextField label="Sitio web o portafolio" name="website" type="url" value={v.website} error={errors.website}
            placeholder="https://…" onChange={(x) => set('website', x)} />
        </fieldset>

        <CheckboxField name="accepted" checked={v.accepted} error={errors.accepted} onChange={(c) => set('accepted', c)}>
          Entiendo que la ayudantía es voluntaria (ad honorem) y que se realiza con acompañamiento docente.
        </CheckboxField>

        <button type="submit" className="btn btn-primary">Enviar postulación</button>
      </form>
    </FormPage>
  )
}
