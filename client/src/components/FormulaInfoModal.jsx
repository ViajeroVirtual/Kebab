import React from 'react';
import { X, Calculator, CheckCircle2 } from 'lucide-react';
import { CRITERIA_CONFIG } from '../utils/formula';

export default function FormulaInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-surface-100 border border-surface-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Fórmula Oficial del Grupo
              </h3>
              <p className="text-[11px] text-slate-400">
                Puntuaciones de 0 a 10 con conversión automática
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 leading-relaxed">
            ✨ <strong>Fácil y sin decimales:</strong> Al votar ponéis una nota limpia del 0 al 10 en cada aspecto. El sistema hace el cálculo automático según los puntos máximos de cada categoría.
          </div>

          {/* Table of criteria */}
          <div className="space-y-2">
            {CRITERIA_CONFIG.map(crit => (
              <div 
                key={crit.id}
                className="p-3 rounded-xl bg-surface-50 border border-surface-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{crit.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{crit.label}</h4>
                    <p className="text-[11px] text-slate-400">{crit.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-black text-brand-400">
                    {crit.weightLabel}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {crit.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Example card */}
          <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-border text-xs text-slate-300 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Ejemplo de cálculo (Kebab La Isla):
            </span>
            <div className="space-y-1 font-mono text-[11px] text-slate-400">
              <p>• <strong>Pablo:</strong> Kebab (4/6) + Ubicación (1/1) + Atención (1/1) + Precio (0.4/1) + Local (0.3/1) = <span className="text-brand-400 font-bold">6.7 / 10</span></p>
              <p>• <strong>Marcos:</strong> Kebab (4/6) + Ubicación (1/1) + Atención (1/1) + Precio (0.35/1) + Local (0.75/1) = <span className="text-emerald-400 font-bold">7.1 / 10</span></p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-surface-200 hover:bg-surface-300 border border-surface-border transition-colors"
            >
              Cerrar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
