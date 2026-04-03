
import React, { useState } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, Globe } from 'lucide-react';
import { Team, WCGroup, Fixture } from '../types';
import { calculateGroupStandings } from '../engine/worldCupEngine';
import clsx from 'clsx';

interface Props {
  groups: WCGroup[];
  teams: Team[];
  fixtures: Fixture[];
  userTeamId: string;
  currentMatchday: number;
  groupPhaseComplete: boolean;
  onBack: () => void;
}

export default function WorldCupGroupScreen({ groups, teams, fixtures, userTeamId, currentMatchday, groupPhaseComplete, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'MEU' | 'TODOS'>('MEU');

  const userGroup = groups.find(g => g.teamIds.includes(userTeamId));
  const getTeam = (id: string) => teams.find(t => t.id === id);

  const groupFixturesByRound = (group: WCGroup) => {
    return [1, 2, 3].map((round) => ({
      round,
      fixtures: fixtures
        .filter((fixture) => fixture.round === round && group.teamIds.includes(fixture.homeTeamId) && group.teamIds.includes(fixture.awayTeamId))
        .sort((a, b) => Number(a.played) - Number(b.played)),
    }));
  };

  const renderGroupTable = (group: WCGroup, isUserGroup: boolean) => {
    const standings = calculateGroupStandings(group, fixtures);

    return (
      <div key={group.name} className={clsx(
        "bg-surface rounded-2xl border overflow-hidden mb-4",
        isUserGroup ? "border-yellow-400/30" : "border-white/5"
      )}>
        {/* Group Header */}
        <div className={clsx(
          "px-4 py-3 flex items-center justify-between",
          isUserGroup ? "bg-yellow-400/10" : "bg-white/5"
        )}>
          <div className="flex items-center gap-2">
            <span className={clsx("text-sm font-black", isUserGroup ? "text-yellow-400" : "text-white")}>
              Grupo {group.name}
            </span>
            {isUserGroup && <span className="text-[9px] font-black text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded-full uppercase">Seu Grupo</span>}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_30px_30px_30px_30px_40px_36px] gap-1 px-4 py-2 text-[9px] font-black uppercase text-secondary tracking-wider border-b border-white/5">
          <span>Seleção</span>
          <span className="text-center">J</span>
          <span className="text-center">V</span>
          <span className="text-center">E</span>
          <span className="text-center">D</span>
          <span className="text-center">SG</span>
          <span className="text-center font-black">PTS</span>
        </div>

        {/* Rows */}
        {standings.map((s, idx) => {
          const team = getTeam(s.teamId);
          if (!team) return null;
          const isUser = s.teamId === userTeamId;

          // Classificação visual
          let statusColor = '';
          if (groupPhaseComplete) {
            if (idx < 2) statusColor = 'bg-emerald-500/10 border-l-2 border-l-emerald-500';
            else if (idx === 2) statusColor = 'bg-amber-500/10 border-l-2 border-l-amber-500'; // Possível 3º
            else statusColor = 'bg-red-500/10 border-l-2 border-l-red-500';
          }

          return (
            <div
              key={s.teamId}
              className={clsx(
                "grid grid-cols-[1fr_30px_30px_30px_30px_40px_36px] gap-1 px-4 py-2.5 items-center border-b border-white/5 last:border-b-0",
                isUser && "bg-yellow-400/5",
                statusColor
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-secondary w-4">{idx + 1}</span>
                <TeamLogo team={team} size="sm" />
                <span className={clsx("text-xs font-bold truncate", isUser ? "text-yellow-400" : "text-white")}>
                  {team.shortName}
                </span>
              </div>
              <span className="text-xs text-center text-secondary">{s.played}</span>
              <span className="text-xs text-center text-emerald-400">{s.won}</span>
              <span className="text-xs text-center text-secondary">{s.drawn}</span>
              <span className="text-xs text-center text-red-400">{s.lost}</span>
              <span className="text-xs text-center text-secondary">{s.gd > 0 ? `+${s.gd}` : s.gd}</span>
              <span className="text-sm text-center font-black text-white">{s.points}</span>
            </div>
          );
        })}

        {/* Group Matches */}
        {activeTab === 'MEU' && isUserGroup && (
          <div className="px-4 py-3 space-y-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-secondary">Jogos do Grupo</span>
              {!groupPhaseComplete && (
                <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-yellow-400">
                  Matchday {currentMatchday}
                </span>
              )}
            </div>

            {groupFixturesByRound(group).map(({ round, fixtures: roundFixtures }) => (
              <div
                key={`${group.name}-${round}`}
                className={clsx(
                  "space-y-2 rounded-2xl border px-3 py-3",
                  round === currentMatchday && !groupPhaseComplete
                    ? "border-yellow-400/20 bg-yellow-400/5"
                    : "border-white/6 bg-white/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.18em]",
                    round === currentMatchday && !groupPhaseComplete ? "text-yellow-400" : "text-secondary"
                  )}>
                    Matchday {round}
                  </span>
                  {round === currentMatchday && !groupPhaseComplete && (
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-yellow-400">Atual</span>
                  )}
                </div>

                {roundFixtures.map((f, i) => {
                  const home = getTeam(f.homeTeamId);
                  const away = getTeam(f.awayTeamId);
                  if (!home || !away) return null;
                  const isUserMatch = f.homeTeamId === userTeamId || f.awayTeamId === userTeamId;

                  return (
                    <div key={i} className={clsx(
                      "flex items-center justify-between rounded-xl px-3 py-2",
                      isUserMatch ? "border border-yellow-400/20 bg-yellow-400/5" : "bg-black/10"
                    )}>
                      <div className="flex flex-1 items-center gap-2">
                        <span className={clsx("text-xs font-bold", f.homeTeamId === userTeamId ? "text-yellow-400" : "text-white")}>
                          {home.shortName}
                        </span>
                      </div>
                      <div className="px-3">
                        {f.played ? (
                          <span className="text-sm font-black text-white">{f.homeScore} - {f.awayScore}</span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase text-secondary">A jogar</span>
                        )}
                      </div>
                      <div className="flex flex-1 items-center justify-end gap-2">
                        <span className={clsx("text-xs font-bold", f.awayTeamId === userTeamId ? "text-yellow-400" : "text-white")}>
                          {away.shortName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans">
      {/* HEADER */}
      <header className="px-5 pt-12 pb-4 bg-background z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-surface text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-[0.2em] text-yellow-400 uppercase">Copa do Mundo 2026</span>
            <span className="text-xs font-medium tracking-widest uppercase text-secondary opacity-70">Fase de Grupos</span>
          </div>
          <Globe className="w-6 h-6 text-yellow-400" />
        </div>

        <h1 className="text-3xl font-black mb-4 leading-none">
          Grupos<span className="text-yellow-400">.</span>
        </h1>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-secondary">
            Fase de grupos
          </div>
          {!groupPhaseComplete && (
            <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">
              Matchday {currentMatchday} de 3
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {(['MEU', 'TODOS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all",
                activeTab === tab
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/25"
                  : "bg-surface border border-white/5 text-secondary"
              )}
            >
              {tab === 'MEU' ? 'Meu Grupo' : 'Todos os Grupos'}
            </button>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto px-5 pb-8 no-scrollbar">
        {/* Legenda de classificação */}
        {groupPhaseComplete && (
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-secondary font-bold">Classificado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-[10px] text-secondary font-bold">Possível 3º</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-[10px] text-secondary font-bold">Eliminado</span>
            </div>
          </div>
        )}

        {activeTab === 'MEU' && userGroup ? (
          renderGroupTable(userGroup, true)
        ) : (
          <div className="space-y-0">
            {groups.map(group => renderGroupTable(group, group === userGroup))}
          </div>
        )}
      </main>
    </div>
  );
}
