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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Añadir Nuevo Kebab en Algeciras
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Registra un local para que el grupo pueda empezar a puntuarlo
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
              Nombre del Kebab *
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Kebab La Isla, Dchiqui..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
              Zona de Algeciras *
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-red-500 transition-colors"
            >
              {COMMON_ZONES.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
              Dirección o Calle
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Calle Sindicalista Luis Cobos, Av. Virgen del Carmen..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
              Descripción o especialidad (opcional)
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Famoso por sus salsas caseras, abre hasta tarde..."
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
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
