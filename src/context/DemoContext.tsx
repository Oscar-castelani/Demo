import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { loadState, resetState, saveState } from '../services/storageService'
import { setProjectStatus, updateClosureField } from '../services/closureService'
import { addTaskComment, changeTaskStatus, createTask, updateTask } from '../services/taskService'
import {
  addDeliverableComment, registerDeliverable, resubmitDeliverable, reviewDeliverable,
} from '../services/deliverableService'
import type { RegisterDeliverableInput, ReviewDecision } from '../services/deliverableService'
import {
  addApplicationComment, applyToProject, reviewApplication, submitAnotherApplication, submitBusinessApplication,
  submitStudentProfile,
} from '../services/applicationService'
import type { BusinessApplicationInput, ReviewAction } from '../services/applicationService'
import {
  addTeamMember, removeTeamMember, respondToInterest, setCoordinator, setMaxMembers,
} from '../services/teamService'
import type { ProjectInfoValues, StudentValues } from '../utils/applicationValidation'
import type { CreateTaskInput, TaskInput } from '../services/taskService'
import type { ClosureField, DemoState, ProjectStatus, TaskStatus } from '../types'

export type Action =
  | { type: 'setActiveUser'; userId: string | null }
  | { type: 'replace'; state: DemoState }
  | { type: 'createTask'; actorId: string; input: CreateTaskInput }
  | { type: 'updateTask'; actorId: string; taskId: string; patch: TaskInput }
  | { type: 'changeTaskStatus'; actorId: string; taskId: string; status: TaskStatus; observation?: string }
  | { type: 'updateClosureField'; actorId: string; projectId: string; field: ClosureField; value: string }
  | { type: 'setProjectStatus'; actorId: string; projectId: string; status: ProjectStatus }
  | { type: 'addTaskComment'; actorId: string; taskId: string; content: string }
  | { type: 'registerDeliverable'; actorId: string; input: RegisterDeliverableInput }
  | { type: 'reviewDeliverable'; actorId: string; deliverableId: string; decision: ReviewDecision; comment: string }
  | { type: 'resubmitDeliverable'; actorId: string; deliverableId: string }
  | { type: 'addDeliverableComment'; actorId: string; deliverableId: string; content: string }
  | { type: 'submitBusinessApplication'; input: BusinessApplicationInput }
  | { type: 'submitStudentProfile'; input: StudentValues }
  | { type: 'submitAnotherApplication'; actorId: string; input: ProjectInfoValues }
  | { type: 'reviewApplication'; actorId: string; applicationId: string; action: ReviewAction; note: string; maxMembers: number }
  | { type: 'addApplicationComment'; actorId: string; applicationId: string; content: string }
  | { type: 'applyToProject'; actorId: string; projectId: string; message: string }
  | { type: 'respondToInterest'; actorId: string; interestId: string; decision: 'accepted' | 'declined' }
  | { type: 'addTeamMember'; actorId: string; projectId: string; studentId: string }
  | { type: 'removeTeamMember'; actorId: string; projectId: string; studentId: string }
  | { type: 'setCoordinator'; actorId: string; projectId: string; studentId: string | null }
  | { type: 'setMaxMembers'; actorId: string; projectId: string; size: number }

function reducer(state: DemoState, action: Action): DemoState {
  if (action.type === 'setActiveUser') return { ...state, activeUserId: action.userId }
  if (action.type === 'replace') return action.state
  // Estas dos acciones crean a la persona: todavía no hay un usuario que actúe.
  if (action.type === 'submitBusinessApplication') return submitBusinessApplication(state, action.input)
  if (action.type === 'submitStudentProfile') return submitStudentProfile(state, action.input)

  const actor = state.users.find((u) => u.id === action.actorId)
  if (!actor) return state
  switch (action.type) {
    case 'createTask':
      return createTask(state, action.input, actor)
    case 'updateTask':
      return updateTask(state, action.taskId, action.patch, actor)
    case 'changeTaskStatus':
      return changeTaskStatus(state, action.taskId, action.status, actor, action.observation)
    case 'updateClosureField':
      return updateClosureField(state, action.projectId, action.field, action.value, actor)
    case 'setProjectStatus':
      return setProjectStatus(state, action.projectId, action.status, actor)
    case 'addTaskComment':
      return addTaskComment(state, action.taskId, action.content, actor)
    case 'registerDeliverable':
      return registerDeliverable(state, action.input, actor)
    case 'reviewDeliverable':
      return reviewDeliverable(state, action.deliverableId, action.decision, action.comment, actor)
    case 'resubmitDeliverable':
      return resubmitDeliverable(state, action.deliverableId, actor)
    case 'addDeliverableComment':
      return addDeliverableComment(state, action.deliverableId, action.content, actor)
    case 'submitAnotherApplication':
      return submitAnotherApplication(state, action.input, actor)
    case 'reviewApplication':
      return reviewApplication(state, action.applicationId, action.action, action.note, action.maxMembers, actor)
    case 'addApplicationComment':
      return addApplicationComment(state, action.applicationId, action.content, actor)
    case 'applyToProject':
      return applyToProject(state, action.projectId, action.message, actor)
    case 'respondToInterest':
      return respondToInterest(state, action.interestId, action.decision, actor)
    case 'addTeamMember':
      return addTeamMember(state, action.projectId, action.studentId, actor)
    case 'removeTeamMember':
      return removeTeamMember(state, action.projectId, action.studentId, actor)
    case 'setCoordinator':
      return setCoordinator(state, action.projectId, action.studentId, actor)
    case 'setMaxMembers':
      return setMaxMembers(state, action.projectId, action.size, actor)
  }
}

export interface DemoContextValue {
  state: DemoState
  dispatch: (action: Action) => void
  /** Restablece los datos originales. Llamar solo después de confirmar con la persona. */
  reset: () => void
  /** Mensaje de advertencia de almacenamiento, si lo hay. */
  warning: string | null
  dismissWarning: () => void
}

export const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadState)
  const [state, setState] = useState<DemoState>(initial.state)
  const [warning, setWarning] = useState<string | null>(initial.warning ?? null)
  const stateRef = useRef(state)

  // Cada cambio se guarda en el mismo momento en que se aplica.
  const commit = useCallback((next: DemoState) => {
    if (next === stateRef.current) return
    stateRef.current = next
    setState(next)
    if (!saveState(next)) {
      setWarning('No se pudieron guardar los cambios en el navegador.')
    }
  }, [])

  const dispatch = useCallback(
    (action: Action) => commit(reducer(stateRef.current, action)),
    [commit],
  )

  const reset = useCallback(() => {
    const fresh = resetState()
    stateRef.current = fresh
    setState(fresh)
    setWarning(null)
  }, [])

  const dismissWarning = useCallback(() => setWarning(null), [])

  const value = useMemo(
    () => ({ state, dispatch, reset, warning, dismissWarning }),
    [state, dispatch, reset, warning, dismissWarning],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
