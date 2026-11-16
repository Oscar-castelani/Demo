/** Solo se abren enlaces http(s); evita esquemas como javascript:. */
export function isSafeUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}
