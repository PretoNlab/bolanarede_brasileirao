
import React, { useMemo, useState } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, BarChart3, Trophy, Target, HandHelping, Users, ChevronRight, Calculator } from 'lucide-react';
import { Header } from '../components/Header';
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

export default function StatsScreen({ teams, season, round, playerStats, onBack }: Props) {
  const [tab, setTab] = useState<'SCORERS' | 'ASSISTS' | 'TEAMS'>('SCORERS');

  const scorers = useMemo(() => {
    const list: Row[] = [];
    Object.entries(playerStats).forEach(([pid, stats]) => {
      if (stats.goals > 0) {
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
            break;
          }
        }
      }
    });
    return list.sort((a, b) => b.value - a.value).slice(0, 50);
  }, [playerStats, teams]);

  const teamTable = useMemo(() => {
    return [...teams].sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
  }, [teams]);

  return (
    <div className="flex flex-col h-screen bg-background text-white/90 selection:bg-primary/30">
      <Header 
        title="Estatísticas" 
        subtitle={`Temporada ${season} • Rodada ${round}`}
        onBack={onBack}
        rightAction={<div className="p-3 bg-white/5 rounded-2xl border border-white/5"><BarChart3 size={18} className="text-primary" /></div>}
      />

      <div className="px-6 mb-6">
        <div className="flex p-1.5 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-3xl shadow-xl">
          {[
            { id: 'SCORERS', label: 'Gols', icon: <Target size={14} /> },
            { id: 'ASSISTS', label: 'Assists', icon: <HandHelping size={14} /> },
            { id: 'TEAMS', label: 'Global', icon: <Trophy size={14} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] text-[10px] font-black tracking-[0.14em] transition-all",
                tab === item.id ? "bg-primary shadow-lg shadow-primary/20 text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-safe px-6">
        <div className="space-y-3 mb-8">
          {tab !== 'TEAMS' ? (
            (tab === 'SCORERS' ? scorers : assisters).length === 0 ? (
              <div className="ui-card-premium py-24 flex flex-col items-center justify-center opacity-30">
                <Users size={32} className="mb-4" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">Sem dados acumulados</p>
              </div>
            ) : (
              (tab === 'SCORERS' ? scorers : assisters).map((r, idx) => (
                <div key={r.playerId} className="ui-card-premium p-5 group hover:translate-x-1 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        'w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs border transition-colors',
                        idx === 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                        idx === 1 ? 'bg-white/5 border-white/10 text-white/90' :
                        idx === 2 ? 'bg-orange-600/10 border-orange-600/30 text-orange-600' :
                        'bg-white/5 border-white/5 text-white/30'
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-white group-hover:text-primary transition-colors">{r.playerName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/20">{r.teamShort}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[10px] font-bold text-white/30 italic">Média {r.secondary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black tabular-nums text-white leading-none">{r.value}</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">{tab === 'SCORERS' ? 'Gols' : 'Assists'}</span>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            teamTable.map((t, idx) => (
              <div key={t.id} className="ui-card-premium p-5 group hover:translate-x-1 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      'w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs border transition-colors',
                      idx === 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                      'bg-white/5 border-white/5 text-white/30'
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamLogo team={t} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-white">{t.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">{t.points} PTS</span>
                           <span className="text-[9px] font-bold text-white/20">SALDO {t.gf - t.ga}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black tabular-nums text-white/60">{t.won}</span>
                      <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/20">V</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black tabular-nums text-white/60">{t.drawn}</span>
                      <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/20">E</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black tabular-nums text-white/60">{t.lost}</span>
                      <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/20">D</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
