import { CAMPO_TRAMPA } from '@/lib/forms'

/**
 * Honeypot antispam. Una persona no lo ve ni llega a él con Tab, pero un bot
 * que rellena todos los inputs del HTML sí lo completa, y postForm descarta ese
 * envío. Se saca de pantalla en vez de usar `display: none` porque algunos bots
 * se saltan los campos ocultos de esa forma.
 */
export function CampoTrampa() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={CAMPO_TRAMPA}>No completar este campo</label>
      <input id={CAMPO_TRAMPA} name={CAMPO_TRAMPA} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
