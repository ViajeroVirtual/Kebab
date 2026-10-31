import React, { useState } from 'react';
import { X, Star, MapPin, Navigation, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CRITERIA_CONFIG, calculateContribution, getScoreBadgeColor } from '../utils/formula';

export default function KebabDetailModal({ kebab, onClose, onRateClick, currentUserId, onDeleteRating }) {
  const [expandedUser, setExpandedUser] = useState(null);

  if (!kebab) return null;

  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);

  const mapsUrl =
    kebab.google_maps_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-600">
              {kebab.zone}
            </span>

            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              {kebab.name}
            </h2>

            <p className="text-sm text-[#86868b] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#86868b] shrink-0" />
              <span>{kebab.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Score badge */}
            {kebab.average_score !== null && kebab.average_score !== undefined ? (
              <div className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl bg-red-600 text-white">
                <div className="flex items-center gap-1.5 font-bold text-2xl leading-none">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{kebab.average_score.toFixed(1)}</span>
                </div>
                <span className="text-[10px] uppercase font-medium tracking-wider text-red-100 mt-1">
                  Media ({kebab.ratings?.length || 0})
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-400">
                <div className="flex items-center gap-1.5 font-bold text-2xl leading-none">
                  <Star className="w-5 h-5" />
                  <span>—</span>
                </div>
                <span className="text-[10px] uppercase font-medium tracking-wider text-gray-400 mt-1">
                  Sin votos
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Cómo llegar */}
          <div className="p-4 rounded-xl bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-[#86868b] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-[#1d1d1f]">
                  ¿Quieres ir a comer aquí?
                </h4>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Abre la ruta en Google Maps.
                </p>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir en Google Maps</span>
            </a>
          </div>

          {/* Rate Section */}
          <div className="p-4 rounded-xl bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-[#1d1d1f]">
                {userRating ? 'Tu valoración' : '¿Has probado este kebab?'}
              </h4>
              <p className="text-xs text-[#86868b] mt-0.5">
                {userRating
                  ? `Tu valoración: ${parseFloat(userRating.final_score).toFixed(1)} / 10. Puedes editarla.`
                  : 'Puntúa este kebab con la fórmula oficial.'}
              </p>
            </div>

            <button
              onClick={() => onRateClick(kebab)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>{userRating ? 'Editar nota' : 'Puntuar'}</span>
            </button>
          </div>

          {/* Ratings List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-[#1d1d1f]">
                Valoraciones
              </h3>
              <span className="text-xs font-medium text-[#86868b] bg-gray-100 px-2 py-0.5 rounded-full">
                {kebab.ratings?.length || 0}
              </span>
            </div>

            {kebab.ratings && kebab.ratings.length > 0 ? (
              <div className="space-y-3">
                {kebab.ratings.map(rating => {
                  const isCurrent = rating.user_id === currentUserId;
                  const isExpanded = expandedUser === rating.user_id;

                  return (
                    <div
                      key={rating.id || rating.user_id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-red-50/50 border-red-100'
                          : 'bg-white border-[#e5e5e5]'
                      }`}
                    >
                      {/* User Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white uppercase"
                            style={{ backgroundColor: rating.avatar_color || '#dc2626' }}
                          >
                            {rating.username ? rating.username.slice(0, 1) : '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1d1d1f] text-sm">
                                {rating.username}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                  Tú
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#86868b]">
                              {new Date(rating.updated_at || rating.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Score */}
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-[#1d1d1f] font-semibold text-sm">
                            <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                            <span>{parseFloat(rating.final_score).toFixed(1)}</span>
                          </div>

                          {/* Expand toggle */}
                          <button
                            onClick={() => setExpandedUser(isExpanded ? null : rating.user_id)}
                            className="p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {/* Delete button */}
                          {isCurrent && (
                            <button
                              onClick={() => {
                                if (window.confirm('¿Seguro que quieres borrar tu puntuación de este kebab?')) {
                                  onDeleteRating(kebab.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Borrar mi puntuación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      {rating.comment && (
                        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">
                          "{rating.comment}"
                        </div>
                      )}

                      {/* Expanded Criteria Breakdown */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                          {CRITERIA_CONFIG.map(config => {
                            const rawScore = rating[config.id];
                            const contrib = calculateContribution(rawScore, config.maxPoints);

                            return (
                              <div key={config.id} className="p-2.5 rounded-lg bg-gray-50">
                                <span className="text-lg block mb-1">{config.icon}</span>
                                <span className="text-[10px] text-[#86868b] font-medium block truncate">
                                  {config.label}
                                </span>
                                <span className="text-xs font-semibold text-[#1d1d1f] block mt-0.5">
                                  {parseFloat(rawScore || 0).toFixed(1)} <span className="text-[10px] text-[#86868b]">/ 10</span>
                                </span>
                                <span className="text-[10px] font-semibold text-red-600 block mt-0.5">
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
              <div className="text-center py-8 px-4 rounded-xl bg-gray-50">
                <p className="text-sm text-[#86868b]">
                  Aún no hay valoraciones. ¡Sé el primero en puntuar!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
