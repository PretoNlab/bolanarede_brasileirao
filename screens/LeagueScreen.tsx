import React, { useState, useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Team, Player } from '../types';
import { Trophy, Users, BarChart3, ChevronRight, ChevronLeft } from 'lucide-react';
import { Header } from '../components/Header';
import clsx from 'clsx';
import { hapticSelection } from '../haptics';

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
    <div className="flex flex-col h-screen bg-background text-white/90 selection:bg-primary/30">
      <Header 
        title={div === 1 ? 'Série A' : 'Série B'} 
        subtitle="Competição Nacional"
        onBack={onBack}
        rightAction={
          <button 
            onClick={() => setDiv(div === 1 ? 2 : 1)}
            className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white/10 transition-all active:scale-95"
          >
            {div === 1 ? 'Série B' : 'Série A'}
          </button>
        }
      />

      <div className="px-6 mb-8 mt-2">
        <div className="flex p-2 bg-black/40 rounded-[2.25rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />
          <button 
            onClick={() => { hapticSelection(); setTab('LOCAL'); }} 
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.75rem] text-[10px] font-black tracking-[0.2em] transition-all relative z-10",
              tab === 'LOCAL' ? "bg-primary shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] text-white scale-[1.02]" : "text-white/30 hover:text-white/60 hover:bg-white/5"
            )}
          >
            <BarChart3 className={clsx("w-3.5 h-3.5", tab === 'LOCAL' ? "text-white" : "text-white/20")} />
            CLASSIFICAÇÃO
          </button>
          <button 
            onClick={() => { hapticSelection(); setTab('SCORERS'); }} 
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.75rem] text-[10px] font-black tracking-[0.2em] transition-all relative z-10",
              tab === 'SCORERS' ? "bg-primary shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] text-white scale-[1.02]" : "text-white/30 hover:text-white/60 hover:bg-white/5"
            )}
          >
            <Trophy className={clsx("w-3.5 h-3.5", tab === 'SCORERS' ? "text-white" : "text-white/20")} />
            ARTILHARIA
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-safe px-6">
        {tab === 'LOCAL' ? (
          <div className="ui-card-premium p-0 overflow-hidden mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <div className="overflow-x-auto selection:bg-primary/20">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0f172a]/50 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] border-b border-white/5 backdrop-blur-md">
                  <tr>
                    <th className="pl-6 pr-4 py-6 w-16">Pos</th>
                    <th className="px-4 py-6 min-w-[220px]">Clube</th>
                    <th className="px-4 py-6 text-center">Pts</th>
                    <th className="px-4 py-6 text-center">Jog</th>
                    <th className="px-4 py-6 text-center">SG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {standings.map((t, i) => {
                    const isUser = t.id === userTeamId;
                    const isPromotion = div === 2 && i < 2;
                    const isRelegation = div === 1 && i >= 8;
                    const isChampion = div === 1 && i === 0;

                    return (
                      <tr 
                        key={t.id} 
                        className={clsx(
                          "transition-all group relative",
                          isUser ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-white/[0.03]"
                        )}
                      >
                        <td className="pl-6 pr-4 py-6 relative">
                          <div className={clsx(
                            "absolute left-0 top-0 bottom-0 w-[4px] transition-all group-hover:w-[6px]",
                            isChampion ? "bg-yellow-500 shadow-[4px_0_15px_rgba(234,179,8,0.4)]" :
                            isPromotion ? "bg-emerald-500 shadow-[4px_0_15px_rgba(16,185,129,0.4)]" :
                            isRelegation ? "bg-rose-500 shadow-[4px_0_15px_rgba(244,63,94,0.4)]" :
                            "bg-transparent"
                          )} />
                          <span className={clsx(
                            "text-sm font-black tabular-nums tracking-tighter",
                            isUser ? "text-primary scale-110 inline-block" : "text-white/40 group-hover:text-white transition-colors"
                          )}>{i + 1}º</span>
                        </td>
                        <td className="px-4 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                               <TeamLogo team={t} size="sm" className="shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                               {isUser && <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />}
                            </div>
                            <div className="flex flex-col">
                              <span className={clsx(
                                "text-[15px] font-black tracking-tighter uppercase italic transition-colors",
                                isUser ? "text-white" : "text-white/70 group-hover:text-white"
                              )}>{t.name}</span>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40">{t.shortName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-6 text-center">
                          <span className={clsx(
                            "text-base font-black tabular-nums tracking-tighter",
                            isUser ? "text-primary" : "text-white"
                          )}>{t.points}</span>
                        </td>
                        <td className="px-4 py-6 text-center">
                          <span className="text-xs font-bold text-white/30 tabular-nums">{t.played}</span>
                        </td>
                        <td className="px-4 py-6 text-center">
                           <span className={clsx(
                             "text-[11px] font-black tracking-widest tabular-nums italic",
                             (t.gf - t.ga) > 0 ? "text-emerald-500" : (t.gf - t.ga) < 0 ? "text-rose-500" : "text-white/10"
                           )}>
                             {t.gf - t.ga > 0 ? `+${t.gf - t.ga}` : t.gf - t.ga}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-black/40 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-4">
               {[
                 { color: 'bg-yellow-500', shadow: 'shadow-[0_0_12px_rgba(234,179,8,0.5)]', label: 'Campeão' },
                 { color: 'bg-emerald-500', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]', label: 'Promoção' },
                 { color: 'bg-rose-500', shadow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]', label: 'Rebaixamento' },
                 { color: 'bg-primary', shadow: 'shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]', label: 'Seu Clube' }
               ].map((item) => (
                 <div key={item.label} className="flex items-center gap-3 group">
                   <div className={clsx("w-2 h-2 rounded-full transition-transform group-hover:scale-150", item.color, item.shadow)} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {topScorers.length === 0 ? (
              <div className="ui-card-premium py-32 flex flex-col items-center justify-center bg-white/[0.01]">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/10 mb-6">
                   <Users size={40} strokeWidth={1} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Aguardando dados da rodada</p>
              </div>
            ) : (
              topScorers.map((entry, idx) => (
                <div
                  key={entry.p.id}
                  className="ui-card-premium p-6 group hover:translate-x-2 transition-all duration-500 border-white/5 hover:border-primary/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className={clsx(
                          "flex h-16 w-16 items-center justify-center rounded-2xl border font-black text-lg shadow-2xl transition-all duration-500 overflow-hidden",
                          idx === 0 ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-500 shadow-yellow-500/10" : "border-white/5 bg-background text-white/20"
                        )}>
                          <span className="relative z-10">#{idx + 1}</span>
                        </div>
                        {idx === 0 && (
                          <div className="absolute -top-3 -right-3 p-2 bg-yellow-500 rounded-full shadow-[0_10px_20px_rgba(234,179,8,0.4)] border-2 border-[#020617] animate-bounce">
                            <Trophy size={14} className="text-black" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 className="text-xl font-black tracking-tighter text-white group-hover:text-primary transition-colors italic uppercase leading-none mb-2">{entry.p.name}</h4>
                        <div className="flex items-center gap-3">
                          <TeamLogo team={entry.team} size="xs" className="opacity-80 group-hover:opacity-100" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                            {entry.team.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end pr-2">
                      <span className="text-4xl font-black tabular-nums text-primary tracking-tighter leading-none group-hover:scale-110 transition-transform">{entry.p.goals}</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-1.5">Gols marcados</span>
                    </div>
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
