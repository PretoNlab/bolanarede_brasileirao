
import React, { useState } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, Globe, Target, Activity } from 'lucide-react';
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
        "bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-3xl rounded-[2.5rem] border overflow-hidden mb-8 transition-all duration-500 shadow-2xl",
        isUserGroup ? "border-primary/40 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] scale-[1.02]" : "border-white/10"
      )}>
        {/* Group Header */}
        <div className={clsx(
          "px-6 py-4 flex items-center justify-between border-b border-white/5",
          isUserGroup ? "bg-primary/10" : "bg-white/5"
        )}>
          <div className="flex items-center gap-3">
            <div className={clsx("w-1.5 h-4 rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]", isUserGroup ? "bg-primary" : "bg-white/20")} />
            <span className={clsx("text-base font-black uppercase tracking-widest", isUserGroup ? "text-primary" : "text-white")}>
              Grupo {group.name}
            </span>
          </div>
          {isUserGroup && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/20">
               <Activity size={10} className="text-primary animate-pulse" />
               <span className="text-[9px] font-black text-primary tracking-[0.2em] uppercase">Seu Grupo</span>
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="p-2">
            <div className="grid grid-cols-[1fr_30px_30px_30px_30px_40px_36px] gap-1 px-4 py-3 text-[9px] font-black uppercase text-white/30 tracking-[0.2em]">
                <span>Seleção</span>
                <span className="text-center">J</span>
                <span className="text-center">V</span>
                <span className="text-center">E</span>
                <span className="text-center">D</span>
                <span className="text-center">SG</span>
                <span className="text-center font-black text-white/60">PTS</span>
            </div>

            <div className="space-y-1">
                {standings.map((s, idx) => {
                const team = getTeam(s.teamId);
                if (!team) return null;
                const isUser = s.teamId === userTeamId;

                // Qualification zones
                let zoneStyle = '';
                if (idx < 2) zoneStyle = 'after:content-[""] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-emerald-500 after:rounded-full after:shadow-[0_0_8px_#10b981]';
                else if (idx === 2) zoneStyle = 'after:content-[""] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-amber-400 after:rounded-full';

                return (
                    <div
                    key={s.teamId}
                    className={clsx(
                        "relative grid grid-cols-[1fr_30px_30px_30px_30px_40px_36px] gap-1 px-4 py-3 items-center rounded-2xl transition-all",
                        isUser ? "bg-primary/10 border border-primary/10" : "bg-white/3 border border-transparent",
                        zoneStyle
                    )}
                    >
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white/20 w-4 pl-1">{idx + 1}</span>
                        <TeamLogo team={team} size="sm" />
                        <span className={clsx("text-sm font-black tracking-tighter truncate", isUser ? "text-primary" : "text-white")}>
                        {team.shortName}
                        </span>
                    </div>
                    <span className="text-[11px] text-center font-bold text-white/40">{s.played}</span>
                    <span className="text-[11px] text-center font-black text-emerald-400/80">{s.won}</span>
                    <span className="text-[11px] text-center font-bold text-white/40">{s.drawn}</span>
                    <span className="text-[11px] text-center font-bold text-rose-500/60">{s.lost}</span>
                    <span className={clsx("text-[11px] text-center font-black", s.gd > 0 ? "text-primary-light" : "text-white/30")}>
                        {s.gd > 0 ? `+${s.gd}` : s.gd}
                    </span>
                    <span className="text-sm text-center font-black text-white drop-shadow-md">{s.points}</span>
                    </div>
                );
                })}
            </div>
        </div>

        {/* Group Matches (Cinematic) */}
        {isUserGroup && (
          <div className="p-5 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Calendário do Grupo</span>
              {!groupPhaseComplete && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                   <Target size={10} className="text-primary-light" />
                   <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/50">Rodada {currentMatchday}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
              {groupFixturesByRound(group).map(({ round, fixtures: roundFixtures }) => (
                <div
                  key={`${group.name}-${round}`}
                  className={clsx(
                    "min-w-[280px] p-4 rounded-3xl border transition-all duration-500",
                    round === currentMatchday && !groupPhaseComplete
                      ? "bg-primary/5 border-primary/20 shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.05)]"
                      : "bg-black/20 border-white/5 opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={clsx(
                      "text-[9px] font-black uppercase tracking-[0.2em]",
                      round === currentMatchday && !groupPhaseComplete ? "text-primary" : "text-white/30"
                    )}>
                      Matchday 0{round}
                    </span>
                    {round === currentMatchday && !groupPhaseComplete && (
                       <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded-full tracking-widest animate-pulse">AGORA</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {roundFixtures.map((f, i) => {
                      const home = getTeam(f.homeTeamId);
                      const away = getTeam(f.awayTeamId);
                      if (!home || !away) return null;
                      const isUserMatch = f.homeTeamId === userTeamId || f.awayTeamId === userTeamId;

                      return (
                        <div key={i} className={clsx(
                          "flex items-center justify-between rounded-2xl px-4 py-3 transition-all",
                          isUserMatch ? "bg-primary/10 border border-primary/20" : "bg-white/5 border border-white/5"
                        )}>
                          <div className="flex flex-1 items-center gap-3">
                            <span className={clsx("text-xs font-black tracking-tight", f.homeTeamId === userTeamId ? "text-primary" : "text-white")}>
                              {home.shortName}
                            </span>
                          </div>
                          <div className="px-4 flex items-center justify-center">
                            {f.played ? (
                              <span className="text-sm font-black text-white tabular-nums">{f.homeScore} - {f.awayScore}</span>
                            ) : (
                              <div className="w-10 h-6 bg-black/40 rounded-lg flex items-center justify-center border border-white/5">
                                 <span className="text-[8px] font-black text-white/20">VS</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 items-center justify-end gap-3">
                            <span className={clsx("text-xs font-black tracking-tight", f.awayTeamId === userTeamId ? "text-primary" : "text-white")}>
                              {away.shortName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      {/* HEADER */}
      <header className="px-6 pt-12 pb-6 bg-gradient-to-b from-black to-transparent border-b border-white/5 z-20">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all active:scale-95 border border-white/5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">Copa do Mundo '26</span>
             </div>
             <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase">EUA / MEX / CAN</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <Globe className="w-5 h-5 text-primary opacity-50" />
          </div>
        </div>

        <h1 className="text-4xl font-black mb-6 leading-none tracking-tighter">
          Tabela Geral<span className="text-primary italic">.</span>
        </h1>

        {/* Tabs (Premium) */}
        <div className="flex gap-3">
          {(['MEU', 'TODOS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "flex-1 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 border shadow-2xl",
                activeTab === tab
                  ? "bg-primary border-primary text-white shadow-primary/20 scale-[1.02]"
                  : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
              )}
            >
              {tab === 'MEU' ? 'Meu Grupo' : 'Todos os Grupos'}
            </button>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 pt-6 no-scrollbar relative z-10">
        {/* Qualification Legend */}
        <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Classificado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Repescagem</span>
                </div>
            </div>
            {!groupPhaseComplete && (
               <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                  <span className="text-[9px] font-black text-primary tracking-tighter uppercase whitespace-nowrap">Matchday {currentMatchday} em andamento</span>
               </div>
            )}
        </div>

        {activeTab === 'MEU' && userGroup ? (
          renderGroupTable(userGroup, true)
        ) : (
          <div className="space-y-4">
            {groups.map(group => renderGroupTable(group, group === userGroup))}
          </div>
        )}
      </main>

      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
