import React from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { LogIn, PlusCircle, Settings, User } from 'lucide-react';

const Header = ({ onOpenFormula, onOpenAddKebab, onOpenProfile, onOpenAuth }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenFormula}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors rounded-lg hover:bg-gray-50"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Criterios</span>
            </button>

            {user && (
              <button
                onClick={onOpenAddKebab}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors rounded-lg"
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Nuevo Kebab</span>
              </button>
            )}

            {user ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] transition-colors"
              >
                {user.username ? user.username.charAt(0).toUpperCase() : <User size={16} />}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#dc2626] border border-[#dc2626]/30 hover:border-[#dc2626] hover:bg-red-50 transition-colors rounded-lg"
              >
                <LogIn size={16} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
