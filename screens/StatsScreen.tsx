import React, { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, Trophy, Target, HandHelping, Users } from 'lucide-react';
import clsx from 'clsx';
import { Team } from '../types';
import { PlayerSeasonStats } from '../save';

interface Row {
  playerId: string;
  playerName: string;
  teamId: string;
  teamShort: string;
  value: number;
  secondary?: number;
}

interface Props {
  teams: Team[];
  season: number;
  round: number;
  playerStats: Record<string, PlayerSeasonStats>;
  onBack: () => void;
}

const TeamLogo = ({ team, size = "w-10 h-10" }: { team: Team, size?: string }) => {
  return (
    <div className={`${size} rounded-2xl bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center font-black shadow-lg border border-white/10`}>
      {team.shortName}
    </div>
  );
};

export default function StatsScreen({ teams, season, round, playerStats, onBack }: Props) {
  const [tab, setTab] = useState<'SCORERS' | 'ASSISTS' | 'TEAMS'>('SCORERS');

  const scorers = useMemo(() => {
    const list: Row[] = [];
    Object.entries(playerStats).forEach(([pid, stats]) => {
      if (stats.goals > 0) {
        // Find player info
        let found = false;
        for (const t of teams) {
          const p = t.roster.find(x => x.id === pid);
          if (p) {
            list.push({
              playerId: pid,
              playerName: p.name,
              teamId: t.id,
              teamShort: t.shortName,
              value: stats.goals,
              secondary: parseFloat((stats.goals / Math.max(1, stats.games)).toFixed(2))
            });
            found = true;
            break;
          }
        }
      }
    });
    return list.sort((a, b) => b.value - a.value).slice(0, 50);
  }, [playerStats, teams]);

  const assisters = useMemo(() => {
    const list: Row[] = [];
    Object.entries(playerStats).forEach(([pid, stats]) => {
      if (stats.assists > 0) {
        // Find player info
        let found = false;
        for (const t of teams) {
          const p = t.roster.find(x => x.id === pid);
          if (p) {
            list.push({
              playerId: pid,
              playerName: p.name,
              teamId: t.id,
              teamShort: t.shortName,
              value: stats.assists,
              secondary: parseFloat((stats.assists / Math.max(1, stats.games)).toFixed(2))
            });
            found = true;
            break;
          }
        }
      }
    });
    return list.sort((a, b) => b.value - a.value).slice(0, 50);
  }, [playerStats, teams]);

  const teamTable = useMemo(() => {
    // Combined table just for viewing stats
    return [...teams].sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
  }, [teams]);

  const CardTitle = useMemo(() => {
    switch (tab) {
      case 'SCORERS': return { title: 'Artilharia', subtitle: 'Gols na Temporada', icon: <Target className="text-amber-400" size={20} /> };
      case 'ASSISTS': return { title: 'Garçons', subtitle: 'Assistências', icon: <HandHelping className="text-blue-400" size={20} /> };
      case 'TEAMS': return { title: 'Classificação Geral', subtitle: 'Todos os Clubes', icon: <Trophy className="text-emerald-400" size={20} /> };
    }
  }, [tab]);

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-black tracking-tight flex items-center gap-2"><BarChart3 size={16} className="text-secondary" /> Estatísticas</h1>
            <p className="text-[10px] text-secondary font-bold">Temporada {season} • Rodada {round}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-safe no-scrollbar">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTab('SCORERS')}
            className={clsx(
              'py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all',
              tab === 'SCORERS' ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-surface border-white/5 text-secondary'
            )}
          >
            Gols
          </button>
          <button
            onClick={() => setTab('ASSISTS')}
            className={clsx(
              'py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all',
              tab === 'ASSISTS' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-surface border-white/5 text-secondary'
            )}
          >
            Assists
          </button>
          <button
            onClick={() => setTab('TEAMS')}
            className={clsx(
              'py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all',
              tab === 'TEAMS' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-surface border-white/5 text-secondary'
            )}
          >
            Liga
          </button>
        </div>

        <div className="bg-surface/60 border border-white/5 rounded-[28px] p-5 shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {CardTitle.icon}
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{CardTitle.title}</h2>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{CardTitle.subtitle}</p>
            </div>
          </div>

          {tab !== 'TEAMS' && (
            <div className="space-y-2">
              {(tab === 'SCORERS' ? scorers : assisters).length === 0 ? (
                <div className="py-12 text-center text-secondary">
                  <Users size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-bold">Sem dados ainda</p>
                  <p className="text-[10px] opacity-70">Jogue algumas rodadas para popular o ranking.</p>
                </div>
              ) : (
                (tab === 'SCORERS' ? scorers : assisters).map((r, idx) => (
                  <div key={r.playerId} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs border',
                        idx === 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                          idx === 1 ? 'bg-surface border-white/10 text-white/90' :
                            idx === 2 ? 'bg-rose-500/5 border-rose-500/10 text-rose-200' :
                              'bg-surface border-white/5 text-secondary'
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight">{r.playerName}</span>
                        <span className="text-[10px] text-secondary font-bold">{r.teamShort}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black tabular-nums">{r.value}</span>
                      <span className="text-[10px] text-secondary font-bold">por jogo: {r.secondary ?? 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'TEAMS' && (
            <div className="space-y-2">
              {teamTable.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs border',
                      idx === 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                        idx === 1 ? 'bg-surface border-white/10 text-white/90' :
                          idx === 2 ? 'bg-rose-500/5 border-rose-500/10 text-rose-200' :
                            'bg-surface border-white/5 text-secondary'
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamLogo team={t} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight">{t.name}</span>
                        <span className="text-[10px] text-secondary font-bold">{t.points} pts • SG {t.gf - t.ga}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-secondary font-bold">J {t.played} • V {t.won} • E {t.drawn} • D {t.lost}</div>
                    <div className="text-[10px] text-secondary font-bold">GF {t.gf} • GA {t.ga}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
