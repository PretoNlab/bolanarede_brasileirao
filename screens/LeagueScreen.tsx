
import React, { useState, useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Team, Player } from '../types';
import { ArrowLeft, Trophy, Globe, Award, Star, ListOrdered, User } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  userTeamId: string | null;
  onBack: () => void;
}


export default function LeagueScreen({ teams, userTeamId, onBack }: Props) {
  const [tab, setTab] = useState<'LOCAL' | 'SCORERS'>('LOCAL');
  const [div, setDiv] = useState<1 | 2>(1);

  const standings = useMemo(() => {
    return [...teams]
      .filter(t => t.division === div)
      .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
  }, [teams, div]);

  const topScorers = useMemo(() => {
    const players: { p: Player, team: Team }[] = [];
    teams.filter(t => t.division === div).forEach(team => {
      team.roster.forEach(player => {
        if (player.goals > 0) players.push({ p: player, team });
      });
    });
    return players.sort((a, b) => b.p.goals - a.p.goals).slice(0, 10);
  }, [teams, div]);

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="p-4 border-b border-white/5 flex items-center justify-between bg-surface/30 backdrop-blur-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-black uppercase tracking-tighter italic">Série {div === 1 ? 'A' : 'B'}</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 flex gap-2">
        <button onClick={() => setTab('LOCAL')} className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all", tab === 'LOCAL' ? "bg-primary text-white" : "bg-surface text-secondary")}>
          CLASSIFICAÇÃO
        </button>
        <button onClick={() => setTab('SCORERS')} className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all", tab === 'SCORERS' ? "bg-emerald-600 text-white" : "bg-surface text-secondary")}>
          ARTILHARIA
        </button>
      </div>

      <div className="flex justify-center px-4 gap-8 mb-4">
        <button onClick={() => setDiv(1)} className={clsx("text-xs font-black pb-1 border-b-2 transition-all", div === 1 ? "border-primary text-white" : "border-transparent text-secondary")}>1ª DIVISÃO</button>
        <button onClick={() => setDiv(2)} className={clsx("text-xs font-black pb-1 border-b-2 transition-all", div === 2 ? "border-primary text-white" : "border-transparent text-secondary")}>2ª DIVISÃO</button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'LOCAL' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface/50 text-[10px] text-secondary uppercase font-black">
                <tr>
                  <th className="px-4 py-3 text-left w-12">#</th>
                  <th className="px-2 py-3 text-left">CLUBE</th>
                  <th className="px-3 py-3 text-center">P</th>
                  <th className="px-3 py-3 text-center">J</th>
                  <th className="px-3 py-3 text-center">SG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.map((t, i) => {
                  const isUser = t.id === userTeamId;
                  const isPromotion = div === 2 && i < 2;
                  const isRelegation = div === 1 && i >= 8;
                  const isChampion = div === 1 && i === 0;

                  return (
                    <tr key={t.id} className={clsx(isUser ? "bg-primary/20" : "")}>
                      <td className="px-4 py-4 relative">
                        {isChampion && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>}
                        {isPromotion && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                        {isRelegation && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>}
                        <span className="font-black">{i + 1}º</span>
                      </td>
                      <td className="px-2 py-4 font-bold flex items-center gap-2">
                        <TeamLogo team={t} size="sm" />
                        <span className="truncate max-w-[120px]">{t.name}</span>
                      </td>
                      <td className="px-3 py-4 text-center font-black">{t.points}</td>
                      <td className="px-3 py-4 text-center text-secondary">{t.played}</td>
                      <td className="px-3 py-4 text-center text-secondary">{t.gf - t.ga}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Campeão
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Zona de Promoção
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div> Zona de Rebaixamento
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {topScorers.length === 0 ? (
              <div className="py-20 text-center text-secondary opacity-40">Nenhum gol marcado ainda.</div>
            ) : (
              topScorers.map((entry, idx) => (
                <div key={idx} className="bg-surface p-4 rounded-2xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-secondary">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{entry.p.name}</p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <TeamLogo team={entry.team} size="xs" />
                        <p className="text-[10px] text-secondary font-bold uppercase">{entry.team.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-emerald-500">{entry.p.goals}</span>
                    <span className="text-[8px] font-black text-secondary uppercase">Gols</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
