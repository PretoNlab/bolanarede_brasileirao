import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Check, Zap, ArrowRight, Shield, Swords, Activity, X, Trophy, Wallet, Users } from 'lucide-react';
import { Team } from '../types';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  onSelect: (teamId: string) => void;
  onBack: () => void;
}

const TeamLogo = ({ team, size = "w-12 h-12" }: { team: Team, size?: string }) => {
  return (
    <div className={`${size} shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} shadow-lg border border-white/10`}>
      <span className="text-white font-black text-lg tracking-wider drop-shadow-md">{team.shortName}</span>
    </div>
  );
};

export default function TeamSelectionScreen({ teams, onSelect, onBack }: Props) {
  const [activeDiv, setActiveDiv] = useState<1 | 2 | 'FAVORITOS'>('FAVORITOS');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const selectedTeam = teams.find(t => t.id === selectedId);

  // Filter teams logic
  const filteredTeams = useMemo(() => {
    let filtered = teams;

    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Tab Filter (Full List or Divisions)
    else if (activeDiv === 'FAVORITOS') {
      // Show all teams sorted by strength (simplified 'Favorites' view)
      filtered = [...teams].sort((a, b) => ((b.attack + b.defense) / 2) - ((a.attack + a.defense) / 2));
    } else {
      filtered = filtered.filter(t => t.division === activeDiv);
    }

    return filtered;
  }, [teams, searchTerm, activeDiv]);

  const handleCardClick = (teamId: string) => {
    setSelectedId(teamId);
    setShowModal(true);
  };

  const confirmSelection = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  // Helper to format currency
  const getBudgetDisplay = (status?: string) => {
    switch (status) {
      case 'Rico': return 'R$ 850M';
      case 'Boa': return 'R$ 510M';
      case 'Controlada': return 'R$ 200M';
      case 'Limitada': return 'R$ 50M';
      default: return 'R$ 100M';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans">

      {/* HEADER */}
      <header className="px-5 pt-12 pb-4 bg-background z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-surface text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Brasileirão 2026</span>
            <span className="text-xs font-medium text-secondary tracking-widest uppercase opacity-70">Seleção de Clubes</span>
          </div>
          <button className="p-2 -mr-2 rounded-full hover:bg-surface text-white transition-colors">
            <Search className="w-6 h-6" />
          </button>
        </div>

        <h1 className="text-4xl font-black mb-1 leading-none">Escolha seu<br /><span className="text-primary">Destino.</span></h1>
        <p className="text-sm text-secondary leading-relaxed mb-6 max-w-[85%]">
          Assuma o controle de um gigante e mude a história do futebol brasileiro em 2026.
        </p>

        {/* FILTERS */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['FAVORITOS', 1, 2].map((div) => (
            <button
              key={div}
              onClick={() => { setActiveDiv(div as any); setSearchTerm(''); }}
              className={clsx(
                "px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all",
                activeDiv === div
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                  : "bg-surface border border-white/5 text-secondary hover:bg-surface/80"
              )}
            >
              {div === 'FAVORITOS' ? 'Todos' : div === 1 ? 'Série A' : 'Série B'}
            </button>
          ))}
        </div>
      </header>

      {/* TEAM LIST */}
      <main className="flex-1 overflow-y-auto px-5 pb-24 scroll-smooth no-scrollbar space-y-4">
        {filteredTeams.map((team) => {
          const overall = Math.round((team.attack + team.defense) / 2);
          const financeLabel = team.financeStatus || 'Boa';

          return (
            <div
              key={team.id}
              onClick={() => handleCardClick(team.id)}
              className="relative overflow-hidden bg-surface rounded-[2rem] border border-white/5 p-5 active:scale-[0.98] transition-all duration-300"
            >
              {activeDiv === 'FAVORITOS' && overall >= 90 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-blue-600"></div>
              )}
              {activeDiv === 'FAVORITOS' && overall < 90 && overall >= 80 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-green-600"></div>
              )}
              {activeDiv === 'FAVORITOS' && overall < 80 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
              )}

              <div className="flex justify-between items-start mb-6 pl-3">
                <div className="flex items-center gap-4">
                  <TeamLogo team={team} size="w-16 h-16" />
                  <div>
                    <h3 className="text-xl font-black text-white leading-none mb-1">{team.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-white/5 px-2 py-0.5 rounded-md inline-block">
                      {team.description ? team.description.split(' ')[0] : 'Clube'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-secondary mb-0.5 opacity-70">Orçamento</span>
                  <span className={clsx("text-sm font-black tracking-tight",
                    financeLabel === 'Rico' ? "text-emerald-400" :
                      financeLabel === 'Boa' ? "text-blue-400" : "text-white"
                  )}>
                    {getBudgetDisplay(financeLabel)}
                  </span>
                </div>
              </div>

              {/* Stats Bars */}
              <div className="grid grid-cols-2 gap-6 pl-3">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-secondary tracking-wider">Ataque</span>
                    <span className="text-sm font-black text-white">{team.attack}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${team.attack}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-secondary tracking-wider">Defesa</span>
                    <span className="text-sm font-black text-white">{team.defense}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: `${team.defense}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedId === team.id && (
                <div className="absolute bottom-0 left-0 right-0 h-9 bg-primary flex items-center justify-between px-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Clube Selecionado</span>
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* MODAL DETALHES */}
      {showModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#151B26] w-full max-w-md max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">

            {/* Modal Header */}
            <div className="relative p-8 pb-6 bg-gradient-to-b from-white/5 to-transparent">
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-5">
                <TeamLogo team={selectedTeam} size="w-20 h-20" />
                <div>
                  <h2 className="text-2xl font-black text-white leading-tight mb-1">{selectedTeam.name}</h2>
                  <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                    <span>{selectedTeam.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-8 pb-32 overflow-y-auto no-scrollbar">
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                {selectedTeam.description || `O ${selectedTeam.name} é uma das forças do futebol brasileiro, buscando glórias na temporada 2026 com um elenco competitivo.`}
              </p>

              <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Força do Elenco</h3>
              <div className="space-y-4 mb-8">
                {/* ATK */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-bold">Ataque</span>
                    <span className="text-white text-sm font-black">{selectedTeam.attack}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full">
                    <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${selectedTeam.attack}%` }}></div>
                  </div>
                </div>
                {/* MID (Avg) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-bold">Meio-Campo</span>
                    <span className="text-white text-sm font-black">{Math.round((selectedTeam.attack + selectedTeam.defense) / 2)}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full">
                    <div className="h-full bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: `${Math.round((selectedTeam.attack + selectedTeam.defense) / 2)}%` }}></div>
                  </div>
                </div>
                {/* DEF */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-bold">Defesa</span>
                    <span className="text-white text-sm font-black">{selectedTeam.defense}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${selectedTeam.defense}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-2xl border border-white/5">
                  <span className="block text-[10px] font-black uppercase text-secondary tracking-wider mb-2">Finanças</span>
                  <div className="flex items-center gap-2">
                    <Wallet className={clsx("w-5 h-5",
                      selectedTeam.financeStatus === 'Rico' ? "text-emerald-400" : "text-blue-400"
                    )} />
                    <span className={clsx("text-lg font-black",
                      selectedTeam.financeStatus === 'Rico' ? "text-emerald-400" : "text-blue-400"
                    )}>{selectedTeam.financeStatus || 'Estável'}</span>
                  </div>
                </div>
                <div className="bg-surface p-4 rounded-2xl border border-white/5">
                  <span className="block text-[10px] font-black uppercase text-secondary tracking-wider mb-2">Expectativa</span>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-black text-white">{selectedTeam.seasonExpectation || 'Meio'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Action */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#151B26] via-[#151B26] to-transparent">
              <button
                onClick={confirmSelection}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-primary/25 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
              >
                <span>CONFIRMAR SELEÇÃO</span>
                <Check className="w-6 h-6 bg-white/20 rounded-full p-1" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}