import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, Lock, LogOut, CheckCircle2, AlertCircle, Save, 
  Camera, Image as ImageIcon, Eye, EyeOff, Sparkles, RefreshCw, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PRESET_AVATARS = [
  { id: 'durum', icon: '🌯', label: 'Maestro Dürüm', color: '#DC2626' },
  { id: 'kebab', icon: '🥙', label: 'Rey Kebab', color: '#EA580C' },
  { id: 'crown', icon: '👑', label: 'Crítico Gourmet', color: '#D97706' },
  { id: 'fire', icon: '🌶️', label: 'Salsa Picante', color: '#B91C1C' },
  { id: 'fries', icon: '🍟', label: 'Patatas & Salsa', color: '#F59E0B' },
  { id: 'chef', icon: '👨‍🍳', label: 'Chef Kebab', color: '#059669' },
  { id: 'algeciras', icon: '🦁', label: 'Algeciras Bahía', color: '#0284C7' },
  { id: 'infinity', icon: '⚡', label: 'Kebab Infinity', color: '#7C3AED' },
  { id: 'star', icon: '⭐', label: 'Cinco Estrellas', color: '#EAB308' },
  { id: 'meat', icon: '🥩', label: 'Carne Mixta', color: '#9F1239' }
];

export const PRESET_COLORS = [
  '#DC2626', '#EA580C', '#D97706', '#F59E0B', 
  '#059669', '#0284C7', '#7C3AED', '#DB2777', '#1D1D1F'
];

export default function ProfileModal({ onClose, totalUserRatings }) {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'avatar' | 'security'
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [avatarColor, setAvatarColor] = useState(user?.avatar_color || '#DC2626');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Custom photo upload / URL input
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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

  // Handle local image upload via FileReader & canvas compression (160x160 JPG)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('La imagen supera los 8 MB. Por favor elige una imagen más ligera.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        // Center-crop to 1:1 circle
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 160, 160);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setAvatarUrl(compressedDataUrl);
        setPhotoUrlInput('');
        setMessage('Foto cargada correctamente. Recuerda pulsar "Guardar cambios".');
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setAvatarUrl(photoUrlInput.trim());
    setPhotoUrlInput('');
    setMessage('Enlace de foto aplicado. Pulsa "Guardar cambios".');
  };

  const handleSelectPreset = (preset) => {
    setAvatarUrl(preset.icon);
    setAvatarColor(preset.color);
    setMessage(`Avatar "${preset.label}" seleccionado.`);
    setError('');
  };

  const handleResetToInitials = () => {
    setAvatarUrl('');
    setMessage('Avatar restablecido a tu letra inicial.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validations
    if (newPassword) {
      if (newPassword.length < 4) {
        setError('La nueva contraseña debe tener un mínimo de 4 caracteres.');
        return;
      }
      if (confirmPassword && newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden. Por favor revísalas.');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        new_username: newUsername.trim() !== user?.username ? newUsername.trim() : undefined,
        new_password: newPassword ? newPassword : undefined,
        current_password: currentPassword ? currentPassword : undefined,
        avatar_color: avatarColor !== user?.avatar_color ? avatarColor : undefined,
        avatar_url: avatarUrl !== user?.avatar_url ? avatarUrl : undefined
      };

      const res = await updateProfile(payload);
      setMessage(res.message || 'Perfil y contraseña actualizados correctamente.');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const isImageAvatar = avatarUrl && (avatarUrl.startsWith('data:image') || avatarUrl.startsWith('http'));
  const isEmojiAvatar = avatarUrl && !isImageAvatar;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal overflow-hidden flex flex-col max-h-[92vh] animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Live Big Avatar Preview */}
            <div className="relative group shrink-0">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-xl text-white uppercase shadow-md overflow-hidden ring-4 ring-neutral-100 transition-transform group-hover:scale-105"
                style={{ backgroundColor: avatarColor }}
              >
                {isImageAvatar ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : isEmojiAvatar ? (
                  <span className="text-2xl leading-none">{avatarUrl}</span>
                ) : (
                  <span>{newUsername ? newUsername.slice(0, 1) : user?.username?.slice(0, 1) || '?'}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('avatar')}
                aria-label="Cambiar avatar"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-brand-600 text-white shadow hover:bg-brand-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-extrabold text-ink truncate">
                {user?.username}
              </h3>
              <p className="text-xs font-medium text-ink-muted tabular-nums">
                {totalUserRatings} {totalUserRatings === 1 ? 'establecimiento puntuado' : 'establecimientos puntuados'}
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

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-neutral-100 bg-surface/60 p-1.5 px-4 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'general' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Datos de Cuenta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'avatar' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Foto / Avatar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'security' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Contraseña
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
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

          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                  Nombre de Usuario Oficial
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Tu nombre de usuario"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all font-medium"
                  />
                </div>
                <p className="text-xs text-ink-muted mt-1.5">
                  Este es el nombre visible que aparecerá en tus valoraciones y en el podio.
                </p>
              </div>

              {/* Color Picker for initials/badge */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Color de Fondo del Perfil
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        avatarColor === c ? 'scale-125 ring-2 ring-brand-600 ring-offset-2' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVATAR / PHOTO */}
          {activeTab === 'avatar' && (
            <div className="space-y-5">
              {/* Presets Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Avatares Predeterminados Exclusivos
                  </label>
                  <button
                    type="button"
                    onClick={handleResetToInitials}
                    className="text-xs text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Usar inicial</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_AVATARS.map(p => {
                    const isSelected = avatarUrl === p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/20 shadow-sm'
                            : 'border-neutral-200/80 bg-surface/70 hover:bg-surface hover:border-neutral-300'
                        }`}
                      >
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-lg text-white shadow-sm shrink-0"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.icon}
                        </span>
                        <span className="text-xs font-bold text-ink truncate w-full">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload photo from PC / Mobile */}
              <div className="pt-3 border-t border-neutral-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Subir Foto desde tu Dispositivo (PC o Móvil)
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl bg-surface border border-neutral-200 hover:bg-neutral-100 text-ink transition-colors"
                  >
                    <Upload className="w-4 h-4 text-brand-600" />
                    <span>Elegir archivo de imagen...</span>
                  </button>

                  {isImageAvatar && (
                    <button
                      type="button"
                      onClick={handleResetToInitials}
                      className="px-3 py-2.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-xl hover:bg-brand-100 transition-colors"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>

              {/* URL input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                  O pegar enlace directo a imagen (URL)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="https://ejemplo.com/mi-foto.jpg"
                      className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPhotoUrl}
                    className="px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shrink-0"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY / PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-200/60 text-xs text-brand-800 leading-relaxed">
                <strong>Cambio Seguro de Clave:</strong> Escribe tu nueva contraseña en los dos campos. Puedes pulsar el ojo para ver lo que escribes y evitar erratas.
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                    aria-label={showNewPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Repetir Nueva Contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5 flex items-center justify-between">
                  <span>Repetir Nueva Contraseña</span>
                  {newPassword && confirmPassword && (
                    newPassword === confirmPassword ? (
                      <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Coinciden
                      </span>
                    ) : (
                      <span className="text-brand-600 font-semibold text-xs">
                        No coinciden
                      </span>
                    )
                  )}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Escríbela de nuevo para confirmar"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm bg-surface border rounded-xl text-ink focus:outline-none focus:bg-white transition-all font-mono ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-brand-500 focus:border-brand-600'
                        : 'border-neutral-200 focus:border-brand-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                    aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Contraseña Actual (opcional para verificar) */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                  Contraseña Actual (opcional si ya estás conectado)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Solo necesaria para verificar en sesiones antiguas"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                    aria-label={showCurrentPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
            <button
              type="button"
              onClick={() => { logout(); onClose(); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <LogOut className="w-4 h-4"/>
              <span>Cerrar sesión</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
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
