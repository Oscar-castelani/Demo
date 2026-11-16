import { CheckboxField, CheckGroup, SelectField, TextArea, TextField } from '../forms/Fields'
import { HELP_TYPES, HELP_TYPE_LABELS, TIMEFRAMES } from '../../utils/labels'
import type { Errors, ProjectInfoValues } from '../../utils/applicationValidation'
import type { HelpType } from '../../types'

export const EMPTY_PROJECT_INFO: ProjectInfoValues = {
  projectTitle: '',
  description: '',
  expectedResult: '',
  helpTypes: [],
  timeframe: TIMEFRAMES[0],
  contactHours: '',
  accepted: false,
}

interface Props {
  values: ProjectInfoValues
  errors: Errors<ProjectInfoValues>
  onChange: (values: ProjectInfoValues) => void
}

/** Campos del proyecto que el comercio quiere postular (se usan en el formulario completo y al postular otro proyecto). */
export function ProjectInfoFields({ values, errors, onChange }: Props) {
  const set = <K extends keyof ProjectInfoValues>(key: K, value: ProjectInfoValues[K]) => onChange({ ...values, [key]: value })
  return (
    <>
      <TextField label="Título del proyecto" name="projectTitle" required value={values.projectTitle} maxLength={120}
        error={errors.projectTitle} placeholder="Ej.: Crear el perfil de Instagram del negocio"
        onChange={(v) => set('projectTitle', v)} />
      <TextArea label="¿Qué necesitan? Describí el proyecto" name="description" required value={values.description}
        maxLength={650} rows={4} error={errors.description}
        hint="Contanos qué quieren lograr y qué tienen hoy." onChange={(v) => set('description', v)} />
      <TextArea label="¿Qué resultado esperan?" name="expectedResult" value={values.expectedResult} maxLength={650}
        rows={3} error={errors.expectedResult} placeholder="Ej.: un catálogo publicado y una forma simple de recibir pedidos"
        hint="Opcional. Pensá qué te gustaría tener funcionando al terminar." onChange={(v) => set('expectedResult', v)} />
      <CheckGroup legend="Tipo de ayuda" name="helpTypes" required error={errors.helpTypes}
        hint="¿En qué necesitás que te ayuden los estudiantes? Podés elegir más de una." selected={values.helpTypes}
        options={HELP_TYPES.map((h) => ({ value: h, label: HELP_TYPE_LABELS[h] }))}
        onChange={(sel) => set('helpTypes', sel as HelpType[])} />
      <SelectField label="¿Para cuándo lo necesitan?" name="timeframe" value={values.timeframe} options={TIMEFRAMES}
        onChange={(v) => set('timeframe', v)} />
      <TextField label="Mejor horario para reunirse" name="contactHours" value={values.contactHours} maxLength={80}
        error={errors.contactHours} placeholder="Ej.: lunes a viernes por la tarde" onChange={(v) => set('contactHours', v)} />
      <CheckboxField name="accepted" checked={values.accepted} error={errors.accepted}
        onChange={(c) => set('accepted', c)}>
        Entiendo que la ayudantía la realizan estudiantes de forma voluntaria (ad honorem), con acompañamiento docente.
      </CheckboxField>
    </>
  )
}
