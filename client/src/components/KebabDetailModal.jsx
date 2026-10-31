import React, { useState } from 'react';
import { X, Star, MapPin, Navigation, Edit3, Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { CRITERIA_CONFIG, calculateContribution, getScoreBadgeColor } from '../utils/formula';

export default function KebabDetailModal({ kebab, onClose, onRateClick, currentUserId, onDeleteRating }) {
  const [expandedUser, setExpandedUser] = useState(null);

  if (!kebab) return null;

  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);
  const badgeColorClass = getScoreBadgeColor(kebab.average_score);

  const mapsUrl =
    kebab.google_maps_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#12141c] border border-white/[0.12] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar con imagen y badge */}
        <div className="relative p-6 sm:p-7 border-b border-white/[0.08] bg-gradient-to-r from-slate-900 to-[#161824] flex items-start justify-between gap-4">
          <div className="space-y-2 max-w-[70%]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {kebab.zone}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {kebab.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{kebab.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Nota Media Badge */}
            <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl border shadow-xl ${badgeColorClass}`}>
              <div className="flex items-center gap-1.5 font-black text-2xl leading-none">
                <Star className="w-5 h-5 fill-current" />
                <span>{kebab.average_score !== null ? kebab.average_score.toFixed(1) : '-.-'}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                Media ({kebab.ratings?.length || 0})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Botón Gigante de Navegación GPS */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600/20 via-amber-600/10 to-transparent border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-400" />
                ¿Quieres ir a comer aquí?
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Abre la ruta directamente en Google Maps o en el navegador de tu móvil.
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
            >
              <Navigation className="w-4 h-4 fill-black" />
              <span>Cómo llegar (Abrir Maps)</span>
            </a>
          </div>

          {/* Acción para Puntuar */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                {userRating ? 'Tu veredicto en este kebab' : '¿Has probado este kebab?'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {userRating
                  ? `Tu nota actual es ${parseFloat(userRating.final_score).toFixed(1)} / 10. Puedes modificarla o cambiar tu comentario.`
                  : 'Puntúa el kebab con la fórmula oficial (carne, salsas, atención, precio y local).'}
              </p>
            </div>

            <button
              onClick={() => onRateClick(kebab)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-600/30 transition-all shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>{userRating ? 'Editar mi nota' : 'Puntuar este Kebab'}</span>
            </button>
          </div>

          {/* Lista de Puntuaciones por Amigo */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>Veredictos de la Peña</span>
                <span className="text-xs text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  {kebab.ratings?.length || 0}
                </span>
              </h3>
            </div>

            {kebab.ratings && kebab.ratings.length > 0 ? (
              <div className="space-y-3">
                {kebab.ratings.map(rating => {
                  const isCurrent = rating.user_id === currentUserId;
                  const isExpanded = expandedUser === rating.user_id;

                  return (
                    <div
                      key={rating.id || rating.user_id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-500/[0.04] border-amber-500/30 ring-1 ring-amber-500/20'
                          : 'bg-white/[0.02] border-white/[0.07] hover:border-white/[0.15]'
                      }`}
                    >
                      {/* Cabecera del usuario */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white uppercase shadow-md ring-1 ring-white/20"
                            style={{ backgroundColor: rating.avatar_color || '#f97316' }}
                          >
                            {rating.username ? rating.username.slice(0, 1) : '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-sm">
                                {rating.username}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-400/30">
                                  Tú
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {new Date(rating.updated_at || rating.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Nota final del amigo */}
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.05] border border-white/[0.1] text-amber-400 font-black text-base">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{parseFloat(rating.final_score).toFixed(1)}</span>
                          </div>

                          {/* Botón desplegar desglose */}
                          <button
                            onClick={() => setExpandedUser(isExpanded ? null : rating.user_id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                            title="Ver desglose detallado"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {/* Borrar si es propio */}
                          {isCurrent && (
                            <button
                              onClick={() => {
                                if (window.confirm('¿Seguro que quieres borrar tu puntuación de este kebab?')) {
                                  onDeleteRating(kebab.id);
                                }
                              }}
                              className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              title="Borrar mi puntuación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comentario / Veredicto */}
                      {rating.comment && (
                        <div className="mt-3 text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/[0.04] leading-relaxed italic">
                          "{rating.comment}"
                        </div>
                      )}

                      {/* Desglose de Criterios (Acordeón) */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center animate-fade-in">
                          {Object.entries(CRITERIA_CONFIG).map(([key, config]) => {
                            const rawScore = rating[`${key}_score`];
                            const contrib = calculateContribution(key, rawScore);

                            return (
                              <div key={key} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                <span className="text-lg block mb-1">{config.icon}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">
                                  {config.name}
                                </span>
                                <span className="text-xs font-black text-white block mt-0.5">
                                  {parseFloat(rawScore || 0).toFixed(1)} <span className="text-[10px] text-slate-500">/ 10</span>
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 block mt-0.5">
                                  +{contrib.toFixed(2)} pts
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.08]">
                <p className="text-xs text-slate-400">
                  Ningún colega ha puntuado este kebab todavía. Sé el primero y fija la media.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
