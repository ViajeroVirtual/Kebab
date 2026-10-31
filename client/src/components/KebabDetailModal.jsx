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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-modal flex flex-col overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-start justify-between gap-4 bg-white">
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700">
              {kebab.zone}
            </span>

            <h2 id="modal-kebab-title" className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
              {kebab.name}
            </h2>

            <p className="text-xs sm:text-sm text-ink-muted flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0"/>
              <span className="truncate">{kebab.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`flex flex-col items-center justify-center px-3.5 py-2 rounded-2xl tabular-nums ${getScoreBadgeColor(kebab.average_score)}`}>
              <div className="flex items-center gap-1 font-extrabold text-xl sm:text-2xl leading-none">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current"/>
                <span>
                  {kebab.average_score !== null && kebab.average_score !== undefined
                    ? kebab.average_score.toFixed(1)
                    : '—'}
                </span>
              </div>
              <span className="text-xs font-medium opacity-90 mt-1">
                {kebab.ratings?.length || 0} {kebab.ratings?.length === 1 ? 'voto' : 'votos'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana"
              className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-surface flex items-center justify-between gap-3 border border-neutral-200/60">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Cómo llegar</p>
                <p className="text-sm font-semibold text-ink truncate mt-0.5">{kebab.address}</p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-ink bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl shadow-sm transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-600"/>
                <span>Mapa</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  {userRating ? 'Tu puntuación' : '¿Lo has probado?'}
                </p>
                <p className="text-sm font-semibold text-ink truncate mt-0.5 tabular-nums">
                  {userRating ? `Has votado un ${parseFloat(userRating.final_score).toFixed(1)} / 10` : 'Valora con la fórmula oficial'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRateClick(kebab)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5"/>
                <span>{userRating ? 'Editar' : 'Valorar'}</span>
              </button>
            </div>
          </div>

          {/* Community Reviews List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
              Reseñas de la comunidad ({kebab.ratings?.length || 0})
            </h3>

            {kebab.ratings && kebab.ratings.length > 0 ? (
              <div className="space-y-3">
                {kebab.ratings.map(rating => {
                  const isCurrent = rating.user_id === currentUserId;
                  const isExpanded = expandedUser === rating.user_id;

                  return (
                    <div
                      key={rating.id || rating.user_id}
                      className="p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
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
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-ink text-sm truncate">
                                {rating.username}
                              </span>
                              {isCurrent && (
                                <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                                  Tú
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-ink-muted block">
                              {new Date(rating.updated_at || rating.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-sm font-extrabold text-ink tabular-nums">
                            <Star className="w-4 h-4 text-brand-600 fill-current"/>
                            <span>{parseFloat(rating.final_score).toFixed(1)}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedUser(isExpanded ? null : rating.user_id)}
                            aria-label="Ver desglose por criterios"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface transition-colors"
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
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
                                >
                                  Confirmar
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
                        <p className="mt-3 text-sm text-ink bg-surface p-3.5 rounded-xl leading-relaxed">
                          {rating.comment}
                        </p>
                      )}

                      {/* Criteria Breakdown (Fixed Iteration over CRITERIA_CONFIG Array) */}
                      {isExpanded && (
                        <div className="mt-3.5 pt-3.5 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                          {CRITERIA_CONFIG.map((config) => {
                            const rawScore = rating[config.id];
                            const contrib = calculateContribution(rawScore, config.maxPoints);

                            return (
                              <div key={config.id} className="p-2.5 rounded-xl bg-surface border border-neutral-200/50">
                                <span className="text-xs text-ink-muted font-medium block truncate">
                                  {config.icon} {config.label}
                                </span>
                                <span className="text-sm font-bold text-ink block mt-1 tabular-nums">
                                  {parseFloat(rawScore || 0).toFixed(1)} / 10
                                </span>
                                <span className="text-xs font-semibold text-brand-600 block mt-0.5 tabular-nums">
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
              <div className="p-8 rounded-2xl bg-surface text-center">
                <p className="text-sm font-medium text-ink-muted">
                  Aún no hay reseñas para este establecimiento. ¡Anímate a estrenar el marcador!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
