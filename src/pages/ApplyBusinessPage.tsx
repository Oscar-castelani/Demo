import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemo } from '../hooks/useDemo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { FormPage } from '../components/forms/FormPage'
import { TextArea, TextField } from '../components/forms/Fields'
import { EMPTY_PROJECT_INFO, ProjectInfoFields } from '../components/applications/ProjectInfoFields'
import {
  validateBusinessInfo, validateProjectInfo,
  type BusinessInfoValues, type Errors, type ProjectInfoValues,
} from '../utils/applicationValidation'
import { hasErrors } from '../utils/validation'

const EMPTY_BUSINESS: BusinessInfoValues = {
  businessName: '', activity: '', city: '', instagram: '', facebook: '', website: '',
  currentChannels: '', ownerName: '', phone: '', email: '',
}

export function ApplyBusinessPage() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  useDocumentTitle('Postular mi comercio')
  const [business, setBusiness] = useState(EMPTY_BUSINESS)
  const [project, setProject] = useState<ProjectInfoValues>(EMPTY_PROJECT_INFO)
  const [bErrors, setBErrors] = useState<Errors<BusinessInfoValues>>({})
  const [pErrors, setPErrors] = useState<Errors<ProjectInfoValues>>({})

  const setB = <K extends keyof BusinessInfoValues>(key: K, value: string) => setBusiness({ ...business, [key]: value })

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const be = validateBusinessInfo(business)
    const pe = validateProjectInfo(project)
    setBErrors(be)
    setPErrors(pe)
    if (hasErrors(be) || hasErrors(pe)) {
      // Lleva el foco al primer campo con error para que se entienda qué falta.
      const form = e.currentTarget
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    dispatch({ type: 'submitBusinessApplication', input: { ...business, ...project } })
    navigate('/app/postulaciones?enviada=1')
  }

  return (
    <FormPage
      title="Postular mi comercio"
      intro="Completá este formulario breve y un docente revisará tu proyecto. Los datos con * son obligatorios."
    >
      <form onSubmit={submit} noValidate className="form app-form">
        <fieldset className="form-section">
          <legend>Tu comercio, emprendimiento o Pyme</legend>
          <TextField label="Nombre del comercio, emprendimiento o Pyme" name="businessName" required value={business.businessName}
            maxLength={80} error={bErrors.businessName} onChange={(v) => setB('businessName', v)} />
          <TextField label="Rubro o actividad" name="activity" required value={business.activity} maxLength={80}
            error={bErrors.activity} placeholder="Ej.: venta de insumos para manualidades" onChange={(v) => setB('activity', v)} />
          <TextField label="Localidad" name="city" required value={business.city} maxLength={80} error={bErrors.city}
            placeholder="Ej.: José C. Paz" onChange={(v) => setB('city', v)} />
          <TextArea label="¿Dónde vendés o te mostrás hoy?" name="currentChannels" value={business.currentChannels} rows={2}
            maxLength={650} error={bErrors.currentChannels} placeholder="Ej.: local, grupos de Facebook, WhatsApp"
            onChange={(v) => setB('currentChannels', v)} />
        </fieldset>

        <fieldset className="form-section">
          <legend>Datos de contacto</legend>
          <TextField label="Persona a cargo" name="ownerName" required value={business.ownerName} maxLength={80}
            autoComplete="name" error={bErrors.ownerName} onChange={(v) => setB('ownerName', v)} />
          <TextField label="Teléfono" name="phone" type="tel" required value={business.phone} autoComplete="tel"
            error={bErrors.phone} placeholder="Ej.: 11 5555 0000 (ficticio)" onChange={(v) => setB('phone', v)} />
          <TextField label="Correo electrónico" name="email" type="email" value={business.email} autoComplete="email"
            error={bErrors.email} onChange={(v) => setB('email', v)} />
        </fieldset>

        <fieldset className="form-section">
          <legend>Redes y sitio web (opcional)</legend>
          <TextField label="Instagram" name="instagram" type="url" value={business.instagram} error={bErrors.instagram}
            placeholder="https://instagram.com/…" onChange={(v) => setB('instagram', v)} />
          <TextField label="Facebook" name="facebook" type="url" value={business.facebook} error={bErrors.facebook}
            placeholder="https://facebook.com/…" onChange={(v) => setB('facebook', v)} />
          <TextField label="Sitio web" name="website" type="url" value={business.website} error={bErrors.website}
            placeholder="https://…" onChange={(v) => setB('website', v)} />
        </fieldset>

        <fieldset className="form-section">
          <legend>Tu proyecto</legend>
          <ProjectInfoFields values={project} errors={pErrors} onChange={setProject} />
        </fieldset>

        <button type="submit" className="btn btn-primary">Enviar postulación</button>
      </form>
    </FormPage>
  )
}
