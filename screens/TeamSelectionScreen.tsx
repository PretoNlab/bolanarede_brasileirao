import React, { useState, useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, Search, Check, X, Trophy, Wallet, Users, Shield, ChevronRight } from 'lucide-react';
import { Team } from '../types';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  onSelect: (teamId: string) => void;
  onBack: () => void;
}


export default function TeamSelectionScreen({ teams, onSelect, onBack }: Props) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BEGINNER' | 'PRESSURE' | 'BUDGET' | 1 | 2>('ALL');
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
    else if (activeFilter === 'ALL') {
      filtered = [...teams].sort((a, b) => ((b.attack + b.defense) / 2) - ((a.attack + a.defense) / 2));
    } else if (activeFilter === 'BEGINNER') {
      filtered = [...teams].sort((a, b) => {
        const aScore = (((a.attack + a.defense) / 2) * 2) + (a.financeStatus === 'Rico' ? 20 : a.financeStatus === 'Boa' ? 12 : 0);
        const bScore = (((b.attack + b.defense) / 2) * 2) + (b.financeStatus === 'Rico' ? 20 : b.financeStatus === 'Boa' ? 12 : 0);
        return bScore - aScore;
      });
    } else if (activeFilter === 'PRESSURE') {
      filtered = [...teams].sort((a, b) => {
        const expectationWeight = (team: Team) => {
          if (team.seasonExpectation?.toLowerCase().includes('título')) return 30;
          if (team.seasonExpectation?.toLowerCase().includes('liberta')) return 20;
          if (team.seasonExpectation?.toLowerCase().includes('acesso')) return 18;
          return 8;
        };
        return expectationWeight(b) - expectationWeight(a);
      });
    } else if (activeFilter === 'BUDGET') {
      filtered = [...teams].sort((a, b) => {
        const financeWeight = (team: Team) => {
          if (team.financeStatus === 'Rico') return 4;
          if (team.financeStatus === 'Boa') return 3;
          if (team.financeStatus === 'Controlada') return 2;
          return 1;
        };
        return financeWeight(b) - financeWeight(a);
      });
    } else {
      filtered = filtered.filter(t => t.division === activeFilter);
    }

    return filtered;
  }, [teams, searchTerm, activeFilter]);

  const openDetails = (teamId: string) => {
    setSelectedId(teamId);
    setShowModal(true);
  };

  const quickSelect = (teamId: string) => {
    setSelectedId(teamId);
    onSelect(teamId);
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

  const getChallengeLabel = (team: Team) => {
    const overall = Math.round((team.attack + team.defense) / 2);
    if (overall >= 88 && (team.financeStatus === 'Rico' || team.financeStatus === 'Boa')) return 'Mais estável';
    if ((team.seasonExpectation || '').toLowerCase().includes('título')) return 'Pressão alta';
    if (team.division === 2) return 'Projeto de acesso';
    return 'Desafio equilibrado';
  };

  const filterButtons = [
    { id: 'ALL', label: 'Todos' },
    { id: 'BEGINNER', label: 'Melhor início' },
    { id: 'PRESSURE', label: 'Mais pressão' },
    { id: 'BUDGET', label: 'Mais caixa' },
    { id: 1, label: 'Série A' },
    { id: 2, label: 'Série B' },
  ] as const;

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans">

      {/* HEADER */}
      <header className="px-5 pt-12 pb-4 bg-background z-10">
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-surface text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Brasileirão 2026</span>
            <span className="text-xs font-medium text-secondary tracking-widest uppercase opacity-70">Seleção de Clubes</span>
          </div>
          <div className="w-10" />
        </div>

        <h1 className="text-4xl font-black mb-2 leading-none">Escolha seu<br /><span className="text-primary">clube.</span></h1>
        <p className="text-[13px] text-white/65 leading-6 mb-5 max-w-[92%]">
          Decida rápido pelo contexto certo: mais força, mais caixa, mais pressão ou projeto de acesso.
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input
            type="text"
            placeholder="Buscar clube ou cidade..."
            className="w-full rounded-[20px] border border-white/5 bg-surface px-12 py-4 text-sm font-medium outline-none transition-all focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {filterButtons.map((filter) => (
            <button
              key={String(filter.id)}
              onClick={() => setActiveFilter(filter.id as any)}
              className={clsx(
                "px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all",
                activeFilter === filter.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                  : "bg-surface border border-white/5 text-secondary hover:bg-surface/80"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* TEAM LIST */}
      <main className="flex-1 overflow-y-auto px-5 pb-24 scroll-smooth no-scrollbar space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-[16px] font-black tracking-tight text-white">Opções para assumir agora</h2>
            <p className="mt-1 text-[12px] leading-5 text-white/55">Toque em escolher para entrar direto. Use detalhes para comparar antes.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
            {filteredTeams.length} clubes
          </div>
        </div>

        {filteredTeams.map((team) => {
          const overall = Math.round((team.attack + team.defense) / 2);
          const financeLabel = team.financeStatus || 'Boa';

          return (
            <div
              key={team.id}
              className={clsx(
                "relative overflow-hidden bg-surface rounded-[2rem] border p-5 transition-all duration-300",
                selectedId === team.id ? "border-primary/30 shadow-lg shadow-primary/10" : "border-white/5"
              )}
            >
              {overall >= 90 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-blue-600"></div>
              )}
              {overall < 90 && overall >= 80 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-green-600"></div>
              )}
              {overall < 80 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
              )}

              <div className="flex justify-between items-start mb-5 pl-3">
                <div className="flex items-center gap-4">
                  <TeamLogo team={team} size="lg" />
                  <div>
                    <h3 className="text-xl font-black text-white leading-none mb-1">{team.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-white/5 px-2 py-0.5 rounded-md inline-block">
                      {team.city}
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

              <div className="pl-3 mb-4">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/65">
                  {getChallengeLabel(team)}
                </span>
              </div>

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

              <div className="mt-5 grid grid-cols-2 gap-3 pl-3">
                <button
                  onClick={() => openDetails(team.id)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white transition-all active:scale-[0.98]"
                >
                  Ver detalhes
                </button>
                <button
                  onClick={() => quickSelect(team.id)}
                  className="rounded-2xl bg-primary px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Escolher clube
                </button>
              </div>
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
                <TeamLogo team={selectedTeam} size="xl" />
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

              <div className="mt-4 rounded-2xl border border-white/5 bg-surface p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Leitura rápida</span>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-white/72">
                  {getChallengeLabel(selectedTeam)}. Orçamento {selectedTeam.financeStatus || 'estável'} e expectativa {selectedTeam.seasonExpectation || 'moderada'}.
                </p>
              </div>

            </div>

            {/* Bottom Action */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#151B26] via-[#151B26] to-transparent">
              <button
                onClick={() => quickSelect(selectedTeam.id)}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-primary/25 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
              >
                <span>ASSUMIR {selectedTeam.shortName}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
