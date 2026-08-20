/**
 * Pequeña utilidad para escalonar peticiones HTTP y evitar ráfagas de
 * peticiones concurrentes contra Dolibarr (que pueden saturar LiteSpeed/PHP
 * y provocar 503/timeouts cuando varios contadores se cargan a la vez).
 *
 * @param {number} ms Milisegundos a esperar
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
