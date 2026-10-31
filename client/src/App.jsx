import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Podium from './components/Podium';
import KebabCard from './components/KebabCard';
import KebabDetailModal from './components/KebabDetailModal';
import RatingModal from './components/RatingModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import AddKebabModal from './components/AddKebabModal';
import FormulaInfoModal from './components/FormulaInfoModal';
import { useAuth } from './context/AuthContext';
import { Search, Flame, Trophy, Award, Filter, RefreshCw, MapPin } from 'lucide-react';

export default function App() {
  const { user, token } = useAuth();

  const [kebabs, setKebabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('Todos');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'votes' | 'name'

  // Modales
  const [selectedKebab, setSelectedKebab] = useState(null);
  const [ratingKebab, setRatingKebab] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Cargar Kebabs desde la API
  const fetchKebabs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/kebabs');
      if (res.ok) {
        const data = await res.json();
        setKebabs(data);

        if (selectedKebab) {
          const updatedCurrent = data.find(k => k.id === selectedKebab.id);
          if (updatedCurrent) setSelectedKebab(updatedCurrent);
        }
      }
    } catch (err) {
      console.error('Error al cargar kebabs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebabs();
  }, []);

  // Guardar puntuación
  const handleSaveRating = async (ratingPayload) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(ratingPayload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al guardar puntuación');
    }

    await fetchKebabs();
  };

  // Eliminar puntuación
  const handleDeleteRating = async (kebabId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/ratings/${kebabId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchKebabs();
      }
    } catch (err) {
      console.error('Error deleting rating:', err);
    }
  };

  // Añadir nuevo Kebab
  const handleAddKebab = async (newKebabData) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const res = await fetch('/api/kebabs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newKebabData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al añadir kebab');
    }

    await fetchKebabs();
  };

  // Zonas únicas disponibles
  const zones = useMemo(() => {
    const list = new Set(kebabs.map(k => k.zone).filter(Boolean));
    return ['Todos', ...Array.from(list)];
  }, [kebabs]);

  // Kebabs ordenados por rating para el Podio
  const topKebabs = useMemo(() => {
    return [...kebabs]
      .filter(k => k.average_score !== null)
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, 3);
  }, [kebabs]);

  // Filtrado y Ordenación general
  const filteredKebabs = useMemo(() => {
    return kebabs
      .filter(k => {
        const matchesSearch = 
          k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (k.description && k.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesZone = selectedZone === 'Todos' || k.zone === selectedZone;

        return matchesSearch && matchesZone;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          const scoreA = a.average_score !== null ? a.average_score : -1;
          const scoreB = b.average_score !== null ? b.average_score : -1;
          return scoreB - scoreA;
        }
        if (sortBy === 'votes') {
          return (b.ratings?.length || 0) - (a.ratings?.length || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [kebabs, searchTerm, selectedZone, sortBy]);

  // Estadísticas globales
  const stats = useMemo(() => {
    const totalVotes = kebabs.reduce((acc, k) => acc + (k.ratings?.length || 0), 0);
    const topKebab = topKebabs[0] || null;

    const myVotesCount = user
      ? kebabs.reduce((acc, k) => acc + (k.ratings?.some(r => r.user_id === user.id) ? 1 : 0), 0)
      : 0;

    return { totalVotes, topKebab, myVotesCount };
  }, [kebabs, topKebabs, user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-slate-100 font-sans selection:bg-orange-500 selection:text-black">
      
      {/* Header con nuevo logo */}
      <Header
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAddKebab={() => setShowAddModal(true)}
        onOpenFormula={() => setShowFormulaModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Banner Urbano */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171924] via-[#141620] to-[#0f1118] border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold mb-4 shadow-sm">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>La Ruta del Kebab de Algeciras • Ranking Oficial</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              ¿Cuál es el mejor kebab de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">Algeciras</span>?
            </h1>
            
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Puntuaciones milimétricas entre colegas: carne y durum (sobre 6), salsas, atención, calidad-precio y local. Encuentra el sitio perfecto y navega directo con Google Maps.
            </p>

            {/* Estadísticas rápidas en pills */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold backdrop-blur-sm">
                <span className="text-slate-400">Locales registrados:</span>
                <span className="font-black text-white">{kebabs.length}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold backdrop-blur-sm">
                <span className="text-slate-400">Veredictos emitidos:</span>
                <span className="font-black text-orange-400">{stats.totalVotes}</span>
              </div>

              {stats.topKebab && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 backdrop-blur-sm">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">#1 Actual:</span>
                  <span className="font-black text-white truncate max-w-[150px]">{stats.topKebab.name}</span>
                  <span className="font-black text-amber-400">({stats.topKebab.average_score?.toFixed(1)})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PODIUM TOP 3 (Solo cuando no se está buscando texto específico) */}
        {!searchTerm && selectedZone === 'Todos' && topKebabs.length >= 3 && (
          <Podium
            topKebabs={topKebabs}
            onKebabClick={(k) => setSelectedKebab(k)}
          />
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="space-y-4 pt-2">
          
          {/* Fila 1: Buscador y Ordenador */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar kebab por nombre o zona (ej: Dchiqui, Isla Verde, Palomas...)"
                className="w-full pl-11 pr-4 py-3 text-sm bg-white/[0.04] border border-white/[0.1] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* Selector de ordenación */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border border-white/[0.1] rounded-2xl text-xs font-bold text-slate-300">
                <Filter className="w-4 h-4 text-orange-400" />
                <span className="text-slate-400 hidden sm:inline">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="rating" className="bg-[#161822] text-white">⭐ Mayor Puntuación</option>
                  <option value="votes" className="bg-[#161822] text-white">🔥 Más Votados</option>
                  <option value="name" className="bg-[#161822] text-white">🔤 Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fila 2: Chips de Zonas (Elegante y desplazable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2 flex items-center gap-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              Zona:
            </span>
            {zones.map(zone => {
              const count = zone === 'Todos' ? kebabs.length : kebabs.filter(k => k.zone === zone).length;
              const isSelected = selectedZone === zone;

              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]'
                  }`}
                >
                  <span>{zone}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-black/40 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Encabezado del Listado */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Todos los Kebabs</span>
            <span className="text-xs text-slate-400 font-semibold">({filteredKebabs.length} de {kebabs.length})</span>
          </h2>
        </div>

        {/* Grid de Kebabs */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filteredKebabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKebabs.map((kebab, idx) => (
              <KebabCard
                key={kebab.id}
                kebab={kebab}
                rank={sortBy === 'rating' ? idx + 1 : null}
                onClick={() => setSelectedKebab(kebab)}
                onRateClick={(k) => {
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    setRatingKebab(k);
                  }
                }}
                currentUserId={user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-dashed border-white/[0.08]">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-base font-bold text-white">
              No se han encontrado kebabs con ese filtro
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Prueba a buscar con otro término o selecciona "Todos" en las zonas.
            </p>
          </div>
        )}

      </main>

      {/* Footer Oficial Limpio (Sin menciones técnicas ni de Render) */}
      <footer className="border-t border-white/[0.08] bg-[#0c0d12] py-8 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">AlgeKebab</span>
            <span className="text-[11px] text-slate-500">•</span>
            <span className="text-xs text-slate-400">La Ruta Oficial del Kebab de Algeciras entre amigos</span>
          </div>

          <p className="text-xs text-slate-500">
            Hecho por y para los de la comarca. 🌯
          </p>
        </div>
      </footer>

      {/* MODALES */}
      {selectedKebab && (
        <KebabDetailModal
          kebab={selectedKebab}
          currentUserId={user?.id}
          onClose={() => setSelectedKebab(null)}
          onRateClick={(k) => {
            if (!user) {
              setShowAuthModal(true);
            } else {
              setRatingKebab(k);
            }
          }}
          onDeleteRating={handleDeleteRating}
        />
      )}

      {ratingKebab && (
        <RatingModal
          kebab={ratingKebab}
          existingRating={ratingKebab.ratings?.find(r => r.user_id === user?.id)}
          onClose={() => setRatingKebab(null)}
          onSave={handleSaveRating}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          totalUserRatings={stats.myVotesCount}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showAddModal && (
        <AddKebabModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddKebab}
        />
      )}

      {showFormulaModal && (
        <FormulaInfoModal
          onClose={() => setShowFormulaModal(false)}
        />
      )}

    </div>
  );
}
