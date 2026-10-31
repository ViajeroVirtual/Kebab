import React from 'react';
import { MapPin, Star, Navigation, ChevronRight } from 'lucide-react';
import { getScoreBadgeColor } from '../utils/formula';

export default function KebabCard({ kebab, rank, onClick, onRateClick, currentUserId }) {
  const userRating = kebab.ratings?.find(r => r.user_id === currentUserId);

  const mapsUrl =
    kebab.google_maps_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg flex flex-col justify-between"
    >
      <div>
        {/* Kebab Image */}
        <div className="h-48 w-full relative overflow-hidden">
          {kebab.image_url ? (
            <img
              src={kebab.image_url}
              alt={kebab.name}
              className="w-full h-full object-cover rounded-t-2xl group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-t-2xl flex items-center justify-center">
              <span className="text-gray-300 text-4xl">🌯</span>
            </div>
          )}

          {/* Zone badge — bottom-left over image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-gray-600 font-medium px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span className="truncate max-w-[180px]">{kebab.zone}</span>
          </div>

          {/* Score badge — top-right over image */}
          {kebab.average_score !== null && kebab.average_score !== undefined ? (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 text-white text-sm font-semibold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{kebab.average_score.toFixed(1)}</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-200 text-gray-400 text-sm font-medium">
              <span>—</span>
            </div>
          )}
        </div>

        {/* Info Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {kebab.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
            {kebab.address}
          </p>

          {kebab.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2 leading-relaxed">
              {kebab.description}
            </p>
          )}

          {/* Cómo llegar */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium mt-3 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Cómo llegar</span>
          </a>

          {/* Friend rating pills */}
          <div className="border-t border-gray-50 pt-4 mt-4">
            {kebab.ratings && kebab.ratings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kebab.ratings.map(r => (
                  <div
                    key={r.id || r.user_id}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-gray-100 text-xs"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white uppercase"
                      style={{ backgroundColor: r.avatar_color || '#dc2626' }}
                    >
                      {r.username ? r.username.slice(0, 1) : '?'}
                    </div>
                    <span className="text-gray-700 font-medium">{r.username}</span>
                    <span className="font-semibold text-gray-900">
                      {r.final_score ? parseFloat(r.final_score).toFixed(1) : '-'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Aún no hay valoraciones. ¡Sé el primero!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 font-medium transition-colors">
          Ver detalles
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>

        {userRating && (
          <span className="text-xs font-semibold text-red-600">
            Tu nota: {parseFloat(userRating.final_score).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
