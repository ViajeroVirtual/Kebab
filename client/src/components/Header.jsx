import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogIn, PlusCircle, Sliders } from 'lucide-react';
import Logo from './Logo';

export default function Header({ onOpenAuth, onOpenProfile, onOpenAddKebab, onOpenFormula }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0c0d12]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Logotipo Oficial */}
        <Logo size="md" />

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Fórmula de Puntuación */}
          <button
            onClick={onOpenFormula}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all hover:text-white"
            title="Ver fórmula y pesos de puntuación"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Criterios Oficiales</span>
          </button>

          {/* Botón Añadir Kebab (Solo logueados) */}
          {user && (
            <button
              onClick={onOpenAddKebab}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all shadow-md shadow-orange-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Kebab</span>
            </button>
          )}

          {/* Perfil o Iniciar Sesión */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] transition-all group"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white uppercase shadow-md ring-1 ring-white/20"
                style={{ backgroundColor: user.avatar_color || '#f97316' }}
              >
                {user.username.slice(0, 1)}
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                {user.username}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar / Votar</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
