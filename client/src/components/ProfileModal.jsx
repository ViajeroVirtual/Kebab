import React, { useState, useEffect } from 'react';
import { X, User, Lock, LogOut, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ onClose, totalUserRatings }) {
  const { user, updateProfile, logout } = useAuth();

  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
    setMessage('');
    setLoading(true);

    try {
      const res = await updateProfile({
        new_username: newUsername !== user.username ? newUsername : undefined,
        new_password: newPassword ? newPassword : undefined,
        current_password: currentPassword || undefined
      });
      setMessage(res.message || 'Perfil actualizado con éxito');
      setNewPassword('');
      setCurrentPassword('');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
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
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base text-white uppercase shadow-sm"
              style={{ backgroundColor: user?.avatar_color || '#DC2626' }}
            >
              {user?.username ? user.username.slice(0, 1) : '?'}
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">{user?.username}</h3>
              <p className="text-xs font-medium text-ink-muted tabular-nums">
                {totalUserRatings} {totalUserRatings === 1 ? 'establecimiento valorado' : 'establecimientos valorados'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0"/>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Nombre de usuario
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Cambiar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña (opcional)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
              />
            </div>

            {newPassword && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Contraseña actual para confirmar"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
                />
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
            <button
              type="button"
              onClick={() => { logout(); onClose(); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <LogOut className="w-4 h-4"/>
              <span>Cerrar sesión</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4"/>
              <span>{loading ? 'Guardando...' : 'Guardar cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
