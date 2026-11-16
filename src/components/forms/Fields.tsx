import { useId } from 'react'
import type { ReactNode } from 'react'

interface BaseProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
}

function Wrapper({ label, error, hint, required, id, children }: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {hint && <span className="field-hint" id={`${id}-hint`}>{hint}</span>}
      {children}
      {error && <span id={`${id}-err`} className="field-error" role="alert">{error}</span>}
    </div>
  )
}

function describedBy(id: string, error?: string, hint?: string) {
  return [hint ? `${id}-hint` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined
}

interface TextProps extends BaseProps {
  name: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'url'
  placeholder?: string
  maxLength?: number
  autoComplete?: string
}

export function TextField({ label, error, hint, required, name, value, onChange, type = 'text', placeholder, maxLength, autoComplete }: TextProps) {
  const id = useId()
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} id={id}>
      <input
        id={id} name={name} type={type} value={value} placeholder={placeholder} maxLength={maxLength}
        autoComplete={autoComplete} inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
        aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrapper>
  )
}

interface AreaProps extends BaseProps {
  name: string
  value: string
  onChange: (value: string) => void
  rows?: number
  maxLength?: number
  placeholder?: string
}

export function TextArea({ label, error, hint, required, name, value, onChange, rows = 4, maxLength, placeholder }: AreaProps) {
  const id = useId()
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} id={id}>
      <textarea
        id={id} name={name} rows={rows} value={value} maxLength={maxLength} placeholder={placeholder}
        aria-invalid={!!error} aria-required={required} aria-describedby={describedBy(id, error, hint)}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrapper>
  )
}

interface SelectProps extends BaseProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}

export function SelectField({ label, error, hint, required, name, value, onChange, options, placeholder }: SelectProps) {
  const id = useId()
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} id={id}>
      <select
        id={id} name={name} value={value} aria-invalid={!!error} aria-required={required}
        aria-describedby={describedBy(id, error, hint)} onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Wrapper>
  )
}

interface CheckGroupProps {
  legend: string
  error?: string
  hint?: string
  required?: boolean
  name: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}

/** Grupo de casillas con `fieldset` y `legend`, como pide la accesibilidad. */
export function CheckGroup({ legend, error, hint, required, name, options, selected, onChange }: CheckGroupProps) {
  const id = useId()
  const toggle = (value: string) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  return (
    <fieldset className="check-group" aria-describedby={describedBy(id, error, hint)} aria-invalid={!!error}>
      <legend>{legend}{required && <span aria-hidden="true"> *</span>}</legend>
      {hint && <span className="field-hint" id={`${id}-hint`}>{hint}</span>}
      <div className="check-list">
        {options.map((o) => (
          <label key={o.value} className="check-item">
            <input type="checkbox" name={name} value={o.value} checked={selected.includes(o.value)} onChange={() => toggle(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && <span id={`${id}-err`} className="field-error" role="alert">{error}</span>}
    </fieldset>
  )
}

interface CheckboxProps {
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  children: ReactNode
}

export function CheckboxField({ name, checked, onChange, error, children }: CheckboxProps) {
  const id = useId()
  return (
    <div className="field">
      <label className="check-item" htmlFor={id}>
        <input id={id} type="checkbox" name={name} checked={checked} aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.checked)} />
        <span>{children}</span>
      </label>
      {error && <span id={`${id}-err`} className="field-error" role="alert">{error}</span>}
    </div>
  )
}
