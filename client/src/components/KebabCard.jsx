import React from 'react';
import { MapPin, Star, Navigation, Edit3, MessageSquare } from 'lucide-react';
import { getScoreBadgeColor } from '../utils/formula';

export default function KebabCard({ kebab, rank, onClick, onRateClick, currentUserId }) {
  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);
  const ratingsCount = kebab.ratings?.length || 0;

  const mapsUrl =
    kebab.google_maps_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`;

  const getRankBadgeStyle = (position) => {
    if (position === 1) return 'bg-amber-400 text-ink border-amber-300 shadow-sm';
    if (position === 2) return 'bg-neutral-200 text-ink border-neutral-300 shadow-sm';
    if (position === 3) return 'bg-amber-700 text-white border-amber-600 shadow-sm';
    return 'bg-ink/80 text-white backdrop-blur-md border-white/15';
  };

  return (
    <article
      onClick={onClick}
      className="group relative bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Media Header */}
        <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-neutral-100">
          {kebab.image_url ? (
            <img
              src={kebab.image_url}
              alt={kebab.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl" role="img" aria-label="Kebab">🌯</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top Left: Rank Badge */}
          {rank && (
            <div
              className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-extrabold tracking-tight border tabular-nums ${getRankBadgeStyle(rank)}`}
            >
              #{rank}
            </div>
          )}

          {/* Top Right: Score Badge */}
          <div
            className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold tabular-nums shadow-sm ${getScoreBadgeColor(kebab.average_score)}`}
          >
            <Star className="w-3.5 h-3.5 fill-current"/>
            <span>
              {kebab.average_score !== null && kebab.average_score !== undefined
                ? kebab.average_score.toFixed(1)
                : 'Sin nota'}
            </span>
          </div>

          {/* Bottom Left & Right: Zone & Reviews Pills */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0"/>
              <span className="truncate">{kebab.zone}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-full tabular-nums">
              <MessageSquare className="w-3 h-3"/>
              <span>{ratingsCount}</span>
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-1">
            {kebab.name}
          </h2>

          <p className="text-xs font-medium text-ink-muted line-clamp-1 mt-0.5 sm:mt-1">
            {kebab.address}
          </p>

          {kebab.description && (
            <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 mt-2 leading-relaxed">
              {kebab.description}
            </p>
          )}

          {/* Community Rating Pills */}
          <div className="border-t border-neutral-100 pt-3 mt-3 sm:mt-4">
            {ratingsCount > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {kebab.ratings.slice(0, 3).map(r => (
                  <div
                    key={r.id || r.user_id}
                    className="inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-surface text-xs border border-neutral-200/60"
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0 overflow-hidden"
                      style={{ backgroundColor: r.avatar_color || '#DC2626' }}
                    >
                      {r.avatar_url && (r.avatar_url.startsWith('http') || r.avatar_url.startsWith('data:image')) ? (
                        <img src={r.avatar_url} alt={r.username} className="w-full h-full object-cover" />
                      ) : r.avatar_url ? (
                        <span className="text-[10px] leading-none">{r.avatar_url}</span>
                      ) : (
                        r.username ? r.username.slice(0, 1) : '?'
                      )}
                    </span>
                    <span className="text-ink font-medium truncate max-w-[65px] sm:max-w-[80px]">{r.username}</span>
                    <span className="font-bold text-ink tabular-nums">
                      {r.final_score ? parseFloat(r.final_score).toFixed(1) : '-'}
                    </span>
                  </div>
                ))}
                {ratingsCount > 3 && (
                  <span className="text-xs font-semibold text-ink-muted px-2 py-0.5 rounded-full bg-surface">
                    +{ratingsCount - 3} más
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs font-medium text-ink-muted">
                Sé la primera persona en valorar este local.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer (Generous touch targets for thumbs) */}
      <div className="px-4 py-3 sm:px-5 sm:py-3 border-t border-neutral-100 flex items-center justify-between gap-2 bg-neutral-50/50">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink min-h-[38px] px-3 rounded-xl hover:bg-neutral-200/60 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-brand-600"/>
          <span>Cómo llegar</span>
        </a>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRateClick(kebab);
          }}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold min-h-[38px] px-3.5 rounded-xl transition-all ${
            userRating
              ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200/60'
              : 'bg-ink text-white hover:bg-brand-600 shadow-sm active:scale-[0.98]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5"/>
          <span className="tabular-nums">
            {userRating ? `Tu nota: ${parseFloat(userRating.final_score).toFixed(1)}` : 'Valorar'}
          </span>
        </button>
      </div>
    </article>
  );
}
