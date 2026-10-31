import React from 'react';
import { X, Calculator, CheckCircle2 } from 'lucide-react';
import { CRITERIA_CONFIG } from '../utils/formula';

export default function FormulaInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Fórmula Oficial del Grupo
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Puntuaciones de 0 a 10 con conversión automática
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 leading-relaxed">
            <strong>Fácil y sin decimales:</strong> Al votar ponéis una nota limpia del 0 al 10 en cada aspecto. El sistema hace el cálculo automático según los puntos máximos de cada categoría.
          </div>

          {/* Table of criteria */}
          <div className="space-y-2">
            {CRITERIA_CONFIG.map(crit => (
              <div 
                key={crit.id}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{crit.icon}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">{crit.label}</h4>
                    <p className="text-[11px] text-gray-500">{crit.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-bold text-red-600">
                    {crit.weightLabel}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {crit.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Example card */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-2">
            <span className="text-[10px] uppercase font-semibold text-gray-500 block tracking-wider">
              Ejemplo de cálculo (Kebab La Isla):
            </span>
            <div className="space-y-1 font-mono text-[11px] text-gray-500">
              <p>Pablo: Kebab (4/6) + Ubicación (1/1) + Atención (1/1) + Precio (0.4/1) + Local (0.3/1) = <span className="text-red-600 font-bold">6.7 / 10</span></p>
              <p>Marcos: Kebab (4/6) + Ubicación (1/1) + Atención (1/1) + Precio (0.35/1) + Local (0.75/1) = <span className="text-red-600 font-bold">7.1 / 10</span></p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
