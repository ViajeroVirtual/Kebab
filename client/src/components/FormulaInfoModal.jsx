import React, { useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import { CRITERIA_CONFIG } from '../utils/formula';

export default function FormulaInfoModal({ onClose }) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60">
              <Calculator className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-ink">
                Algoritmo Oficial de Puntuación
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Metodología transparente sobre 10 puntos
              </p>
            </div>
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

        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/60 text-xs text-brand-800 leading-relaxed">
            <strong>Ponderación Inteligente:</strong> Cada criterio se evalúa de 0 a 10 de forma intuitiva. El sistema calcula automáticamente la nota final otorgando un <strong>60% del peso a la calidad gastronómica</strong> (carne, pan y salsas).
          </div>

          <div className="space-y-2.5">
            {CRITERIA_CONFIG.map(crit => (
              <div
                key={crit.id}
                className="p-3.5 rounded-2xl bg-surface border border-neutral-200/70 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{crit.icon}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-ink">{crit.label}</h4>
                    <p className="text-xs text-ink-muted mt-0.5">{crit.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 tabular-nums">
                  <span className="block text-xs font-extrabold text-brand-600">
                    {crit.weightLabel}
                  </span>
                  <span className="text-xs font-medium text-ink-muted">
                    {crit.percentage} del total
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-neutral-200/70 text-xs text-ink-muted text-center tabular-nums">
            <strong>Fórmula:</strong> 6.0 (Sabor) + 1.0 (Ubicación) + 1.0 (Servicio) + 1.0 (Precio) + 1.0 (Local) = <strong>10.0 Pts Máx.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
