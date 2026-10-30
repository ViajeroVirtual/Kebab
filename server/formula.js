// ============================================================
// FÓRMULA DE PUNTUACIÓN DE KEBABS (ALGECIRAS)
// ============================================================
// Puntuación sobre 10 en cada aspecto:
// - Kebab: Puntuado de 0 a 10, vale hasta 6 puntos de la nota final (6/6)
// - Ubicación: Puntuado de 0 a 10, vale hasta 1 punto (1/1)
// - Atención del moro: Puntuado de 0 a 10, vale hasta 1 punto (1/1)
// - Calidad-Precio: Puntuado de 0 a 10, vale hasta 1 punto (1/1)
// - Local-Presentación: Puntuado de 0 a 10, vale hasta 1 punto (1/1)
// TOTAL MÁXIMO = 6 + 1 + 1 + 1 + 1 = 10 PUNTOS

const CRITERIA_CONFIG = {
  kebab: { maxPoints: 6.0, multiplier: 0.6 },
  ubicacion: { maxPoints: 1.0, multiplier: 0.1 },
  atencion: { maxPoints: 1.0, multiplier: 0.1 },
  calidad_precio: { maxPoints: 1.0, multiplier: 0.1 },
  local_presentacion: { maxPoints: 1.0, multiplier: 0.1 }
};

/**
 * Calcula la nota final sumando las aportaciones de cada criterio
 * Los inputs vienen en escala de 0 a 10 (ej: 7 en ubicación = 0.7 puntos)
 */
function calculateFinalScore(scores) {
  const kebabRaw = parseFloat(scores.kebab_score) || 0;
  const ubicacionRaw = parseFloat(scores.ubicacion_score) || 0;
  const atencionRaw = parseFloat(scores.atencion_score) || 0;
  const calidadPrecioRaw = parseFloat(scores.calidad_precio_score) || 0;
  const localPresentacionRaw = parseFloat(scores.local_presentacion_score) || 0;

  const contribKebab = (kebabRaw / 10) * CRITERIA_CONFIG.kebab.maxPoints;
  const contribUbicacion = (ubicacionRaw / 10) * CRITERIA_CONFIG.ubicacion.maxPoints;
  const contribAtencion = (atencionRaw / 10) * CRITERIA_CONFIG.atencion.maxPoints;
  const contribCalidadPrecio = (calidadPrecioRaw / 10) * CRITERIA_CONFIG.calidad_precio.maxPoints;
  const contribLocalPresentacion = (localPresentacionRaw / 10) * CRITERIA_CONFIG.local_presentacion.maxPoints;

  const total = contribKebab + contribUbicacion + contribAtencion + contribCalidadPrecio + contribLocalPresentacion;

  return Math.round(total * 10) / 10;
}

module.exports = {
  CRITERIA_CONFIG,
  calculateFinalScore
};
