
import React, { useState } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, Globe, Trophy } from 'lucide-react';
import { Team, WCBracketMatch, WCPhase } from '../types';
import { PHASE_LABELS } from '../engine/worldCupEngine';
import clsx from 'clsx';

interface Props {
  bracket: WCBracketMatch[];
  teams: Team[];
  userTeamId: string;
  onBack: () => void;
}

const PHASE_ORDER: WCPhase[] = ['ROUND_OF_32', 'ROUND_OF_16', 'QUARTER', 'SEMI', 'THIRD_PLACE', 'FINAL'];

export default function WorldCupBracketScreen({ bracket, teams, userTeamId, onBack }: Props) {
  const [activePhase, setActivePhase] = useState<WCPhase>('ROUND_OF_32');

  const getTeam = (id: string | null) => id ? teams.find(t => t.id === id) : null;

  const phaseMatches = bracket.filter(m => m.phase === activePhase).sort((a, b) => a.matchNumber - b.matchNumber);

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      {/* 1. CINEMATIC HEADER */}
      <header className="px-6 pt-12 pb-6 bg-gradient-to-b from-black to-transparent border-b border-white/5 z-20">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all active:scale-95 border border-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1">
                <Trophy size={14} className="text-primary animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">Caminho da Glória</span>
             </div>
             <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase">Mata-Mata World Cup '26</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <Globe className="w-5 h-5 text-primary opacity-50" />
          </div>
        </div>

        <h1 className="text-4xl font-black mb-6 leading-none tracking-tighter">
          Fase Perfeita<span className="text-primary italic">.</span>
        </h1>

        {/* Phase Tabs (Cinematic) */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
          {PHASE_ORDER.map(phase => {
            const matches = bracket.filter(m => m.phase === phase);
            const hasMatches = matches.length > 0;
            const allPlayed = matches.every(m => m.played);

            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={clsx(
                  "px-5 py-3 rounded-2xl text-[10px] font-black tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-300 border flex items-center gap-2",
                  activePhase === phase
                    ? "bg-primary border-primary text-white shadow-[0_10px_20px_rgba(var(--primary-rgb),0.2)] scale-105"
                    : allPlayed && hasMatches
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-80"
                      : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                )}
              >
                {allPlayed && hasMatches && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                {phase === 'ROUND_OF_32' ? '32avos' :
                 phase === 'ROUND_OF_16' ? 'Oitavas' :
                 phase === 'QUARTER' ? 'Quartas' :
                 phase === 'SEMI' ? 'Semis' :
                 phase === 'THIRD_PLACE' ? '3º Lugar' : 'Final'}
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. MATCH GRID / LIST */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-6 no-scrollbar space-y-6 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-4 bg-primary rounded-full" />
             <span className="text-[12px] font-black text-white uppercase tracking-[0.16em]">
               {PHASE_LABELS[activePhase]}
             </span>
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
             <span className="text-[9px] font-black text-white/30 tracking-tighter uppercase whitespace-nowrap">
               {phaseMatches.filter(m => m.played).length} / {phaseMatches.length} Partidas
             </span>
          </div>
        </div>

        {phaseMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/3 rounded-[3rem] border border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
               <Globe className="w-8 h-8 text-white/10 animate-pulse" />
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-center px-12 leading-relaxed">
               Aguardando Definição<br/>da Rodada Anterior
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {phaseMatches.map(match => {
              const team1 = getTeam(match.team1Id);
              const team2 = getTeam(match.team2Id);
              const isUserMatch = match.team1Id === userTeamId || match.team2Id === userTeamId;
              const hasPenalties = match.penalties1 !== undefined && match.penalties2 !== undefined;

              return (
                <div
                  key={match.id}
                  className={clsx(
                    "relative overflow-hidden transition-all duration-700",
                    isUserMatch && "scale-[1.02] z-10"
                  )}
                >
                  <div className={clsx(
                    "bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-3xl rounded-[2.5rem] border p-1 shadow-2xl",
                    isUserMatch ? "border-primary/40 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)]" : "border-white/10 shadow-black/50"
                  )}>
                    {/* Visual Flare for user match */}
                    {isUserMatch && (
                       <div className="absolute top-0 right-0 p-5 overflow-hidden pointer-events-none opacity-20">
                          <Trophy size={80} className="text-primary -rotate-12 translate-x-10 -translate-y-10" />
                       </div>
                    )}

                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                           Confronto #{match.matchNumber}
                        </span>
                        {isUserMatch && (
                           <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] mt-0.5">Seu Desafio Mundial</span>
                        )}
                      </div>

                      {match.played ? (
                         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">CONCLUÍDO</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-black text-primary tracking-widest uppercase">EM ESPERA</span>
                         </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Team 1 */}
                      <div className={clsx(
                        "flex items-center justify-between p-4 rounded-3xl transition-all border",
                        match.played && match.winnerId === match.team1Id ? "bg-primary/10 border-primary/20" : "bg-white/3 border-white/5"
                      )}>
                        <div className="flex items-center gap-4">
                          {team1 ? (
                            <>
                              <TeamLogo team={team1} size="md" />
                              <span className={clsx("text-base font-black tracking-tighter",
                                match.team1Id === userTeamId ? "text-primary" : "text-white"
                              )}>{team1.name}</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-white/20">?</div>
                              <span className="text-xs font-black text-white/10 uppercase tracking-[0.2em] italic">A Definir</span>
                            </div>
                          )}
                        </div>
                        {match.played && (
                          <div className="flex items-center gap-3">
                            {hasPenalties && <span className="text-[10px] font-black text-primary bg-primary/15 px-2 py-1 rounded-lg">({match.penalties1})</span>}
                            <span className="text-2xl font-black text-white tabular-nums drop-shadow-lg">{match.score1}</span>
                          </div>
                        )}
                      </div>

                      {/* Team 2 */}
                      <div className={clsx(
                        "flex items-center justify-between p-4 rounded-3xl transition-all border",
                        match.played && match.winnerId === match.team2Id ? "bg-primary/10 border-primary/20" : "bg-white/3 border-white/5"
                      )}>
                        <div className="flex items-center gap-4">
                          {team2 ? (
                            <>
                              <TeamLogo team={team2} size="md" />
                              <span className={clsx("text-base font-black tracking-tighter",
                                match.team2Id === userTeamId ? "text-primary" : "text-white"
                              )}>{team2.name}</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-white/20">?</div>
                              <span className="text-xs font-black text-white/10 uppercase tracking-[0.2em] italic">A Definir</span>
                            </div>
                          )}
                        </div>
                        {match.played && (
                          <div className="flex items-center gap-3">
                            {hasPenalties && <span className="text-[10px] font-black text-primary bg-primary/15 px-2 py-1 rounded-lg">({match.penalties2})</span>}
                            <span className="text-2xl font-black text-white tabular-nums drop-shadow-lg">{match.score2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
