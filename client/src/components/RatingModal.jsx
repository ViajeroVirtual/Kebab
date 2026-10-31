import React, { useState, useEffect } from 'react';
import { X, Star, Save, AlertCircle, Plus, Minus } from 'lucide-react';
import { CRITERIA_CONFIG, calculateFormulaScore, calculateContribution, getScoreBadgeColor } from '../utils/formula';

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
      [criterionId]: Math.min(10, Math.max(0, Math.round(parseFloat(val) * 10) / 10))
    }));
  };

  const handleStep = (criterionId, delta) => {
    setScores(prev => {
      const cur = prev[criterionId] || 0;
      const next = Math.min(10, Math.max(0, Math.round((cur + delta) * 10) / 10));
      return { ...prev, [criterionId]: next };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Sticky Header with Live Score */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-600 block">
              Evaluación ponderada
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-ink truncate mt-0.5">
              {kebab.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Live Calculated Badge */}
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-extrabold text-base sm:text-lg shadow-sm tabular-nums ${getScoreBadgeColor(liveFinalScore)}`}>
              <Star className="w-4 h-4 fill-current"/>
              <span>{liveFinalScore.toFixed(1)}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="p-1.5 sm:p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>
          )}

          {/* Sliders Container */}
          <div className="space-y-3">
            {CRITERIA_CONFIG.map(crit => {
              const currentVal = scores[crit.id] || 0;
              const contrib = calculateContribution(currentVal, crit.maxPoints);

              return (
                <div key={crit.id} className="p-3.5 rounded-2xl bg-surface/70 border border-neutral-200/70 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor={`slider-${crit.id}`} className="text-xs sm:text-sm font-bold text-ink flex items-center gap-1.5 truncate">
                      <span>{crit.icon}</span>
                      <span className="truncate">{crit.label}</span>
                      <span className="text-[10px] sm:text-xs font-medium text-ink-muted shrink-0">({crit.percentage})</span>
                    </label>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStep(crit.id, -0.5)}
                        aria-label="Disminuir nota"
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-ink hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5"/>
                      </button>

                      <span className="text-xs sm:text-sm font-extrabold text-brand-600 px-2 py-0.5 rounded-lg bg-white border border-neutral-200 shadow-sm tabular-nums min-w-[50px] text-center">
                        {currentVal.toFixed(1)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleStep(crit.id, 0.5)}
                        aria-label="Aumentar nota"
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-ink hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="truncate max-w-[70%]">{crit.description}</span>
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
                </div>
              );
            })}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="rating-comment" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Tu reseña u observaciones (opcional)
            </label>
            <textarea
              id="rating-comment"
              rows="2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué tal las salsas, el pan, la cantidad de carne o el trato?"
              className="w-full p-3 rounded-xl bg-surface border border-neutral-200 text-xs sm:text-sm text-ink placeholder-ink-muted focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
            />
          </div>
        </div>

        {/* Sticky Action Footer (Always accessible on mobile above keyboard & bottom bar) */}
        <div className="p-3 sm:p-4 border-t border-neutral-100 bg-white/95 backdrop-blur-md shrink-0 pb-safe">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 min-h-[46px] rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-sm disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4"/>
            <span>
              {submitting ? 'Guardando nota...' : `Guardar valoración (${liveFinalScore.toFixed(1)} / 10)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
