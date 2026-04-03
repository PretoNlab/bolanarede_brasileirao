
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

  const renderMatch = (match: WCBracketMatch) => {
    const team1 = getTeam(match.team1Id);
    const team2 = getTeam(match.team2Id);
    const isUserMatch = match.team1Id === userTeamId || match.team2Id === userTeamId;
    const hasPenalties = match.penalties1 !== undefined && match.penalties2 !== undefined;

    return (
      <div
        key={match.id}
        className={clsx(
          "bg-surface rounded-2xl border overflow-hidden",
          isUserMatch ? "border-yellow-400/30" : "border-white/5"
        )}
      >
        {/* Match Header */}
        <div className={clsx(
          "px-4 py-2 flex items-center justify-between",
          match.played ? "bg-white/5" : isUserMatch ? "bg-yellow-400/10" : "bg-white/3"
        )}>
          <span className="text-[9px] font-black uppercase tracking-wider text-secondary">
            Jogo {match.matchNumber}
          </span>
          {match.played && (
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Encerrado</span>
          )}
          {!match.played && match.team1Id && match.team2Id && (
            <span className="text-[9px] font-black uppercase tracking-wider text-yellow-400">A jogar</span>
          )}
          {!match.played && (!match.team1Id || !match.team2Id) && (
            <span className="text-[9px] font-black uppercase tracking-wider text-secondary">Aguardando</span>
          )}
        </div>

        {/* Teams */}
        <div className="px-4 py-3 space-y-2">
          {/* Team 1 */}
          <div className={clsx(
            "flex items-center justify-between py-2 px-3 rounded-xl",
            match.played && match.winnerId === match.team1Id ? "bg-emerald-500/10" : "bg-white/3"
          )}>
            <div className="flex items-center gap-3">
              {team1 ? (
                <>
                  <TeamLogo team={team1} size="sm" />
                  <span className={clsx("text-sm font-bold",
                    match.team1Id === userTeamId ? "text-yellow-400" : "text-white"
                  )}>{team1.name}</span>
                </>
              ) : (
                <span className="text-sm text-secondary italic">A definir</span>
              )}
            </div>
            {match.played && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{match.score1}</span>
                {hasPenalties && <span className="text-[10px] text-secondary">({match.penalties1})</span>}
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <span className="text-[10px] font-black text-secondary">VS</span>
          </div>

          {/* Team 2 */}
          <div className={clsx(
            "flex items-center justify-between py-2 px-3 rounded-xl",
            match.played && match.winnerId === match.team2Id ? "bg-emerald-500/10" : "bg-white/3"
          )}>
            <div className="flex items-center gap-3">
              {team2 ? (
                <>
                  <TeamLogo team={team2} size="sm" />
                  <span className={clsx("text-sm font-bold",
                    match.team2Id === userTeamId ? "text-yellow-400" : "text-white"
                  )}>{team2.name}</span>
                </>
              ) : (
                <span className="text-sm text-secondary italic">A definir</span>
              )}
            </div>
            {match.played && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{match.score2}</span>
                {hasPenalties && <span className="text-[10px] text-secondary">({match.penalties2})</span>}
              </div>
            )}
          </div>
        </div>

        {/* Winner badge */}
        {match.played && match.winnerId && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
              <Trophy className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase">
                Classificado: {getTeam(match.winnerId)?.name}
                {hasPenalties && ' (nos pênaltis)'}
              </span>
            </div>
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
            <span className="text-xs font-medium text-secondary tracking-widest uppercase opacity-70">Mata-Mata</span>
          </div>
          <Globe className="w-6 h-6 text-yellow-400" />
        </div>

        <h1 className="text-3xl font-black mb-4 leading-none">
          Chave<span className="text-yellow-400">.</span>
        </h1>

        {/* Phase Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {PHASE_ORDER.map(phase => {
            const matches = bracket.filter(m => m.phase === phase);
            const hasMatches = matches.length > 0;
            const allPlayed = matches.every(m => m.played);

            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={clsx(
                  "px-4 py-2 rounded-full text-[9px] font-black tracking-wider uppercase whitespace-nowrap transition-all",
                  activePhase === phase
                    ? "bg-yellow-400 text-black shadow-lg"
                    : allPlayed && hasMatches
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : "bg-surface border border-white/5 text-secondary"
                )}
              >
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

      {/* MATCHES */}
      <main className="flex-1 overflow-y-auto px-5 pb-8 no-scrollbar space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-secondary uppercase tracking-wider">
            {PHASE_LABELS[activePhase]}
          </span>
          <span className="text-[10px] text-secondary">
            {phaseMatches.filter(m => m.played).length}/{phaseMatches.length} jogos
          </span>
        </div>

        {phaseMatches.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-secondary mx-auto mb-4 opacity-30" />
            <p className="text-secondary text-sm">Nenhum jogo nesta fase ainda</p>
          </div>
        ) : (
          phaseMatches.map(renderMatch)
        )}
      </main>
    </div>
  );
}
