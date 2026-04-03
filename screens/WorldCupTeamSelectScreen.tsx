
import React, { useState, useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, Search, Check, X, Globe, Shield, Star } from 'lucide-react';
import { Team, WCConfederation } from '../types';
import { WC_TEAMS_DATA, CONFEDERATION_LABELS, getTeamConfederation } from '../worldCupData';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  onSelect: (teamId: string) => void;
  onBack: () => void;
}


const CONF_TABS: (WCConfederation | 'TODOS')[] = ['TODOS', 'CONMEBOL', 'UEFA', 'CONCACAF', 'AFC', 'CAF', 'OFC'];

export default function WorldCupTeamSelectScreen({ teams, onSelect, onBack }: Props) {
  const [activeConf, setActiveConf] = useState<WCConfederation | 'TODOS'>('TODOS');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const selectedTeam = teams.find(t => t.id === selectedId);

  const filteredTeams = useMemo(() => {
    let filtered = teams;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.shortName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeConf === 'TODOS') {
      filtered = [...teams].sort((a, b) => ((b.attack + b.defense) / 2) - ((a.attack + a.defense) / 2));
    } else {
      filtered = teams.filter(t => getTeamConfederation(t.id) === activeConf);
      filtered.sort((a, b) => ((b.attack + b.defense) / 2) - ((a.attack + a.defense) / 2));
    }

    return filtered;
  }, [teams, searchTerm, activeConf]);

  const handleCardClick = (teamId: string) => {
    setSelectedId(teamId);
    setShowModal(true);
  };

  const confirmSelection = () => {
    if (selectedId) onSelect(selectedId);
  };

  const getTierLabel = (overall: number) => {
    if (overall >= 90) return { label: 'Elite', color: 'text-yellow-400' };
    if (overall >= 85) return { label: 'Forte', color: 'text-emerald-400' };
    if (overall >= 78) return { label: 'Médio', color: 'text-blue-400' };
    return { label: 'Outsider', color: 'text-secondary' };
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
            <span className="text-[10px] font-black tracking-[0.2em] text-yellow-400 uppercase">Copa do Mundo 2026</span>
            <span className="text-xs font-medium text-secondary tracking-widest uppercase opacity-70">EUA / México / Canadá</span>
          </div>
          <Globe className="w-6 h-6 text-yellow-400" />
        </div>

        <h1 className="text-4xl font-black mb-1 leading-none">Escolha sua<br /><span className="text-yellow-400">Seleção.</span></h1>
        <p className="text-sm text-secondary leading-relaxed mb-6 max-w-[85%]">
          Comande uma das 48 seleções e conquiste a glória mundial na Copa de 2026.
        </p>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Buscar seleção..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface rounded-2xl text-sm text-white placeholder-secondary border border-white/5 focus:outline-none focus:border-yellow-400/50"
          />
        </div>

        {/* CONFEDERATION TABS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {CONF_TABS.map(conf => (
            <button
              key={conf}
              onClick={() => { setActiveConf(conf); setSearchTerm(''); }}
              className={clsx(
                "px-4 py-2 rounded-full text-[10px] font-black tracking-wider uppercase whitespace-nowrap transition-all",
                activeConf === conf
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/25 scale-105"
                  : "bg-surface border border-white/5 text-secondary hover:bg-surface/80"
              )}
            >
              {conf === 'TODOS' ? 'Todas' : conf}
            </button>
          ))}
        </div>
      </header>

      {/* TEAM LIST */}
      <main className="flex-1 overflow-y-auto px-5 pb-24 scroll-smooth no-scrollbar space-y-3">
        {filteredTeams.map(team => {
          const overall = Math.round((team.attack + team.defense) / 2);
          const tier = getTierLabel(overall);
          const conf = getTeamConfederation(team.id);

          return (
            <div
              key={team.id}
              onClick={() => handleCardClick(team.id)}
              className="relative overflow-hidden bg-surface rounded-[2rem] border border-white/5 p-5 active:scale-[0.98] transition-all duration-300"
            >
              {overall >= 90 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-amber-600"></div>
              )}
              {overall >= 80 && overall < 90 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-green-600"></div>
              )}
              {overall < 80 && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary/50"></div>
              )}

              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="flex items-center gap-4">
                  <TeamLogo team={team} size="lg" />
                  <div>
                    <h3 className="text-lg font-black text-white leading-none mb-1">{team.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-white/5 px-2 py-0.5 rounded-md">
                        {conf}
                      </span>
                      <span className={clsx("text-[10px] font-black uppercase tracking-wider", tier.color)}>
                        {tier.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-black text-white">{overall}</span>
                  <span className="text-[10px] uppercase font-bold text-secondary">OVR</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pl-3">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-secondary tracking-wider">Ataque</span>
                    <span className="text-sm font-black text-white">{team.attack}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${team.attack}%` }}></div>
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

              {selectedId === team.id && (
                <div className="absolute bottom-0 left-0 right-0 h-9 bg-yellow-400 flex items-center justify-between px-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">Seleção Escolhida</span>
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* MODAL */}
      {showModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#151B26] w-full max-w-md max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
            {/* Modal Header */}
            <div className="relative p-8 pb-6 bg-gradient-to-b from-white/5 to-transparent">
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-5">
                <TeamLogo team={selectedTeam} size="lg" className="!w-20 !h-20" />
                <div>
                  <h2 className="text-2xl font-black text-white leading-tight mb-1">{selectedTeam.name}</h2>
                  <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    <span>{CONFEDERATION_LABELS[getTeamConfederation(selectedTeam.id)]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-8 pb-32 overflow-y-auto no-scrollbar">
              <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Força da Seleção</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-bold">Ataque</span>
                    <span className="text-white text-sm font-black">{selectedTeam.attack}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full">
                    <div className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${selectedTeam.attack}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-bold">Meio-Campo</span>
                    <span className="text-white text-sm font-black">{Math.round((selectedTeam.attack + selectedTeam.defense) / 2)}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full">
                    <div className="h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${Math.round((selectedTeam.attack + selectedTeam.defense) / 2)}%` }}></div>
                  </div>
                </div>
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

              {/* Elenco Resumido */}
              <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Destaques do Elenco</h3>
              <div className="space-y-2 mb-6">
                {selectedTeam.roster.slice(0, 8).map(player => (
                  <div key={player.id} className="flex justify-between items-center bg-surface px-4 py-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{player.position}</span>
                      <span className="text-sm font-bold text-white">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary">{player.age}a</span>
                      <span className={clsx("text-sm font-black",
                        player.overall >= 85 ? "text-yellow-400" :
                        player.overall >= 80 ? "text-emerald-400" : "text-white"
                      )}>{player.overall}</span>
                    </div>
                  </div>
                ))}
                {selectedTeam.roster.length > 8 && (
                  <p className="text-center text-xs text-secondary mt-2">+{selectedTeam.roster.length - 8} jogadores no elenco</p>
                )}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#151B26] via-[#151B26] to-transparent">
              <button
                onClick={confirmSelection}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-yellow-400/25 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
              >
                <span>CONFIRMAR SELEÇÃO</span>
                <Check className="w-6 h-6 bg-black/20 rounded-full p-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
