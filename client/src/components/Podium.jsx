import React from 'react';
import { Crown, Medal, Star, MapPin, Navigation, ChevronRight } from 'lucide-react';

export default function Podium({ topKebabs, onKebabClick }) {
  if (!topKebabs || topKebabs.length < 3) return null;

  const [first, second, third] = topKebabs;

  const getMapsUrl = (kebab) => {
    return (
      kebab.google_maps_url ||
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(kebab.name + ' ' + kebab.address + ' Algeciras')}`
    );
  };

  return (
    <div className="relative mb-12">
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-red-500/10 blur-3xl -z-10 rounded-3xl" />

      {/* Título de sección */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Crown className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Hall of Fame <span className="text-amber-400 text-sm font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">Top 3 Algeciras</span>
            </h2>
            <p className="text-xs text-slate-400">
              Los tres mejores puntuados según la fórmula oficial
            </p>
          </div>
        </div>
      </div>

      {/* Grid del Podio (1º en el centro en desktop, orden natural 2 - 1 - 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        
        {/* ================= 🥈 2º PUESTO (Plata) ================= */}
        <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-slate-500 transition-all duration-300">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-200 border border-slate-500/40 text-xs font-black shadow-sm">
            <Medal className="w-4 h-4 text-slate-300" />
            <span>#2 PLATA</span>
          </div>

          <div className="mt-8 mb-4">
            <div className="h-32 rounded-2xl overflow-hidden relative mb-3">
              <img
                src={second.image_url}
                alt={second.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white">
                <span className="font-semibold truncate">{second.zone}</span>
                <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-amber-400 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {second.average_score?.toFixed(1) || '-.-'}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
              {second.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{second.address}</p>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
            <button
              onClick={() => onKebabClick(second)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              Ver notas
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={getMapsUrl(second)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-400 border border-slate-700 hover:border-orange-500/40 transition-colors"
              title="Abrir en Google Maps"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ================= 🥇 1º PUESTO (Oro - El Rey) ================= */}
        <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-black border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl shadow-amber-500/20 relative overflow-hidden group hover:border-amber-400 transition-all duration-300 transform md:-translate-y-4">
          {/* Badge Corona */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black shadow-lg shadow-amber-500/30">
            <Crown className="w-4 h-4 fill-black text-black" />
            <span>#1 REY DE ALGECIRAS</span>
          </div>

          <div className="mt-8 mb-4">
            <div className="h-44 rounded-2xl overflow-hidden relative mb-3 ring-1 ring-amber-500/30">
              <img
                src={first.image_url}
                alt={first.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-amber-300 border border-amber-500/30 truncate">
                  {first.zone}
                </span>
                <span className="flex items-center gap-1 bg-amber-500 text-black px-3 py-1 rounded-xl font-black text-sm shadow-md">
                  <Star className="w-4 h-4 fill-black" />
                  {first.average_score?.toFixed(1) || '-.-'}
                </span>
              </div>
            </div>

            <h3 className="font-extrabold text-xl text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {first.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 mt-1">{first.address}</p>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-amber-500/30">
            <button
              onClick={() => onKebabClick(first)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              Ver notas del Rey
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href={getMapsUrl(first)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs flex items-center gap-1 transition-all"
              title="Abrir en Google Maps para llegar ya"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Cómo llegar</span>
            </a>
          </div>
        </div>

        {/* ================= 🥉 3º PUESTO (Bronce) ================= */}
        <div className="order-3 bg-gradient-to-b from-amber-950/20 to-slate-900/90 border border-amber-900/50 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-700 transition-all duration-300">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50 text-xs font-black shadow-sm">
            <Medal className="w-4 h-4 text-amber-400" />
            <span>#3 BRONCE</span>
          </div>

          <div className="mt-8 mb-4">
            <div className="h-32 rounded-2xl overflow-hidden relative mb-3">
              <img
                src={third.image_url}
                alt={third.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white">
                <span className="font-semibold truncate">{third.zone}</span>
                <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-amber-400 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {third.average_score?.toFixed(1) || '-.-'}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
              {third.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{third.address}</p>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
            <button
              onClick={() => onKebabClick(third)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              Ver notas
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={getMapsUrl(third)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-400 border border-slate-700 hover:border-orange-500/40 transition-colors"
              title="Abrir en Google Maps"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
