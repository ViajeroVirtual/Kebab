import React from 'react';

/**
 * Logotipo oficial de AlgeKebab:
 * Silueta vectorial de un trompo de carne döner kebab vertical en su asador,
 * con cuchillo de corte, brasas ardientes y tipografía urbana.
 */
export default function Logo({ size = 'md', showText = true }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icono del Trompo Döner Kebab */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 p-0.5 shadow-lg shadow-orange-600/30 ring-1 ring-orange-400/40`}>
        <div className="w-full h-full bg-[#121318] rounded-[14px] flex items-center justify-center overflow-hidden p-1.5">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(234,88,12,0.6)]"
          >
            {/* Eje / Espadón vertical de acero */}
            <line x1="32" y1="4" x2="32" y2="60" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="5" r="3" fill="#cbd5e1" />
            <rect x="27" y="58" width="10" height="3" rx="1.5" fill="#64748b" />

            {/* Trompo de carne (forma cónica escalonada de capas) */}
            {/* Capa superior ancha */}
            <path
              d="M16 16C16 14.5 23 13 32 13C41 13 48 14.5 48 16L45 25C44 26 38 27 32 27C26 27 20 26 19 25L16 16Z"
              fill="url(#meatGradient1)"
            />
            {/* Capa media */}
            <path
              d="M19 24C19 24 25 25.5 32 25.5C39 25.5 45 24 45 24L42 36C41 37 36.5 38 32 38C27.5 38 23 37 22 36L19 24Z"
              fill="url(#meatGradient2)"
            />
            {/* Capa inferior estrecha */}
            <path
              d="M22 35C22 35 26.5 36.5 32 36.5C37.5 36.5 42 35 42 35L38 48C37 49 34.5 50 32 50C29.5 50 27 49 26 48L22 35Z"
              fill="url(#meatGradient3)"
            />

            {/* Marcas de corte / tostado de la carne */}
            <path d="M22 20C26 21 31 21 37 19" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M24 30C28 31 33 31 39 29" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M26 41C29 42 33 42 37 40" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

            {/* Cuchillo döner afeitando al lado */}
            <path
              d="M49 16L53 14C53.5 13.7 54.2 14.2 54 14.8L47 42C46.8 42.5 46.1 42.6 45.7 42.2L44 40.5L49 16Z"
              fill="url(#bladeGradient)"
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            <rect x="52" y="11" width="3" height="6" rx="1" transform="rotate(-25 52 11)" fill="#b91c1c" />

            {/* Chispas de fuego / brasa */}
            <circle cx="15" cy="40" r="1.5" fill="#f97316" className="animate-pulse" />
            <circle cx="48" cy="48" r="1.2" fill="#fbbf24" />
            <circle cx="17" cy="28" r="1" fill="#ef4444" />

            <defs>
              <linearGradient id="meatGradient1" x1="16" y1="13" x2="48" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.4" stopColor="#d97706" />
                <stop offset="1" stopColor="#9a3412" />
              </linearGradient>
              <linearGradient id="meatGradient2" x1="19" y1="24" x2="45" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ea580c" />
                <stop offset="0.5" stopColor="#c2410c" />
                <stop offset="1" stopColor="#7c2d12" />
              </linearGradient>
              <linearGradient id="meatGradient3" x1="22" y1="35" x2="42" y2="50" gradientUnits="userSpaceOnUse">
                <stop stopColor="#dc2626" />
                <stop offset="0.5" stopColor="#991b1b" />
                <stop offset="1" stopColor="#450a0a" />
              </linearGradient>
              <linearGradient id="bladeGradient" x1="44" y1="14" x2="54" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="0.6" stopColor="#94a3b8" />
                <stop offset="1" stopColor="#475569" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Tipografía de marca */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-sm font-sans">
              Alge<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">Kebab</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
              Algeciras
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-tight hidden sm:block">
            La Ruta del Kebab Oficial
          </span>
        </div>
      )}
    </div>
  );
}
