// Configuración centralizada de identidad de marca.
// Cambia `name`, `prefix` y `accent` si deseas usar "Kebab Infinity" o "AlgeKebab".
export const BRAND_CONFIG = {
  name: 'AlgeKebab',      // Ej: 'Kebab Infinity' o 'AlgeKebab'
  prefix: 'Alge',         // Ej: 'Kebab '
  accent: 'Kebab',        // Ej: 'Infinity'
  city: 'Algeciras',
  tagline: 'El ranking definitivo de kebabs en Algeciras, evaluado al detalle por la comunidad.'
};

export const CRITERIA_CONFIG = [
  {
    id: 'kebab_score',
    label: 'Sabor, Carne y Pan',
    icon: '🌯',
    maxPoints: 6.0,
    multiplier: 0.6,
    weightLabel: 'Hasta 6.0 ptos',
    percentage: '60%',
    description: 'Calidad y jugosidad de la carne, pan tostado, salsas y sabor global'
  },
  {
    id: 'ubicacion_score',
    label: 'Ubicación y Acceso',
    icon: '📍',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1.0 pto',
    percentage: '10%',
    description: 'Zona en Algeciras, facilidad de aparcamiento y cercanía'
  },
  {
    id: 'atencion_score',
    label: 'Atención y Servicio',
    icon: '🤝',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1.0 pto',
    percentage: '10%',
    description: 'Trato al cliente, rapidez en el pedido, amabilidad y generosidad'
  },
  {
    id: 'calidad_precio_score',
    label: 'Calidad / Precio',
    icon: '💶',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1.0 pto',
    percentage: '10%',
    description: 'Relación entre el coste del menú, el tamaño y la cantidad de relleno'
  },
  {
    id: 'local_presentacion_score',
    label: 'Local y Presentación',
    icon: '🏪',
    maxPoints: 1.0,
    multiplier: 0.1,
    weightLabel: 'Hasta 1.0 pto',
    percentage: '10%',
    description: 'Higiene del establecimiento, firmeza del dürüm y presentación'
  }
];

export function calculateFormulaScore(scores) {
  const k = parseFloat(scores.kebab_score) || 0;
  const u = parseFloat(scores.ubicacion_score) || 0;
  const a = parseFloat(scores.atencion_score) || 0;
  const p = parseFloat(scores.calidad_precio_score) || 0;
  const l = parseFloat(scores.local_presentacion_score) || 0;

  const total = (k * 0.6) + (u * 0.1) + (a * 0.1) + (p * 0.1) + (l * 0.1);
  return Math.round(total * 10) / 10;
}

export function calculateContribution(rawScore, maxPoints) {
  const val = parseFloat(rawScore) || 0;
  return Math.round((val / 10) * maxPoints * 100) / 100;
}

export function getScoreBadgeColor(score) {
  if (score === null || score === undefined) {
    return 'bg-neutral-900/75 text-white/90 backdrop-blur-md border border-white/15';
  }
  if (score >= 8.5) return 'bg-emerald-600 text-white shadow-sm';
  if (score >= 7.0) return 'bg-brand-600 text-white shadow-sm';
  if (score >= 5.0) return 'bg-amber-500 text-white shadow-sm';
  return 'bg-neutral-600 text-white shadow-sm';
}
