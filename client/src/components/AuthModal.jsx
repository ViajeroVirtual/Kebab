import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Lock, User, AlertCircle } from 'lucide-react';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-modal overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <Logo size="sm"/>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="grid grid-cols-2 border-b border-neutral-100 bg-surface/50 p-1.5 mx-6 mt-5 rounded-xl">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              isLogin ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              !isLogin ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"/>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. pablo_algeciras"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink placeholder-ink-muted/60 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"/>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink placeholder-ink-muted/60 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4"/>
                <span>Entrar a la plataforma</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4"/>
                <span>Crear cuenta gratis</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
