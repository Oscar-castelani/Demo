/**
 * Enlace para saltar al contenido principal: aparece al navegar con el teclado. Es un botón y no un
 * ancla porque la aplicación usa la parte del enlace después de # para sus rutas.
 */
export function SkipLink() {
  return (
    <button
      type="button"
      className="skip-link"
      onClick={() => {
        const main = document.querySelector<HTMLElement>('main')
        main?.focus()
        main?.scrollIntoView({ block: 'start' })
      }}
    >
      Saltar al contenido
    </button>
  )
}
