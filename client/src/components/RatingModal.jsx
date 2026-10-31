import React, { useState, useEffect } from 'react';
import { X, Star, Save, AlertCircle } from 'lucide-react';
import { CRITERIA_CONFIG, calculateFormulaScore, calculateContribution } from '../utils/formula';

export default function RatingModal({ kebab, existingRating, onClose, onSave }) {
  const [scores, setScores] = useState({
    kebab_score: 7.5,
    ubicacion_score: 8.0,
    atencion_score: 8.0,
    calidad_precio_score: 7.5,
    local_presentacion_score: 7.5
  });

  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingRating) {
      setScores({
        kebab_score: parseFloat(existingRating.kebab_score) || 7.5,
        ubicacion_score: parseFloat(existingRating.ubicacion_score) || 8.0,
        atencion_score: parseFloat(existingRating.atencion_score) || 8.0,
        calidad_precio_score: parseFloat(existingRating.calidad_precio_score) || 7.5,
        local_presentacion_score: parseFloat(existingRating.local_presentacion_score) || 7.5
      });
      setComment(existingRating.comment || '');
    }
  }, [existingRating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const liveFinalScore = calculateFormulaScore(scores);

  const handleSliderChange = (criterionId, val) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: parseFloat(val)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSave({
        kebab_id: kebab.id,
        ...scores,
        comment
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la puntuación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal overflow-hidden flex flex-col max-h-[92vh] animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Evaluación ponderada
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-ink truncate mt-0.5">
              {kebab.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Live Score Banner */}
          <div className="p-4 rounded-2xl bg-surface border border-neutral-200/80 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Nota Final Calculada
              </span>
              <p className="text-xs text-ink-muted mt-0.5">
                Sabor (60%) + 4 criterios complementarios (10% c/u)
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-brand-600 text-white flex items-center gap-1.5 text-2xl font-extrabold shadow-sm tabular-nums shrink-0">
              <Star className="w-5 h-5 fill-current"/>
              <span>{liveFinalScore.toFixed(1)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>
          )}

          {/* Sliders */}
          <div className="space-y-3.5">
            {CRITERIA_CONFIG.map(crit => {
              const currentVal = scores[crit.id];
              const contrib = calculateContribution(currentVal, crit.maxPoints);

              return (
                <div key={crit.id} className="p-4 rounded-2xl bg-surface/70 border border-neutral-200/70 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor={`slider-${crit.id}`} className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <span>{crit.icon}</span>
                      <span>{crit.label}</span>
                      <span className="text-xs font-medium text-ink-muted">({crit.percentage})</span>
                    </label>

                    <span className="text-sm font-extrabold text-brand-600 px-2.5 py-0.5 rounded-lg bg-white border border-neutral-200 shadow-sm tabular-nums">
                      {currentVal.toFixed(1)} / 10
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-muted gap-2">
                    <span className="line-clamp-1">{crit.description}</span>
                    <span className="font-semibold text-ink shrink-0 tabular-nums">
                      +{contrib.toFixed(2)} pts
                    </span>
                  </div>

                  <input
                    id={`slider-${crit.id}`}
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(crit.id, e.target.value)}
                    className="w-full"
                  />

                  <div className="flex justify-between text-xs font-medium text-ink-muted tabular-nums">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="rating-comment" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Tu reseña (opcional)
            </label>
            <textarea
              id="rating-comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué tal el tamaño del dürüm, el punto de la carne o las salsas?"
              className="w-full px-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink placeholder-ink-muted/70 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4"/>
              <span>{submitting ? 'Guardando...' : (existingRating ? 'Actualizar Nota' : 'Publicar Valoración')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
