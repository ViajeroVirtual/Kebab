import React, { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Introduce el nombre del kebab');
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
      setError(err.message || 'Error al añadir el kebab');
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
                Añadir Nuevo Kebab en Algeciras
              </h3>
              <p className="text-[11px] text-slate-400">
                Registra un local para que el grupo pueda empezar a puntuarlo
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
              Nombre del Kebab *
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Kebab La Isla, Dchiqui..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Zona de Algeciras *
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white focus:outline-none focus:border-brand-500 transition-colors"
            >
              {COMMON_ZONES.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Dirección o Calle
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Calle Sindicalista Luis Cobos, Av. Virgen del Carmen..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Descripción o especialidad (opcional)
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Famoso por sus salsas caseras, abre hasta tarde..."
              className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surface-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Añadiendo...' : 'Añadir a la Ruta'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
