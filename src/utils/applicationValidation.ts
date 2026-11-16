import type { HelpType } from '../types'
import { isSafeUrl } from './url'

export interface BusinessInfoValues {
  businessName: string
  activity: string
  city: string
  instagram: string
  facebook: string
  website: string
  currentChannels: string
  ownerName: string
  phone: string
  email: string
}

export interface ProjectInfoValues {
  projectTitle: string
  description: string
  expectedResult: string
  helpTypes: HelpType[]
  timeframe: string
  contactHours: string
  accepted: boolean
}

export interface StudentValues {
  name: string
  email: string
  phone: string
  year: string
  weeklyHours: string
  skills: string[]
  otherSkills: string
  experience: string
  motivation: string
  instagram: string
  linkedin: string
  website: string
  accepted: boolean
}

export type Errors<T> = Partial<Record<keyof T, string>>

const REQUIRED = 'Completá este dato.'
const NAME_MAX = 80
const TEXT_MAX = 600

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** Teléfono flexible: acepta espacios, guiones, paréntesis y +; entre 6 y 15 dígitos. */
export function isPhone(value: string): boolean {
  if (!/^[\d\s()+\-.]+$/.test(value.trim())) return false
  const digits = value.replace(/\D/g, '').length
  return digits >= 6 && digits <= 15
}

function optionalUrl(value: string): string | undefined {
  const v = value.trim()
  if (v && !isSafeUrl(v)) return 'Ingresá un enlace que empiece con https://'
  return undefined
}

function tooLong(value: string, max: number): string | undefined {
  return value.trim().length > max ? `No puede superar ${max} caracteres.` : undefined
}

export function validateBusinessInfo(v: BusinessInfoValues): Errors<BusinessInfoValues> {
  const e: Errors<BusinessInfoValues> = {}
  if (!v.businessName.trim()) e.businessName = REQUIRED
  else e.businessName = tooLong(v.businessName, NAME_MAX)
  if (!v.activity.trim()) e.activity = REQUIRED
  else e.activity = tooLong(v.activity, NAME_MAX)
  if (!v.city.trim()) e.city = REQUIRED
  else e.city = tooLong(v.city, NAME_MAX)
  if (!v.ownerName.trim()) e.ownerName = REQUIRED
  else e.ownerName = tooLong(v.ownerName, NAME_MAX)
  if (!v.phone.trim()) e.phone = REQUIRED
  else if (!isPhone(v.phone)) e.phone = 'Ingresá un teléfono válido (solo números, espacios o guiones).'
  if (v.email.trim() && !isEmail(v.email)) e.email = 'Ingresá un correo válido.'
  e.instagram = optionalUrl(v.instagram)
  e.facebook = optionalUrl(v.facebook)
  e.website = optionalUrl(v.website)
  e.currentChannels = tooLong(v.currentChannels, TEXT_MAX)
  return clean(e)
}

export function validateProjectInfo(v: ProjectInfoValues): Errors<ProjectInfoValues> {
  const e: Errors<ProjectInfoValues> = {}
  if (v.projectTitle.trim().length < 5) e.projectTitle = 'El título debe tener al menos 5 caracteres.'
  else e.projectTitle = tooLong(v.projectTitle, 120)
  if (v.description.trim().length < 20) e.description = 'Contanos un poco más: al menos 20 caracteres.'
  else e.description = tooLong(v.description, TEXT_MAX)
  e.expectedResult = tooLong(v.expectedResult, TEXT_MAX)
  e.contactHours = tooLong(v.contactHours, NAME_MAX)
  if (v.helpTypes.length === 0) e.helpTypes = 'Elegí al menos un tipo de ayuda.'
  if (!v.accepted) e.accepted = 'Para enviar la postulación tenés que aceptar las condiciones.'
  return clean(e)
}

export function validateStudent(v: StudentValues): Errors<StudentValues> {
  const e: Errors<StudentValues> = {}
  if (v.name.trim().length < 3) e.name = 'Ingresá tu nombre y apellido.'
  else e.name = tooLong(v.name, NAME_MAX)
  if (!v.email.trim()) e.email = REQUIRED
  else if (!isEmail(v.email)) e.email = 'Ingresá un correo válido.'
  if (v.phone.trim() && !isPhone(v.phone)) e.phone = 'Ingresá un teléfono válido (solo números, espacios o guiones).'
  if (!v.year) e.year = 'Elegí tu año de cursada.'
  if (!v.weeklyHours) e.weeklyHours = 'Elegí las horas semanales que podrías dedicar.'
  if (v.skills.length === 0) e.skills = 'Elegí al menos una habilidad.'
  e.otherSkills = tooLong(v.otherSkills, NAME_MAX)
  e.experience = tooLong(v.experience, TEXT_MAX)
  e.motivation = tooLong(v.motivation, TEXT_MAX)
  e.instagram = optionalUrl(v.instagram)
  e.linkedin = optionalUrl(v.linkedin)
  e.website = optionalUrl(v.website)
  if (!v.accepted) e.accepted = 'Para enviar tu postulación tenés que aceptar las condiciones.'
  return clean(e)
}

/** Quita las claves sin mensaje para que `hasErrors` funcione. */
function clean<T extends object>(e: T): T {
  for (const key of Object.keys(e) as (keyof T)[]) {
    if (e[key] === undefined) delete e[key]
  }
  return e
}

export const NOTE_MAX = 500

export function validateNote(text: string, required: boolean): string | undefined {
  const t = text.trim()
  if (required && t.length === 0) return 'Escribí un mensaje.'
  if (t.length > NOTE_MAX) return `El mensaje no puede superar ${NOTE_MAX} caracteres.`
  return undefined
}
