import React, { useState, useEffect } from 'react';
import { X, Star, Save, AlertCircle } from 'lucide-react';
import { CRITERIA_CONFIG, calculateFormulaScore, calculateContribution, getScoreBadgeColor } from '../utils/formula';

export default function RatingModal({ kebab, existingRating, onClose, onSave }) {
  const [scores, setScores] = useState({
    kebab_score: 7.0,
    ubicacion_score: 8.0,
    atencion_score: 8.0,
    calidad_precio_score: 7.0,
    local_presentacion_score: 7.0
  });

  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingRating) {
      setScores({
        kebab_score: parseFloat(existingRating.kebab_score) || 7.0,
        ubicacion_score: parseFloat(existingRating.ubicacion_score) || 8.0,
        atencion_score: parseFloat(existingRating.atencion_score) || 8.0,
        calidad_precio_score: parseFloat(existingRating.calidad_precio_score) || 7.0,
        local_presentacion_score: parseFloat(existingRating.local_presentacion_score) || 7.0
      });
      setComment(existingRating.comment || '');
    }
  }, [existingRating]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-surface-100 border border-surface-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
              Puntuar Kebab
            </span>
            <h3 className="text-xl font-bold text-white line-clamp-1">
              {kebab.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Live Score Preview Banner */}
          <div className="p-4 rounded-xl bg-surface-200/90 border border-surface-border flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-semibold">Nota final calculada:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Kebab (6 pts) + Ubicación (1) + Atención (1) + Precio (1) + Presentación (1)
              </p>
            </div>

            <div className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 text-2xl font-black ${getScoreBadgeColor(liveFinalScore)}`}>
              <Star className="w-5 h-5 fill-current" />
              <span>{liveFinalScore.toFixed(1)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Criteria Sliders (0 to 10 input -> automatic conversion) */}
          <div className="space-y-4">
            {CRITERIA_CONFIG.map(crit => {
              const currentVal = scores[crit.id];
              const contrib = calculateContribution(currentVal, crit.maxPoints);

              return (
                <div key={crit.id} className="p-3.5 rounded-xl bg-surface-50 border border-surface-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{crit.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-white">{crit.label}</span>
                        <span className="text-[11px] text-brand-400 font-medium ml-2">
                          (Vale {crit.weightLabel})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Puntuación de 0 a 10 elegida */}
                      <span className="text-xs text-slate-400 font-medium">Nota:</span>
                      <div className="text-sm font-black text-white px-2 py-0.5 rounded bg-surface-200 border border-surface-border">
                        {currentVal.toFixed(1)} / 10
                      </div>
                    </div>
                  </div>

                  {/* Sub-label showing contribution */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-surface-100/80 px-2.5 py-1 rounded-lg border border-surface-border/50">
                    <span>{crit.description}</span>
                    <span className="font-bold text-brand-300">
                      Suma: +{contrib.toFixed(2)} / {crit.maxPoints.toFixed(1)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(crit.id, e.target.value)}
                    className="w-full cursor-pointer accent-brand-500"
                  />
                  
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0 (Suspenso)</span>
                    <span>5 (Normalito)</span>
                    <span>10 (Perfecto)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Personal comment / review */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Comentario u opinión personal (opcional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué tal la carne? ¿La atención del moro fue buena? ¿Tardó mucho?"
              className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surface-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Guardando...' : (existingRating ? 'Actualizar Nota' : 'Guardar Puntuación')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
