// ============================================================
// FÓRMULA OFICIAL DE PUNTUACIÓN DE KEBABS ALGECIRAS
// ============================================================
// Escala de entrada: 0 a 10 en cada criterio.
// Ponderación:
// - Kebab: 6 puntos máximos (multiplicador 0.6)
// - Ubicación: 1 punto máximo (multiplicador 0.1)
// - Atención del moro: 1 punto máximo (multiplicador 0.1)
// - Calidad-Precio: 1 punto máximo (multiplicador 0.1)
// - Local-Presentación: 1 punto máximo (multiplicador 0.1)
// Total = 10 puntos máximos

export const CRITERIA_CONFIG = [
  {
    id: 'kebab_score',
    label: 'Kebab (Carne, Pan y Sabor)',
    icon: '🌯',
    maxPoints: 6.0,
    multiplier: 0.6,
    weightLabel: 'Hasta 6 ptos',
    percentage: '60%',
    description: 'Calidad de la carne, pan crujiente, salsas y sabor general'
  },
  {
    id: 'ubicacion_score',
    label: 'Ubicación',
    icon: '📍',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1 pto',
    percentage: '10%',
    description: 'Zona de Algeciras, cercanía y accesibilidad'
  },
  {
    id: 'atencion_score',
    label: 'Atención del moro',
    icon: '🤝',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1 pto',
    percentage: '10%',
    description: 'Trato al cliente, rapidez, simpatía y generosidad'
  },
  {
    id: 'calidad_precio_score',
    label: 'Calidad-Precio',
    icon: '💶',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1 pto',
    percentage: '10%',
    description: 'Precio del menú/dürum en relación a la cantidad y calidad'
  },
  {
    id: 'local_presentacion_score',
    label: 'Local-Presentación',
    icon: '✨',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1 pto',
    percentage: '10%',
    description: 'Limpieza del local, mesas, empaquetado y que no chorree'
  }
];

export function calculateContribution(rawScoreOutOf10, maxPoints) {
  const val = parseFloat(rawScoreOutOf10) || 0;
  const contrib = (val / 10) * maxPoints;
  return Math.round(contrib * 100) / 100;
}

export function calculateFormulaScore(scores) {
  let total = 0;
  for (const crit of CRITERIA_CONFIG) {
    const val = parseFloat(scores[crit.id]) || 0;
    total += (val / 10) * crit.maxPoints;
  }
  return Math.round(total * 10) / 10;
}

export function getScoreBadgeColor(score) {
  if (score === null || score === undefined) return 'bg-slate-800 text-slate-400 border-slate-700';
  if (score >= 8.0) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (score >= 6.5) return 'bg-lime-500/15 text-lime-400 border-lime-500/30';
  if (score >= 5.0) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  return 'bg-red-500/15 text-red-400 border-red-500/30';
}
