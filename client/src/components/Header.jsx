import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogIn, PlusCircle, Sliders, MapPin } from 'lucide-react';

export default function Header({ onOpenAuth, onOpenProfile, onOpenAddKebab, onOpenFormula }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0e1015]/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo & City Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xl shadow-lg shadow-brand-500/20">
            🥙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">AlgeKebab</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                Algeciras
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Puntuaciones y ranking oficial entre amigos
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Formula info button */}
          <button
            onClick={onOpenFormula}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-surface-100 hover:bg-surface-200 border border-surface-border transition-colors"
            title="Ver fórmula y pesos de puntuación"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Fórmula</span>
          </button>

          {/* Add Kebab Button */}
          {user && (
            <button
              onClick={onOpenAddKebab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo Kebab</span>
            </button>
          )}

          {/* User Profile or Login */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-100 hover:bg-surface-200 border border-surface-border transition-colors group"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-inner"
                style={{ backgroundColor: user.avatar_color || '#f97316' }}
              >
                {user.username.slice(0, 1)}
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                {user.username}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-md shadow-brand-500/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
