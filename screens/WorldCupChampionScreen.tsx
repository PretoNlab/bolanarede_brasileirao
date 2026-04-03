
import React from 'react';
import { Team, WorldCupGameState, MatchResult } from '../types';
import { Trophy, Globe, Star, ArrowLeft } from 'lucide-react';
import { getTournamentStats } from '../engine/worldCupEngine';
import clsx from 'clsx';
import { TeamLogo } from '../components/TeamLogo';

interface Props {
  wcState: WorldCupGameState;
  onQuit: () => void;
}

export default function WorldCupChampionScreen({ wcState, onQuit }: Props) {
  const { bracket, teams, userTeamId, matchHistory } = wcState;

  // Encontrar o campeão (vencedor da final)
  const finalMatch = bracket.find(m => m.id === 'FINAL');
  const championId = finalMatch?.winnerId;
  const champion = championId ? teams.find(t => t.id === championId) : null;

  // Encontrar o vice (perdedor da final)
  const runnerUpId = finalMatch ? (finalMatch.team1Id === championId ? finalMatch.team2Id : finalMatch.team1Id) : null;
  const runnerUp = runnerUpId ? teams.find(t => t.id === runnerUpId) : null;

  // Terceiro lugar
  const thirdMatch = bracket.find(m => m.id === 'THIRD');
  const thirdPlaceId = thirdMatch?.winnerId;
  const thirdPlace = thirdPlaceId ? teams.find(t => t.id === thirdPlaceId) : null;

  const isUserChampion = championId === userTeamId;
  const { topScorers, topAssisters } = getTournamentStats(matchHistory);
  const topScorer = topScorers[0];
  const topAssister = topAssisters[0];

  // Caminho do usuário no torneio
  const userMatches = matchHistory.filter(m => m.isUserMatch);

  return (
    <div className={clsx(
      "flex flex-col h-screen text-white font-sans overflow-y-auto no-scrollbar",
      isUserChampion
        ? "bg-gradient-to-b from-yellow-900/30 via-background to-background"
        : "bg-gradient-to-b from-blue-900/30 via-background to-background"
    )}>
      <div className="px-5 pt-16 pb-8 flex flex-col items-center">
        {/* Trophy */}
        <div className={clsx(
          "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 border border-white/10",
          isUserChampion
            ? "bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-yellow-400/30 animate-bounce"
            : "bg-gradient-to-tr from-blue-500 to-blue-700 shadow-blue-500/30"
        )}>
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <span className="text-[10px] font-black tracking-[0.3em] text-yellow-400 uppercase mb-2">Copa do Mundo 2026</span>
        <h1 className="text-4xl font-black text-center leading-none mb-2">
          {isUserChampion ? 'VOCÊ É O' : ''}
        </h1>
        <h1 className={clsx(
          "text-4xl font-black text-center leading-none mb-2",
          isUserChampion ? "text-yellow-400" : "text-white"
        )}>
          {isUserChampion ? 'CAMPEÃO DO MUNDO!' : 'Copa Encerrada'}
        </h1>

        {/* Champion Display */}
        {champion && (
          <div className="bg-surface rounded-[2rem] border border-yellow-400/20 p-6 w-full max-w-sm mt-6">
            <div className="flex items-center gap-4 mb-4">
              <TeamLogo team={champion} size="lg" />
              <div>
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-wider">Campeão</span>
                <h2 className="text-2xl font-black text-white">{champion.name}</h2>
              </div>
            </div>

            {finalMatch && (
              <div className="bg-white/5 rounded-xl p-3 mb-4">
                <span className="text-[9px] font-black text-secondary uppercase tracking-wider block mb-2">Final</span>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-sm font-bold text-white">{teams.find(t => t.id === finalMatch.team1Id)?.shortName}</span>
                  <span className="text-xl font-black text-yellow-400">
                    {finalMatch.score1} - {finalMatch.score2}
                    {finalMatch.penalties1 !== undefined && (
                      <span className="text-sm text-secondary"> ({finalMatch.penalties1}-{finalMatch.penalties2})</span>
                    )}
                  </span>
                  <span className="text-sm font-bold text-white">{teams.find(t => t.id === finalMatch.team2Id)?.shortName}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pódio */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-6">
          {/* Vice */}
          {runnerUp && (
            <div className="bg-surface rounded-2xl border border-white/5 p-4 text-center">
              <span className="text-[9px] font-black text-secondary uppercase block mb-2">2º Lugar</span>
              <TeamLogo team={runnerUp} size="sm" className="mx-auto mb-2" />
              <span className="text-xs font-bold text-white">{runnerUp.shortName}</span>
            </div>
          )}

          {/* Campeão */}
          {champion && (
            <div className="bg-surface rounded-2xl border border-yellow-400/30 p-4 text-center -mt-4">
              <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <span className="text-[9px] font-black text-yellow-400 uppercase block mb-2">Campeão</span>
              <TeamLogo team={champion} size="md" className="mx-auto mb-2 !rounded-xl border-yellow-400/30" />
              <span className="text-sm font-black text-yellow-400">{champion.shortName}</span>
            </div>
          )}

          {/* 3º Lugar */}
          {thirdPlace && (
            <div className="bg-surface rounded-2xl border border-white/5 p-4 text-center">
              <span className="text-[9px] font-black text-secondary uppercase block mb-2">3º Lugar</span>
              <TeamLogo team={thirdPlace} size="sm" className="mx-auto mb-2" />
              <span className="text-xs font-bold text-white">{thirdPlace.shortName}</span>
            </div>
          )}
        </div>

        {/* Artilheiro e Assistente */}
        {(topScorer || topAssister) && (
          <div className="grid grid-cols-1 gap-3 w-full max-w-sm mt-6">
            {topScorer && (
              <div className="bg-surface rounded-2xl border border-white/5 p-4">
                <span className="text-[9px] font-black text-secondary uppercase tracking-wider block mb-2">Artilheiro</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">⚽</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-white block">{topScorer.name}</span>
                      <span className="text-[10px] text-secondary uppercase">{topScorer.teamShort}</span>
                    </div>
                  </div>
                  <span className="text-xl font-black text-yellow-400">{topScorer.value} gols</span>
                </div>
              </div>
            )}
            
            {topAssister && (
              <div className="bg-surface rounded-2xl border border-white/5 p-4">
                <span className="text-[9px] font-black text-secondary uppercase tracking-wider block mb-2">Líder de Assistências</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-400/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">👟</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-white block">{topAssister.name}</span>
                      <span className="text-[10px] text-secondary uppercase">{topAssister.teamShort}</span>
                    </div>
                  </div>
                  <span className="text-xl font-black text-blue-400">{topAssister.value} assists</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Campanha do Usuário */}
        {userMatches.length > 0 && (
          <div className="bg-surface rounded-2xl border border-white/5 p-4 w-full max-w-sm mt-6">
            <span className="text-[9px] font-black text-secondary uppercase tracking-wider block mb-3">Sua Campanha</span>
            <div className="space-y-2">
              {userMatches.map((match, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 px-3 bg-white/3 rounded-xl">
                  <span className="text-xs font-bold text-white flex-1 text-right truncate">{match.homeTeamName}</span>
                  <span className="text-sm font-black text-white px-3">{match.homeScore} - {match.awayScore}</span>
                  <span className="text-xs font-bold text-white flex-1 truncate">{match.awayTeamName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Voltar */}
        <button
          onClick={onQuit}
          className="mt-8 w-full max-w-sm py-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-yellow-400/25 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Globe className="w-5 h-5" />
          VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
}
