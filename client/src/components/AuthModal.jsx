import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  // Acceso rápido con 1 clic para Marcos y Pablo (útil para pruebas)
  const handleQuickLogin = async (presetUser, presetPass) => {
    setError('');
    setLoading(true);
    try {
      await login(presetUser, presetPass);
      onClose();
    } catch (err) {
      // Si la cuenta aún no existe en una DB recién creada, la registramos automáticamente
      try {
        await register(presetUser, presetPass);
        onClose();
      } catch (regErr) {
        setError(regErr.message || 'Error al conectar con el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-surface-100 border border-surface-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥙</span>
            <div>
              <h3 className="text-base font-bold text-white">
                {isRegister ? 'Crear cuenta de amigo' : 'Iniciar sesión'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Tu sesión se quedará guardada en este dispositivo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-surface-border bg-surface-50/50 p-1">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isRegister
                ? 'bg-surface-200 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isRegister
                ? 'bg-surface-200 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Crear Nueva Cuenta
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: Marcos, Pablo..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Podrás cambiar tanto el usuario como la contraseña más adelante en tu perfil.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Cargando...' : (isRegister ? 'Registrarme' : 'Entrar')}</span>
          </button>

          {/* Quick preset buttons */}
          {!isRegister && (
            <div className="pt-4 border-t border-surface-border/60">
              <span className="block text-[11px] font-semibold text-slate-400 mb-2 text-center">
                O acceso rápido para pruebas:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Pablo', 'pablo123')}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors"
                >
                  Entrar como Pablo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Marcos', 'marcos123')}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                >
                  Entrar como Marcos
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
