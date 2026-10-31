import React, { useState, useEffect } from 'react';
import { X, Star, Save, AlertCircle } from 'lucide-react';
import { CRITERIA_CONFIG, calculateFormulaScore, calculateContribution } from '../utils/formula';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Valorar
            </span>
            <h3 className="text-xl font-bold text-[#1d1d1f] line-clamp-1 mt-0.5">
              {kebab.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Live Score Preview */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-gray-600">Nota final calculada</span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Kebab (6 pts) + Ubicación (1) + Atención (1) + Precio (1) + Local (1)
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-red-600 text-white flex items-center gap-1.5 text-2xl font-bold shadow-sm">
              <Star className="w-5 h-5 fill-current" />
              <span>{liveFinalScore.toFixed(1)}</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Criteria Sliders */}
          <div className="space-y-4">
            {CRITERIA_CONFIG.map(crit => {
              const currentVal = scores[crit.id];
              const contrib = calculateContribution(currentVal, crit.maxPoints);

              return (
                <div key={crit.id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-[#1d1d1f]">{crit.label}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        (hasta {crit.maxPoints} pts)
                      </span>
                    </div>

                    <div className="text-sm font-bold text-red-600 px-2 py-0.5 rounded bg-white border border-gray-200 shadow-sm">
                      {currentVal.toFixed(1)} / 10
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>{crit.description}</span>
                    <span className="font-semibold text-gray-700">
                      Suma: +{contrib.toFixed(2)} pts
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={currentVal}
                    onChange={(e) => handleSliderChange(crit.id, e.target.value)}
                    className="w-full cursor-pointer"
                  />
                  
                  <div className="flex justify-between text-[10px] text-gray-400">
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
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
              Comentario u opinión personal (opcional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué tal el pan, la carne, las salsas o el trato?"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-[#1d1d1f] placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm disabled:opacity-50 transition-colors"
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
