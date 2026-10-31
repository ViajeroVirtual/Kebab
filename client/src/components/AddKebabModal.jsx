import React, { useState, useEffect } from 'react';
import { X, Plus, MapPin, Store, AlertCircle } from 'lucide-react';

const COMMON_ZONES = [
  'Zona Puerto / Isla Verde',
  'Las Palomas',
  'Centro / Plaza Alta',
  'San García / Europa',
  'Getares',
  'Bajadilla / Reconquista',
  'Puerta Europa'
];

export default function AddKebabModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('Zona Puerto / Isla Verde');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!name.trim()) {
      setError('Introduce el nombre comercial del establecimiento');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onAdd({
        name: name.trim(),
        zone,
        address: address.trim() || `Algeciras (${zone})`,
        description: description.trim(),
        google_maps_url: googleMapsUrl.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al registrar el local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-modal-in pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-ink">
              Añadir Establecimiento
            </h3>
            <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5">
              Incorpora un nuevo local al directorio público de Algeciras
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 sm:p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Nombre del Local *
            </label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Kebab Dchiqui, La Isla..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Zona en Algeciras *
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
            >
              {COMMON_ZONES.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Dirección
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. Virgen del Carmen, 29"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Especialidad o descripción
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Destaca por sus salsas caseras y pan recién horneado..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Enlace a Google Maps (opcional)
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink focus:outline-none focus:bg-white focus:border-brand-600 transition-all"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-neutral-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] shadow-sm disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4"/>
              <span>{loading ? 'Guardando...' : 'Publicar Local'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
