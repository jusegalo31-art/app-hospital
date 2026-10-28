/**
 * SISTEMA DE PUNTUACIÓN SOBRE 100 PUNTOS — "DAR Y RECIBIR"
 * E.S.E. Hospital Universitario Erasmo Meoz
 *
 * Distribución ponderada (Total máximo = 100 puntos):
 * -------------------------------------------------------------------------
 * 1. Reto 1 ("¿Dónde va cada uno?"): 30 puntos máximos
 *    - Compuesto por 6 tarjetas (3 deberes DAR y 3 derechos RECIBIR).
 *    - Valor por tarjeta:
 *      • Acierto al primer intento (0 errores previos en la tarjeta): 5 puntos.
 *      • Acierto tras 1 explicación/corrección (1 error previo): 2 puntos.
 *      • Acierto tras 2 o más errores previos: 0 puntos (permite avanzar aprendiendo).
 *
 * 2. Reto 2 ("¿Qué harías en esta situación?"): 40 puntos máximos
 *    - Compuesto por 5 situaciones cotidianas del hospital.
 *    - Valor por situación:
 *      • Acierto al primer intento (0 errores previos en el caso): 8 puntos.
 *      • Acierto en el segundo intento tras ayuda educativa (1 error): 4 puntos.
 *      • Acierto tras 2 o más errores: 0 puntos.
 *
 * 3. Reto 3 ("Conecta y completa"): 30 puntos máximos
 *    - Compuesto por 6 parejas de concepto-definición divididas en 2 grupos de 3.
 *    - Valor por pareja conectada:
 *      • Conexión correcta al primer intento (0 errores previos en ese concepto): 5 puntos.
 *      • Conexión correcta tras 1 pista educativa (1 error previo): 2 puntos.
 *      • Conexión correcta tras 2 o más errores previos: 0 puntos.
 *
 * Reglas de integridad:
 * - Cada ítem otorga puntos una única vez al ser resuelto (registrado por su ID),
 *   evitando que toques repetidos generen puntos infinitos.
 * - Umbral de aprobación: 60 puntos sobre 100.
 *   • Puntuación >= 60: Aprendizaje completado con felicitación.
 *   • Puntuación < 60: Invitación amable a repasar los conceptos con errores y volver a intentar.
 */

export const MAX_POINTS_CHALLENGE_1 = 30;
export const MAX_POINTS_CHALLENGE_2 = 40;
export const MAX_POINTS_CHALLENGE_3 = 30;
export const PASSING_SCORE = 60;

/**
 * Calcula los puntos obtenidos en una tarjeta del Reto 1 (máx. 5 pts)
 */
export function calculateChallenge1ItemPoints(errorsOnItem: number): number {
  if (errorsOnItem <= 0) return 5;
  if (errorsOnItem === 1) return 2;
  return 0;
}

/**
 * Calcula los puntos obtenidos en una situación del Reto 2 (máx. 8 pts)
 */
export function calculateChallenge2ItemPoints(errorsOnItem: number): number {
  if (errorsOnItem <= 0) return 8;
  if (errorsOnItem === 1) return 4;
  return 0;
}

/**
 * Calcula los puntos obtenidos en una pareja del Reto 3 (máx. 5 pts)
 */
export function calculateChallenge3ItemPoints(errorsOnItem: number): number {
  if (errorsOnItem <= 0) return 5;
  if (errorsOnItem === 1) return 2;
  return 0;
}

/**
 * Limita la puntuación final al rango [0, 100]
 */
export function clampTotalScore(
  c1: number,
  c2: number,
  c3: number
): number {
  const safeC1 = Math.max(0, Math.min(MAX_POINTS_CHALLENGE_1, c1));
  const safeC2 = Math.max(0, Math.min(MAX_POINTS_CHALLENGE_2, c2));
  const safeC3 = Math.max(0, Math.min(MAX_POINTS_CHALLENGE_3, c3));
  return Math.round(safeC1 + safeC2 + safeC3);
}
