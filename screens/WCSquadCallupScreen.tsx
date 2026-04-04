import React, { useEffect, useMemo, useState } from 'react';
import { Player, Team } from '../types';
import TeamLogo from '../components/TeamLogo';

interface WCSquadCallupScreenProps {
  userTeam: Team;
  provisionalSquad: Player[];
  onConfirm: (selectedIds: string[]) => void;
  onBack: () => void;
}

const WCSquadCallupScreen: React.FC<WCSquadCallupScreenProps> = ({
  userTeam,
  provisionalSquad,
  onConfirm,
  onBack
}) => {
  const positionTarget: Record<Player['position'], number> = {
    GOL: 3,
    ZAG: 5,
    LAT: 4,
    VOL: 5,
    MEI: 5,
    ATA: 4,
  };

  const positionOrder: Record<Player['position'], number> = {
    GOL: 0,
    ZAG: 1,
    LAT: 2,
    VOL: 3,
    MEI: 4,
    ATA: 5,
  };

  const buildRecommendedSquad = (players: Player[]) => {
    const sorted = [...players].sort((a, b) => b.overall - a.overall);
    const picked: Player[] = [];

    (Object.keys(positionTarget) as Player['position'][]).forEach((position) => {
      const picks = sorted.filter((player) => player.position === position).slice(0, positionTarget[position]);
      picked.push(...picks);
    });

    const pickedIds = new Set(picked.map((player) => player.id));
    const remaining = sorted.filter((player) => !pickedIds.has(player.id));
    const completed = [...picked];

    for (const player of remaining) {
      if (completed.length >= 26) break;
      completed.push(player);
    }

    return completed.slice(0, 26).map((player) => player.id);
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA'>('ALL');

  useEffect(() => {
    setSelectedIds(buildRecommendedSquad(provisionalSquad));
  }, [provisionalSquad]);

  const filteredSquad = useMemo(() => {
    const base = filter === 'ALL' ? provisionalSquad : provisionalSquad.filter((player) => player.position === filter);

    return [...base].sort((a, b) => {
      const selectedDelta = Number(selectedIds.includes(b.id)) - Number(selectedIds.includes(a.id));
      if (selectedDelta !== 0) return selectedDelta;

      const positionDelta = positionOrder[a.position] - positionOrder[b.position];
      if (positionDelta !== 0) return positionDelta;

      return b.overall - a.overall;
    });
  }, [filter, provisionalSquad, selectedIds]);

  const togglePlayer = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      if (selectedIds.length < 26) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const countByPos = (pos: string) => {
    return provisionalSquad.filter(p => p.position === pos && selectedIds.includes(p.id)).length;
  };

  const isComplete = selectedIds.length === 26;

  return (
    <div className="h-full overflow-hidden flex flex-col bg-slate-950 text-white animate-in fade-in duration-700">
      {/* Header Fixo */}
      <div className="z-50 border-b border-white/10 bg-slate-950/90 pb-4 backdrop-blur-md px-4 md:px-8 pt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex items-center gap-3">
              <TeamLogo team={userTeam} size="lg" />
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-400 to-amber-200 bg-clip-text text-transparent uppercase tracking-tighter">
                  Convocação Oficial
                </h1>
                <p className="text-slate-400 text-sm font-medium">Copa do Mundo 2026 • {userTeam.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-white/10 rounded-2xl p-2 px-4 shadow-xl">
            <div className="text-center md:text-right">
              <span className="block text-xs text-slate-500 uppercase font-bold tracking-widest">Selecionados</span>
              <span className={`text-2xl font-black ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                {selectedIds.length} <span className="text-slate-600 text-lg">/ 26</span>
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/10 mx-2" />
            <button
              disabled={!isComplete}
              onClick={() => onConfirm(selectedIds)}
              className={`px-8 py-3 rounded-xl font-bold uppercase tracking-tight transition-all ${
                isComplete 
                ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20 active:scale-95' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              Confirmar Lista
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 rounded-2xl border border-white/8 bg-slate-900/70 px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-medium text-slate-300">
              A lista inicial já vem recomendada com os 26 melhores nomes. Ajuste por posição, momento e leitura de elenco.
            </p>
            <button
              onClick={() => setSelectedIds(buildRecommendedSquad(provisionalSquad))}
              className="rounded-full border border-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/8"
            >
              Restaurar recomendação
            </button>
          </div>
        </div>

        {/* Resumo por Posição */}
        <div className="max-w-7xl mx-auto mt-4 flex flex-wrap gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {['GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'].map(pos => (
            <div key={pos} className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] text-slate-500 font-bold mb-1">{pos}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border ${
                countByPos(pos) > 0 ? 'bg-slate-900 border-yellow-500/50 text-white' : 'bg-slate-900/50 border-white/5 text-slate-600'
              }`}>
                {countByPos(pos)}
              </div>
              <span className="mt-1 text-[10px] font-bold text-slate-600">/{positionTarget[pos as Player['position']]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Filtros */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['ALL', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'].map(btn => (
              <button
                key={btn}
                onClick={() => setFilter(btn as any)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  filter === btn 
                    ? 'bg-white text-black' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {btn === 'ALL' ? 'TODOS' : btn}
              </button>
            ))}
          </div>

          {/* Grid de Jogadores */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSquad.map(player => {
              const isSelected = selectedIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`group relative min-h-[228px] cursor-pointer overflow-hidden rounded-2xl border-2 p-4 transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-br from-green-900/40 to-slate-900 border-green-500/50 shadow-lg shadow-green-950/40 scale-[1.02]' 
                      : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Indicador de Seleção */}
                  {isSelected && (
                    <div className="absolute right-3 top-3 z-10 animate-in zoom-in duration-300">
                      <div className="bg-green-500 rounded-full p-1 border-2 border-slate-950 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className={`mb-1 inline-block rounded px-2 py-0.5 text-[10px] font-black ${
                        player.position === 'GOL' ? 'bg-orange-500/20 text-orange-400' :
                        player.position === 'ATA' ? 'bg-red-500/20 text-red-400' :
                        player.position === 'MEI' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {player.position} • {player.mainPosition}
                      </span>
                      <h3 className="pr-6 text-lg font-bold leading-tight text-white break-words">{player.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                        <span>{player.age} anos</span>
                        <span>{player.preferredFoot === 'RIGHT' ? 'Destro' : player.preferredFoot === 'LEFT' ? 'Canhoto' : 'Ambidestro'}</span>
                      </div>
                    </div>
                    <div className="shrink-0 pr-12 text-right">
                      <span className="text-2xl font-black text-white">{player.overall}</span>
                      <span className="block text-[10px] text-slate-500 font-bold leading-none">OVR</span>
                    </div>
                  </div>

                  {/* Mini Atributos */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="text-center bg-black/20 rounded p-1">
                      <span className="block text-[8px] text-slate-500 uppercase font-black">ATA</span>
                      <span className="text-sm font-bold text-slate-200">{player.stats.finishing}</span>
                    </div>
                    <div className="text-center bg-black/20 rounded p-1">
                      <span className="block text-[8px] text-slate-500 uppercase font-black">DEF</span>
                      <span className="text-sm font-bold text-slate-200">{player.stats.defending}</span>
                    </div>
                    <div className="text-center bg-black/20 rounded p-1">
                      <span className="block text-[8px] text-slate-500 uppercase font-black">FIS</span>
                      <span className="text-sm font-bold text-slate-200">{player.stats.physical}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {isSelected ? 'Na lista final' : 'Fora da lista final'}
                  </div>

                  {/* Overlays Visuais */}
                  <div className="absolute -bottom-3 -right-3 opacity-[0.07] transition-opacity group-hover:opacity-[0.12]">
                    <TeamLogo team={userTeam} size="lg" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WCSquadCallupScreen;
