import React, { useState } from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Lock, User, AlertCircle } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ha ocurrido un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-[#dc2626] border-b-2 border-[#dc2626]'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <LogIn size={16} />
            Iniciar Sesión
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-[#dc2626] border-b-2 border-[#dc2626]'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <UserPlus size={16} />
            Crear Cuenta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
              <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User size={16} className="text-[#86868b]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                className="w-full pl-10 pr-4 py-3 text-sm text-[#1d1d1f] placeholder-gray-400 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock size={16} className="text-[#86868b]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full pl-10 pr-4 py-3 text-sm text-[#1d1d1f] placeholder-gray-400 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {activeTab === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
                {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#86868b]">
            Tu sesión se mantendrá iniciada en este dispositivo.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
