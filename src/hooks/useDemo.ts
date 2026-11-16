import { useContext } from 'react'
import { DemoContext } from '../context/DemoContext'
import type { DemoContextValue } from '../context/DemoContext'

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo debe usarse dentro de <DemoProvider>')
  return ctx
}
