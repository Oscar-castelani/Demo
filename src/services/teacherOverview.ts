import type { DemoState, ProjectStatus, User } from '../types'
import { createExampleState } from '../data/demoData'
import { projectsForUser } from './dashboardService'

export interface StudentRow {
  id: string
  name: string
  skills: string[]
  /** Año y disponibilidad, si el estudiante los informó. */
  detail: string
  /** Dónde está hoy: en un equipo, postulado a un proyecto o solo con perfil. */
  situation: string
}

export interface TeamRow {
  projectId: string
  title: string
  business: string
  status: ProjectStatus
  maxMembers: number
  members: { id: string; name: string; skills: string[]; detail: string; coordinator: boolean }[]
}

export interface TeacherOverview {
  students: StudentRow[]
  teams: TeamRow[]
  /** Si no hay estudiantes reales, se muestran los del ejemplo (solo para ilustrar; no se guardan). */
  studentsIllustrative: boolean
  teamsIllustrative: boolean
}

function skillsOf(state: DemoState, userId: string): string[] {
  const p = state.studentProfiles.find((x) => x.userId === userId)
  return p ? [...p.skills, ...(p.otherSkills ? [p.otherSkills] : [])] : []
}

function detailOf(state: DemoState, userId: string): string {
  const p = state.studentProfiles.find((x) => x.userId === userId)
  return p ? [p.year, p.weeklyHours].filter(Boolean).join(' · ') : ''
}

export function studentRows(state: DemoState): StudentRow[] {
  return state.users
    .filter((u) => u.role === 'student')
    .map((u) => {
      const team = state.projects.find((p) => p.memberIds.includes(u.id))
      const interest = state.interests.find((i) => i.studentId === u.id && i.status === 'pending')
      const interestProject = interest && state.projects.find((p) => p.id === interest.projectId)
      const situation = team
        ? `En el equipo de «${team.title}»`
        : interestProject
          ? `Postulado a «${interestProject.title}»`
          : 'Con perfil, todavía sin proyecto'
      return { id: u.id, name: u.name, skills: skillsOf(state, u.id), detail: detailOf(state, u.id), situation }
    })
}

export function teamRows(state: DemoState, user: User): TeamRow[] {
  return projectsForUser(state, user)
    .filter((p) => p.memberIds.length > 0)
    .map((p) => ({
      projectId: p.id,
      title: p.title,
      business: state.businesses.find((b) => b.id === p.businessId)?.name ?? '',
      status: p.status,
      maxMembers: p.maxMembers,
      members: p.memberIds.map((id) => ({
        id,
        name: state.users.find((u) => u.id === id)?.name ?? 'Estudiante',
        skills: skillsOf(state, id),
        detail: detailOf(state, id),
        coordinator: p.coordinatorId === id,
      })),
    }))
}

/**
 * Lo que ve el docente al entrar: estudiantes postulados y equipos armados. Cuando todavía no hay
 * ninguno, completa con los del caso de ejemplo para que se vea cómo queda, sin cargarlos en la demo.
 */
export function teacherOverview(state: DemoState, user: User): TeacherOverview {
  const students = studentRows(state)
  const teams = teamRows(state, user)
  if (students.length > 0 && teams.length > 0) {
    return { students, teams, studentsIllustrative: false, teamsIllustrative: false }
  }
  const example = createExampleState()
  const exampleTeacher = example.users.find((u) => u.role === 'supervisor') as User
  return {
    students: students.length > 0 ? students : studentRows(example),
    teams: teams.length > 0 ? teams : teamRows(example, exampleTeacher),
    studentsIllustrative: students.length === 0,
    teamsIllustrative: teams.length === 0,
  }
}
