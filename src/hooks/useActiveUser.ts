import type { User } from '../types'
import { useDemo } from './useDemo'

/** Usuario de demostración activo, o null si todavía no eligió ninguno. */
export function useActiveUser(): User | null {
  const { state } = useDemo()
  return state.users.find((u) => u.id === state.activeUserId) ?? null
}
