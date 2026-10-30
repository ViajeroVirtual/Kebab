import React, { useState } from 'react';
import { X, Star, MapPin, ExternalLink, Edit3, Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { CRITERIA_CONFIG, calculateContribution, getScoreBadgeColor } from '../utils/formula';

export default function KebabDetailModal({ kebab, onClose, onRateClick, currentUserId, onDeleteRating }) {
  const [expandedUser, setExpandedUser] = useState(null);

  if (!kebab) return null;

  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);
  const badgeColorClass = getScoreBadgeColor(kebab.average_score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-surface-100 border border-surface-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-surface-border flex items-start justify-between gap-4 bg-surface-50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {kebab.zone}
              </span>
              {kebab.google_maps_url && (
                <a
                  href={kebab.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>Ver en Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              {kebab.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {kebab.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Main Score Badge */}
            <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${badgeColorClass}`}>
              <div className="flex items-center gap-1 font-extrabold text-xl leading-none">
                <Star className="w-4 h-4 fill-current" />
                <span>{kebab.average_score !== null ? kebab.average_score.toFixed(1) : '-.-'}</span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">
                Media ({kebab.ratings?.length || 0})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Action to Rate */}
          <div className="p-4 rounded-xl bg-surface-200/60 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                {userRating ? 'Tu valoración de este kebab' : '¿Has probado este kebab?'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {userRating
                  ? `Tu nota actual es ${parseFloat(userRating.final_score).toFixed(1)} / 10. Puedes editar tu puntuación cuando quieras.`
                  : 'Puntúa el kebab (sobre 6), ubicación, atención del moro, precio y local.'}
              </p>
            </div>

            <button
              onClick={() => onRateClick(kebab)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>{userRating ? 'Editar mi nota' : 'Puntuar kebab'}</span>
            </button>
          </div>

          {/* Friends Ratings List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Puntuaciones por Amigo ({kebab.ratings?.length || 0})
              </h3>
              <span className="text-xs text-slate-500">
                Haz clic en cada usuario para ver su desglose
              </span>
            </div>

            {kebab.ratings && kebab.ratings.length > 0 ? (
              <div className="space-y-3">
                {kebab.ratings.map(r => {
                  const isCurrent = r.user_id === currentUserId;
                  const isExpanded = expandedUser === r.user_id || expandedUser === null;

                  return (
                    <div
                      key={r.id || r.user_id}
                      className="bg-surface-50 border border-surface-border rounded-xl p-4 transition-all"
                    >
                      {/* User Top Row */}
                      <div 
                        className="flex items-center justify-between cursor-pointer select-none"
                        onClick={() => setExpandedUser(expandedUser === r.user_id ? -1 : r.user_id)}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-inner"
                            style={{ backgroundColor: r.avatar_color || '#f97316' }}
                          >
                            {r.username ? r.username.slice(0, 1) : '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{r.username}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.2 rounded-full border border-brand-500/20">
                                  Tú
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {r.updated_at ? new Date(r.updated_at).toLocaleDateString('es-ES') : 'Reciente'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`px-2.5 py-1 rounded-lg font-extrabold text-sm border ${getScoreBadgeColor(r.final_score)}`}>
                            {parseFloat(r.final_score).toFixed(1)} <span className="text-[10px] font-normal text-slate-400">/ 10</span>
                          </div>
                          <button className="text-slate-400 hover:text-white">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Criteria Breakdown */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-surface-border/60 space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {CRITERIA_CONFIG.map(crit => {
                              const rawVal = parseFloat(r[crit.id]) || 0;
                              const contrib = calculateContribution(rawVal, crit.maxPoints);

                              return (
                                <div key={crit.id} className="p-2.5 rounded-lg bg-surface-100/80 border border-surface-border/60">
                                  <div className="flex items-center justify-between text-slate-300 mb-1">
                                    <span className="flex items-center gap-1.5 font-medium truncate">
                                      <span>{crit.icon}</span>
                                      <span className="truncate">{crit.label.split(' ')[0]}</span>
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="font-extrabold text-white">
                                        {contrib.toFixed(1)} / {crit.maxPoints}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        ({rawVal.toFixed(1)}/10)
                                      </span>
                                    </div>
                                  </div>

                                  {/* Visual bar */}
                                  <div className="w-full bg-surface-300 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-brand-500 h-full rounded-full transition-all"
                                      style={{ width: `${Math.min(100, (contrib / crit.maxPoints) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Comment */}
                          {r.comment && (
                            <div className="mt-2 p-3 rounded-lg bg-surface-100 border border-surface-border/60 text-xs text-slate-200 leading-relaxed flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                              <p className="italic">"{r.comment}"</p>
                            </div>
                          )}

                          {/* Delete own review */}
                          {isCurrent && (
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => onDeleteRating(kebab.id)}
                                className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 hover:underline"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Eliminar mi voto</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-xl bg-surface-50 border border-dashed border-surface-border">
                <span className="text-3xl block mb-2">🌯</span>
                <p className="text-sm font-semibold text-slate-300">
                  Ningún amigo ha puntuado aún este kebab
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ¡Sé el primero en probarlo y registrar tu nota!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
