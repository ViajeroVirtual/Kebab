import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import KebabCard from './components/KebabCard';
import KebabDetailModal from './components/KebabDetailModal';
import RatingModal from './components/RatingModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import AddKebabModal from './components/AddKebabModal';
import FormulaInfoModal from './components/FormulaInfoModal';
import { useAuth } from './context/AuthContext';
import { Search, Flame, Trophy, Award, Filter, RefreshCw } from 'lucide-react';

export default function App() {
  const { user, token } = useAuth();

  const [kebabs, setKebabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('Todos');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'votes' | 'name'

  // Modals state
  const [selectedKebab, setSelectedKebab] = useState(null);
  const [ratingKebab, setRatingKebab] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Fetch Kebabs from Backend
  const fetchKebabs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/kebabs');
      if (res.ok) {
        const data = await res.json();
        setKebabs(data);

        // Si hay un kebab abierto en modal, refrescarlo con nuevos datos
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

  // Guardar o actualizar puntuación
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

  // Eliminar puntuación propia
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

  // Filtrado y Ordenación
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
    const topKebab = [...kebabs]
      .filter(k => k.average_score !== null)
      .sort((a, b) => b.average_score - a.average_score)[0];

    const myVotesCount = user
      ? kebabs.reduce((acc, k) => acc + (k.ratings?.some(r => r.user_id === user.id) ? 1 : 0), 0)
      : 0;

    return { totalVotes, topKebab, myVotesCount };
  }, [kebabs, user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1015] text-slate-100">
      
      {/* Header */}
      <Header
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAddKebab={() => setShowAddModal(true)}
        onOpenFormula={() => setShowFormulaModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-100 via-surface-50 to-[#12141a] border border-surface-border p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Ruta Gastronómica de Algeciras</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ¿Dónde se come el mejor kebab de <span className="text-brand-500">Algeciras</span>?
            </h1>
            
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Puntuaciones individuales por comensal con fórmula ponderada (sabor, ubicación, presentación, salsas y precio). Inicia sesión con tus amigos para guardar vuestras valoraciones.
            </p>

            {/* Quick stats pills */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-200/60 border border-surface-border text-xs">
                <span className="text-slate-400">Kebabs registrados:</span>
                <span className="font-extrabold text-white">{kebabs.length}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-200/60 border border-surface-border text-xs">
                <span className="text-slate-400">Votos emitidos:</span>
                <span className="font-extrabold text-brand-400">{stats.totalVotes}</span>
              </div>

              {stats.topKebab && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">Líder:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{stats.topKebab.name}</span>
                  <span className="font-extrabold text-brand-400">({stats.topKebab.average_score})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o zona (ej: Isla Verde, Dchiqui, Las Palomas...)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-100 border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-100 border border-surface-border rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 hidden sm:inline">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="rating" className="bg-surface-100 text-white">⭐ Mayor Nota</option>
                  <option value="votes" className="bg-surface-100 text-white">🔥 Más Votados</option>
                  <option value="name" className="bg-surface-100 text-white">🔤 Nombre A-Z</option>
                </select>
              </div>

              <button
                onClick={fetchKebabs}
                className="p-2.5 bg-surface-100 hover:bg-surface-200 border border-surface-border rounded-xl text-slate-400 hover:text-white transition-colors"
                title="Actualizar datos"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Zones Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {zones.map(z => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedZone === z
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface-100 text-slate-400 hover:text-white border border-surface-border'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Kebab Cards Grid */}
        {filteredKebabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredKebabs.map(kebab => (
              <KebabCard
                key={kebab.id}
                kebab={kebab}
                currentUserId={user?.id}
                onClick={() => setSelectedKebab(kebab)}
                onRateClick={(k) => {
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    setRatingKebab(k);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-surface-100 border border-dashed border-surface-border">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-base font-bold text-white">
              No se han encontrado kebabs con ese filtro
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Prueba a buscar con otro término o añade un nuevo kebab con el botón de la barra superior.
            </p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>🌯 <strong>AlgeKebab</strong> • La Ruta del Kebab en Algeciras</p>
          <p className="text-[11px] text-slate-500">
            Diseñado para desplegar en Render con base de datos compartida
          </p>
        </div>
      </footer>

      {/* MODALS */}
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
