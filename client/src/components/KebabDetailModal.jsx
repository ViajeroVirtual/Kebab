import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Navigation, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CRITERIA_CONFIG, calculateContribution, getScoreBadgeColor } from '../utils/formula';

export default function KebabDetailModal({ kebab, onClose, onRateClick, currentUserId, onDeleteRating }) {
  const [expandedUser, setExpandedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  if (!kebab) return null;

  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);
  const mapsUrl =
    kebab.google_maps_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-kebab-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-modal-in pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Real Establishment Photo Header with Overlaid Badges */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-neutral-900 shrink-0">
          {kebab.image_url ? (
            <img
              src={kebab.image_url}
              alt={kebab.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-50">
              <span className="text-5xl" role="img" aria-label="Kebab">🌯</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

          {/* Close Button Top Right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5"/>
          </button>

          {/* Title & Info Overlaid on Photo */}
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 text-white flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/25 mb-1.5">
                {kebab.zone}
              </span>

              <h2 id="modal-kebab-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight line-clamp-1 drop-shadow-sm">
                {kebab.name}
              </h2>

              <p className="text-xs text-white/90 flex items-center gap-1.5 mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0"/>
                <span className="truncate">{kebab.address}</span>
              </p>
            </div>

            {/* Score Badge */}
            <div className={`flex flex-col items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl tabular-nums shadow-lg shrink-0 ${getScoreBadgeColor(kebab.average_score)}`}>
              <div className="flex items-center gap-1 font-extrabold text-xl sm:text-2xl leading-none">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current"/>
                <span>
                  {kebab.average_score !== null && kebab.average_score !== undefined
                    ? kebab.average_score.toFixed(1)
                    : '—'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold opacity-95 mt-0.5">
                {kebab.ratings?.length || 0} {kebab.ratings?.length === 1 ? 'voto' : 'votos'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Bar (Thumb-friendly mobile touch buttons) */}
        <div className="grid grid-cols-2 gap-2 p-3 sm:p-4 border-b border-neutral-100 bg-neutral-50/70 shrink-0">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-3 rounded-xl bg-white text-ink text-xs sm:text-sm font-semibold border border-neutral-200/80 shadow-sm hover:bg-neutral-100 transition-colors"
          >
            <Navigation className="w-4 h-4 text-brand-600 shrink-0"/>
            <span>Cómo llegar</span>
          </a>

          <button
            type="button"
            onClick={() => onRateClick(kebab)}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-3 rounded-xl bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-brand-700 active:scale-[0.98] transition-all"
          >
            <Edit3 className="w-4 h-4 shrink-0"/>
            <span>{userRating ? 'Editar mi nota' : 'Valorar kebab'}</span>
          </button>
        </div>

        {/* Body Content (Scrollable Reviews) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {kebab.description && (
            <div className="p-3.5 rounded-2xl bg-surface border border-neutral-200/60">
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                {kebab.description}
              </p>
            </div>
          )}

          {/* Community Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Reseñas de la comunidad ({kebab.ratings?.length || 0})
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
                      className="p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white uppercase shrink-0 overflow-hidden shadow-sm"
                            style={{ backgroundColor: rating.avatar_color || '#DC2626' }}
                          >
                            {rating.avatar_url && (rating.avatar_url.startsWith('http') || rating.avatar_url.startsWith('data:image')) ? (
                              <img src={rating.avatar_url} alt={rating.username} className="w-full h-full object-cover" />
                            ) : rating.avatar_url ? (
                              <span className="text-base leading-none">{rating.avatar_url}</span>
                            ) : (
                              rating.username ? rating.username.slice(0, 1) : '?'
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-ink text-sm truncate">
                                {rating.username}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] sm:text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.2 rounded-full border border-brand-200/60 shrink-0">
                                  Tú
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-ink-muted block mt-0.5">
                              {new Date(rating.updated_at || rating.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface text-sm font-extrabold text-ink tabular-nums">
                            <Star className="w-3.5 h-3.5 text-brand-600 fill-current"/>
                            <span>{parseFloat(rating.final_score).toFixed(1)}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedUser(isExpanded ? null : rating.user_id)}
                            aria-label="Ver desglose por criterios"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                          >
                            <span className="hidden sm:inline">Desglose</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                          </button>

                          {isCurrent && (
                            confirmDelete ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteRating(kebab.id);
                                    setConfirmDelete(false);
                                  }}
                                  className="px-2 py-1 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
                                >
                                  Borrar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(false)}
                                  className="px-2 py-1 rounded-lg text-xs font-medium text-ink-muted hover:bg-surface"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(true)}
                                aria-label="Borrar mi valoración"
                                className="p-1.5 rounded-lg text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {rating.comment && (
                        <p className="mt-3 text-xs sm:text-sm text-ink bg-surface p-3 rounded-xl leading-relaxed">
                          {rating.comment}
                        </p>
                      )}

                      {/* Criteria Breakdown (Clean Mobile-Friendly List) */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                          {CRITERIA_CONFIG.map((config) => {
                            const rawScore = rating[config.id];
                            const contrib = calculateContribution(rawScore, config.maxPoints);
                            const percent = (rawScore || 0) * 10;

                            return (
                              <div key={config.id} className="p-2.5 rounded-xl bg-surface/80 border border-neutral-200/60 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-base shrink-0">{config.icon}</span>
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-ink block truncate">
                                      {config.label}
                                    </span>
                                    <span className="text-[10px] text-ink-muted block truncate">
                                      Peso {config.percentage} • máx. {config.maxPoints} pts
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs font-extrabold text-ink tabular-nums block">
                                    {rawScore !== undefined && rawScore !== null ? parseFloat(rawScore).toFixed(1) : '-'} / 10
                                  </span>
                                  <span className="text-[10px] font-semibold text-brand-600 tabular-nums block">
                                    +{contrib.toFixed(2)} pts
                                  </span>
                                </div>
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
              <div className="p-8 text-center rounded-2xl bg-surface border border-neutral-200/80">
                <span className="text-3xl block mb-2" role="img" aria-label="Estrella">⭐</span>
                <p className="text-sm font-bold text-ink">Aún no hay puntuaciones</p>
                <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                  Sé el primero en calificar este kebab con la fórmula oficial de AlgeKebab.
                </p>
                <button
                  type="button"
                  onClick={() => onRateClick(kebab)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
                >
                  Puntuar este local
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
