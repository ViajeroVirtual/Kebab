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
import { BRAND_CONFIG } from './utils/formula';
import { Search, ArrowUpDown, Award, Sparkles, X } from 'lucide-react';

export default function App() {
  const { user, token } = useAuth();

  const [kebabs, setKebabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('Todos');
  const [sortBy, setSortBy] = useState('rating');

  const [selectedKebab, setSelectedKebab] = useState(null);
  const [ratingKebab, setRatingKebab] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

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
    if (!res.ok) throw new Error(data.error || 'Error al guardar puntuación');
    await fetchKebabs();
  };

  const handleDeleteRating = async (kebabId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/ratings/${kebabId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) await fetchKebabs();
    } catch (err) {
      console.error('Error deleting rating:', err);
    }
  };

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
    if (!res.ok) throw new Error(data.error || 'Error al añadir kebab');
    await fetchKebabs();
  };

  const zones = useMemo(() => {
    const list = new Set(kebabs.map(k => k.zone).filter(Boolean));
    return ['Todos', ...Array.from(list)];
  }, [kebabs]);

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
    <div id="top" className="min-h-screen flex flex-col bg-surface text-ink antialiased">
      {/* Sticky Glass Header */}
      <Header
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAddKebab={() => setShowAddModal(true)}
        onOpenFormula={() => setShowFormulaModal(true)}
      />

      {/* Hero Section — Public Brand Identity */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-xs font-bold uppercase tracking-wider text-brand-700 mb-5">
            <Sparkles className="w-3.5 h-3.5"/>
            <span>Plataforma Oficial • {BRAND_CONFIG.city}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink max-w-4xl mx-auto leading-[1.08]">
            {BRAND_CONFIG.prefix}
            <span className="text-brand-600">{BRAND_CONFIG.accent}</span>
          </h1>

          <p className="mt-4 text-lg sm:text-2xl font-semibold text-ink max-w-2xl mx-auto tracking-tight">
            {BRAND_CONFIG.tagline}
          </p>

          <p className="mt-2.5 text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
            Descubre qué locales lideran el podio según la calidad de su carne, pan, salsas, trato y relación calidad-precio.
          </p>

          {/* Bento Stats Bar */}
          <div className="mt-10 inline-grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 p-2 rounded-2xl bg-surface border border-neutral-200/80 max-w-2xl w-full">
            <div className="p-3.5 rounded-xl bg-white shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-ink tabular-nums">
                {kebabs.length}
              </span>
              <span className="text-xs text-ink-muted font-semibold mt-0.5 block">
                Locales en Ruta
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-brand-600 tabular-nums">
                {stats.totalVotes}
              </span>
              <span className="text-xs text-ink-muted font-semibold mt-0.5 block">
                Reseñas Verificadas
              </span>
            </div>

            <div
              onClick={() => stats.topKebab && setSelectedKebab(stats.topKebab)}
              className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white shadow-sm text-center cursor-pointer hover:bg-brand-50/40 transition-colors"
            >
              {stats.topKebab ? (
                <>
                  <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-extrabold text-ink tabular-nums">
                    <Award className="w-5 h-5 text-amber-500 shrink-0"/>
                    <span>{stats.topKebab.average_score?.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-ink font-semibold mt-0.5 block truncate px-1">
                    #1 {stats.topKebab.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-ink-muted">—</span>
                  <span className="text-xs text-ink-muted font-semibold mt-0.5 block">Líder actual</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Search, Sort & Zone Chips */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"/>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre de kebab, calle o zona..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-surface border border-neutral-200 rounded-xl text-ink placeholder-ink-muted focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  <X className="w-4 h-4"/>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface border border-neutral-200 rounded-xl text-xs font-semibold text-ink-muted w-full sm:w-auto justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-brand-600"/>
                  <span>Ordenar por:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-ink font-bold focus:outline-none cursor-pointer"
                >
                  <option value="rating">Mejor Nota</option>
                  <option value="votes">Más Valorados</option>
                  <option value="name">Orden Alfabético</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zone Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {zones.map(zone => {
              const count = zone === 'Todos' ? kebabs.length : kebabs.filter(k => k.zone === zone).length;
              const isSelected = selectedZone === zone;

              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-ink text-white shadow-sm'
                      : 'bg-surface text-ink-muted hover:text-ink hover:bg-neutral-200/70'
                  }`}
                >
                  <span>{zone}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full tabular-nums ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-ink-muted'
                    }`}
                  >
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
              <div key={i} className="h-96 rounded-2xl bg-white animate-pulse border border-neutral-200/70 p-5 flex flex-col justify-between">
                <div className="h-44 rounded-xl bg-neutral-200/70" />
                <div className="space-y-2.5">
                  <div className="h-5 w-2/3 bg-neutral-200/70 rounded" />
                  <div className="h-3.5 w-1/2 bg-neutral-200/70 rounded" />
                </div>
                <div className="h-9 bg-neutral-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredKebabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKebabs.map((kebab, idx) => (
              <KebabCard
                key={kebab.id}
                kebab={kebab}
                rank={sortBy === 'rating' && kebab.average_score !== null ? idx + 1 : null}
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
          <div className="text-center py-16 px-4 rounded-2xl bg-white border border-neutral-200/80 shadow-card">
            <h3 className="text-base font-bold text-ink">
              No hemos encontrado ningún kebab con ese filtro
            </h3>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              Prueba con otro término de búsqueda o restablece el filtro de zonas.
            </p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedZone('Todos'); }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
            >
              Ver todos los locales
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-8 text-xs text-ink-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink">{BRAND_CONFIG.name}</span>
            <span>•</span>
            <span>Ranking Gastronómico de {BRAND_CONFIG.city}</span>
          </div>

          <p className="text-ink-muted">
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Criterios transparentes y abiertos a la comunidad.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedKebab && (
        <KebabDetailModal
          kebab={selectedKebab}
          onClose={() => setSelectedKebab(null)}
          onRateClick={(k) => {
            if (!user) {
              setShowAuthModal(true);
            } else {
              setRatingKebab(k);
            }
          }}
          currentUserId={user?.id}
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

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          totalUserRatings={stats.myVotesCount}
        />
      )}

      {showAddModal && (
        <AddKebabModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddKebab}
        />
      )}

      {showFormulaModal && <FormulaInfoModal onClose={() => setShowFormulaModal(false)} />}
    </div>
  );
}
