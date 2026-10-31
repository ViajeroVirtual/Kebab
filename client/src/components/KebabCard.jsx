import React from 'react';
import { MapPin, Star, Navigation, ChevronRight, Award } from 'lucide-react';
import { getScoreBadgeColor } from '../utils/formula';

export default function KebabCard({ kebab, rank, onClick, onRateClick, currentUserId }) {
  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);
  const badgeColorClass = getScoreBadgeColor(kebab.average_score);

  const mapsUrl =
    kebab.google_maps_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`;

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-b from-[#161821] to-[#11131a] hover:from-[#1b1e2a] hover:to-[#14161f] border border-white/[0.08] hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between"
    >
      <div>
        {/* Imagen del Kebab con badges */}
        <div className="h-44 w-full relative overflow-hidden bg-slate-900">
          <img
            src={kebab.image_url}
            alt={kebab.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-[#11131a]/40 to-black/30" />

          {/* Rank Badge */}
          {rank && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-black text-xs border border-white/20 shadow-md">
              <span className="text-amber-400">#{rank}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Algeciras</span>
            </div>
          )}

          {/* Average note badge */}
          <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-2xl font-black text-sm border shadow-xl backdrop-blur-md ${badgeColorClass}`}>
            <Star className="w-4 h-4 fill-current" />
            <span>{kebab.average_score !== null ? kebab.average_score.toFixed(1) : '-.-'}</span>
          </div>

          {/* Zona en la parte inferior de la foto */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-xs text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-[220px]">{kebab.zone}</span>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-5">
          <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
            {kebab.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1 mb-3">
            {kebab.address}
          </p>

          {kebab.description && (
            <p className="text-xs text-slate-300/80 line-clamp-2 mb-4 leading-relaxed font-normal">
              {kebab.description}
            </p>
          )}

          {/* Botón destacado directo: Cómo llegar en Google Maps */}
          <div className="mb-4">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-3.5 rounded-xl bg-white/[0.05] hover:bg-orange-500/15 border border-white/[0.1] hover:border-orange-500/40 text-slate-200 hover:text-orange-300 font-bold text-xs flex items-center justify-center gap-2 transition-all group/btn shadow-sm"
              title="Abrir GPS en Google Maps"
            >
              <Navigation className="w-4 h-4 text-orange-400 group-hover/btn:translate-x-0.5 transition-transform" />
              <span>Cómo llegar (Abrir Maps)</span>
            </a>
          </div>

          {/* Puntuaciones de Amigos */}
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
              <span>Notas de la peña:</span>
              <span className="text-slate-500">{kebab.ratings?.length || 0} {kebab.ratings?.length === 1 ? 'voto' : 'votos'}</span>
            </div>

            {kebab.ratings && kebab.ratings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kebab.ratings.map(r => (
                  <div
                    key={r.id || r.user_id}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white uppercase shadow-inner"
                      style={{ backgroundColor: r.avatar_color || '#f97316' }}
                    >
                      {r.username ? r.username.slice(0, 1) : '?'}
                    </div>
                    <span className="text-slate-300 font-semibold">{r.username}</span>
                    <span className="font-black text-amber-400">
                      {r.final_score ? parseFloat(r.final_score).toFixed(1) : '-'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-1">
                Aún no lo habéis probado. ¡Sé el primero en puntuarlo!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer de la tarjeta */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1 text-amber-400/90 group-hover:text-amber-300 transition-colors">
          Ver desglose y comentarios
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>

        {userRating && (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
            Tu nota: {userRating.final_score}
          </span>
        )}
      </div>
    </div>
  );
}
