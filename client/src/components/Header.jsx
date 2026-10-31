import React from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { LogIn, Plus, SlidersHorizontal, User } from 'lucide-react';

export default function Header({ onOpenFormula, onOpenAddKebab, onOpenProfile, onOpenAuth }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-200/70 transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="#top" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg shrink-0">
            <Logo size="md"/>
          </a>

          <nav className="flex items-center gap-1.5 sm:gap-2.5" aria-label="Navegación principal">
            <button
              type="button"
              onClick={onOpenFormula}
              title="Ver fórmula y ponderación"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-ink-muted hover:text-ink hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-600 shrink-0"/>
              <span className="hidden xs:inline">Fórmula</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={onOpenAddKebab}
                title="Añadir nuevo establecimiento"
                className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4"/>
                <span className="hidden sm:inline">Añadir Local</span>
              </button>
            )}

            {user ? (
              <button
                type="button"
                onClick={onOpenProfile}
                aria-label="Abrir perfil de usuario"
                className="inline-flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-ink text-xs sm:text-sm font-semibold transition-colors"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm overflow-hidden shrink-0"
                  style={{ backgroundColor: user.avatar_color || '#DC2626' }}
                >
                  {user.avatar_url && (user.avatar_url.startsWith('http') || user.avatar_url.startsWith('data:image')) ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : user.avatar_url ? (
                    <span className="text-sm leading-none">{user.avatar_url}</span>
                  ) : user.username ? (
                    user.username.charAt(0)
                  ) : (
                    <User className="w-3.5 h-3.5"/>
                  )}
                </span>
                <span className="hidden md:inline max-w-[110px] truncate">{user.username}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-ink bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4 text-brand-600 shrink-0"/>
                <span>Acceder</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
