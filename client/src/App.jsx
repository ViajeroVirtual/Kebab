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
import { Search, Filter, Star, MapPin } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f] antialiased">
      
      {/* Header */}
      <Header
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAddKebab={() => setShowAddModal(true)}
        onOpenFormula={() => setShowFormulaModal(true)}
      />

      {/* Hero Section — Minimal Apple / Samsung Style */}
      <section className="border-b border-gray-100 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">
            Guía Oficial • Algeciras
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f] max-w-3xl mx-auto leading-tight">
            Los mejores kebabs, clasificados con precisión.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#86868b] max-w-xl mx-auto leading-relaxed">
            Evaluaciones objetivas por criterios: calidad de carne, salsas, atención, precio y local.
          </p>

          {/* Key Metrics */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-center">
            <div>
              <span className="block text-3xl sm:text-4xl font-bold text-[#1d1d1f]">
                {kebabs.length}
              </span>
              <span className="text-xs text-[#86868b] uppercase tracking-wider font-medium mt-0.5 block">
                Locales Registrados
              </span>
            </div>

            <div className="w-px h-10 bg-gray-200 hidden sm:block" />

            <div>
              <span className="block text-3xl sm:text-4xl font-bold text-red-600">
                {stats.totalVotes}
              </span>
              <span className="text-xs text-[#86868b] uppercase tracking-wider font-medium mt-0.5 block">
                Valoraciones
              </span>
            </div>

            {stats.topKebab && (
              <>
                <div className="w-px h-10 bg-gray-200 hidden sm:block" />
                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Star className="w-5 h-5 text-red-600 fill-current" />
                    <span className="text-3xl sm:text-4xl font-bold text-[#1d1d1f]">
                      {stats.topKebab.average_score?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-[#86868b] uppercase tracking-wider font-medium mt-0.5 block truncate max-w-[180px]">
                    N.º 1: {stats.topKebab.name}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Controls: Search, Sort & Zones */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o zona..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-[#1d1d1f] placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[#1d1d1f] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="rating">Puntuación</option>
                  <option value="votes">Más Valorados</option>
                  <option value="name">Nombre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zone Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {zones.map(zone => {
              const count = zone === 'Todos' ? kebabs.length : kebabs.filter(k => k.zone === zone).length;
              const isSelected = selectedZone === zone;

              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{zone}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kebabs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-gray-50 animate-pulse border border-gray-100" />
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
          <div className="text-center py-20 px-4 rounded-2xl bg-gray-50 border border-gray-100">
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              No se han encontrado resultados
            </h3>
            <p className="text-xs text-[#86868b] mt-1 max-w-sm mx-auto">
              Prueba con otro término de búsqueda o selecciona otra zona.
            </p>
          </div>
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-100 bg-white py-8 text-xs text-[#86868b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1d1d1f]">AlgeKebab</span>
            <span>•</span>
            <span>Algeciras</span>
          </div>

          <p className="text-gray-400">
            © {new Date().getFullYear()} AlgeKebab. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modals */}
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
