import React from 'react';
import { MapPin, Star, MessageSquare, ChevronRight, User } from 'lucide-react';
import { getScoreBadgeColor } from '../utils/formula';

export default function KebabCard({ kebab, onClick, onRateClick, currentUserId }) {
  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);
  const badgeColorClass = getScoreBadgeColor(kebab.average_score);

  return (
    <div
      onClick={onClick}
      className="group relative bg-surface-100 hover:bg-surface-200 border border-surface-border hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/30 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Zone + Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-brand-400 font-medium bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{kebab.zone}</span>
          </div>

          {/* Average note badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-sm border ${badgeColorClass}`}>
            <Star className="w-4 h-4 fill-current" />
            <span>{kebab.average_score !== null ? kebab.average_score.toFixed(1) : '-.-'}</span>
          </div>
        </div>

        {/* Kebab Name */}
        <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1 mb-1">
          {kebab.name}
        </h3>

        {/* Address */}
        <p className="text-xs text-slate-400 line-clamp-1 mb-3">
          {kebab.address}
        </p>

        {/* Description snippet */}
        {kebab.description && (
          <p className="text-xs text-slate-300/80 line-clamp-2 mb-4 leading-relaxed">
            {kebab.description}
          </p>
        )}
      </div>

      <div>
        {/* Friends Ratings Pills */}
        <div className="pt-3 border-t border-surface-border/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>Puntuaciones de amigos:</span>
            <span>{kebab.ratings?.length || 0} {kebab.ratings?.length === 1 ? 'voto' : 'votos'}</span>
          </div>

          {kebab.ratings && kebab.ratings.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {kebab.ratings.map(r => (
                <div
                  key={r.id || r.user_id}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-lg bg-surface-50 border border-surface-border text-xs"
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase"
                    style={{ backgroundColor: r.avatar_color || '#f97316' }}
                  >
                    {r.username ? r.username.slice(0, 1) : '?'}
                  </div>
                  <span className="text-slate-300 font-medium">{r.username}:</span>
                  <span className="font-bold text-brand-400">
                    {r.final_score ? parseFloat(r.final_score).toFixed(1) : '-'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-1">
              Aún nadie ha votado este kebab. ¡Sé el primero!
            </p>
          )}
        </div>

        {/* Action footer */}
        <div className="mt-4 pt-3 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-slate-200">
          <span className="flex items-center gap-1 text-brand-400/90 hover:text-brand-300">
            Ver desglose completo
            <ChevronRight className="w-3.5 h-3.5" />
          </span>

          {userRating && (
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Ya votaste ({userRating.final_score})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
