import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Shield, Trophy } from 'lucide-react';
import { Team, ContinentalSeasonState, ContinentalTournamentType } from '../types';
import { SOUTH_AMERICAN_FOREIGN_CLUBS } from '../southAmericaData';
import { CONTINENTAL_2026_EXTRA_CLUBS } from '../continental2026Data';
import { calculateContinentalGroupStandings } from '../engine/continentalEngine';
import TeamLogo from '../components/TeamLogo';

interface ContinentalScreenProps {
  continentalState: ContinentalSeasonState;
  teams: Team[];
  userTeamId: string | null;
  onBackToDashboard: () => void;
}

type ContinentalTab = 'GROUPS' | 'BRACKET' | 'PRIZES';

const TABS: Array<{ id: ContinentalTab; label: string }> = [
  { id: 'GROUPS', label: 'Grupos' },
  { id: 'BRACKET', label: 'Mata-mata' },
  { id: 'PRIZES', label: 'Premiação' },
];

const PHASE_LABELS = {
  GROUPS: 'Fase de grupos',
  PLAYOFF: 'Playoff para as oitavas',
  ROUND_OF_16: 'Oitavas de final',
  QUARTER: 'Quartas de final',
  SEMI: 'Semifinais',
  FINAL: 'Final',
  FINISHED: 'Campeão continental',
} as const;

export default function ContinentalScreen({
  continentalState,
  teams,
  userTeamId,
  onBackToDashboard,
}: ContinentalScreenProps) {
  const [selectedTournament, setSelectedTournament] = useState<ContinentalTournamentType>('LIBERTADORES');
  const [activeTab, setActiveTab] = useState<ContinentalTab>('GROUPS');

  const tournament = selectedTournament === 'LIBERTADORES'
    ? continentalState.libertadores
    : continentalState.sudamericana;
  const isLibertadores = selectedTournament === 'LIBERTADORES';
  const allKnownTeams = [...teams, ...SOUTH_AMERICAN_FOREIGN_CLUBS, ...CONTINENTAL_2026_EXTRA_CLUBS];
  const getTeam = (id: string | null) => {
    if (!id) return null;
    const exactMatch = allKnownTeams.find(team => team.id === id);
    if (exactMatch) return exactMatch;
    const baseId = id.replace(/-(lib|sud)-\d+$/, '');
    return allKnownTeams.find(team => team.id === baseId) || null;
  };

  const userQualification = continentalState.userQualification;
  const isUserInCurrent = userQualification?.tournament === selectedTournament && tournament.currentPhase !== 'FINISHED';
  const championTeam = getTeam(tournament.winnerId || null);

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-[#020617] text-white pt-safe">
      <div className="mx-auto min-h-0 w-full max-w-7xl flex-1 touch-pan-y overflow-y-auto overscroll-contain px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pt-6 no-scrollbar">
        <header className="border-b border-white/10 pb-5 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div className="flex items-start gap-3 lg:flex-1">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              aria-label="Voltar para o painel"
              title="Voltar para o painel"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400">
                <Trophy size={15} />
                CONMEBOL 2026
              </div>
              <h1 className="mt-1 text-2xl font-black leading-tight sm:text-4xl">{tournament.name}</h1>
              <p className="mt-1 text-sm text-slate-400">Grupos oficiais da temporada e campanha do seu clube.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-white/5 p-1 sm:ml-auto sm:max-w-md lg:mt-0 lg:w-full">
            <button
              type="button"
              onClick={() => setSelectedTournament('LIBERTADORES')}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-xs font-bold transition-colors ${
                isLibertadores ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Trophy size={16} />
              Libertadores
            </button>
            <button
              type="button"
              onClick={() => setSelectedTournament('SUDAMERICANA')}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-xs font-bold transition-colors ${
                !isLibertadores ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Shield size={16} />
              Sul-Americana
            </button>
          </div>
        </header>

        {isUserInCurrent && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <CheckCircle2 className="shrink-0 text-emerald-400" size={20} />
            <div className="min-w-0 text-sm">
              <strong className="text-emerald-300">Seu clube está nesta competição</strong>
              <p className="text-slate-300">Grupo {userQualification?.groupName}</p>
            </div>
          </div>
        )}

        <nav className="mt-6 grid grid-cols-3 border-b border-white/10" aria-label="Secoes da competicao">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-12 border-b-2 px-2 text-xs font-bold transition-colors sm:text-sm ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'GROUPS' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {tournament.groups.map(group => {
              const standings = calculateContinentalGroupStandings(group, tournament.groupFixtures);
              return (
                <section key={group.name} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white">Grupo {group.name}</h2>
                    <span className="text-xs font-semibold text-slate-500">{tournament.currentMatchday > 6 ? 'Finalizado' : `Rodada ${tournament.currentMatchday}/6`}</span>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_32px_32px_36px] border-b border-white/10 pb-2 text-[11px] font-semibold text-slate-500">
                    <span>Clube</span>
                    <span className="text-center">J</span>
                    <span className="text-center">SG</span>
                    <span className="text-right">Pts</span>
                  </div>

                  <div className="mt-1 divide-y divide-white/5">
                    {standings.map((standing, index) => {
                      const team = getTeam(standing.teamId);
                      const isUser = standing.teamId === userTeamId;
                      const isDirect = isLibertadores ? index < 2 : index === 0;
                      const isPlayoff = !isLibertadores && index === 1;

                      return (
                        <div
                          key={standing.teamId}
                          className={`grid min-h-12 grid-cols-[minmax(0,1fr)_32px_32px_36px] items-center rounded-md px-1 text-xs ${
                            isUser ? 'bg-emerald-500/15 text-emerald-200' : ''
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2 pr-2">
                            <span className={`w-3 shrink-0 text-center text-[11px] font-bold ${
                              isDirect ? 'text-emerald-400' : isPlayoff ? 'text-amber-400' : 'text-slate-600'
                            }`}>{index + 1}</span>
                            {team && <TeamLogo team={team} size="sm" className="h-7 w-7 shrink-0" />}
                            <span className="min-w-0 truncate font-semibold" title={team?.name || standing.teamId}>
                              {team?.name || standing.teamId}
                            </span>
                          </div>
                          <span className="text-center text-slate-300">{standing.played}</span>
                          <span className="text-center text-slate-300">{standing.gd > 0 ? `+${standing.gd}` : standing.gd}</span>
                          <span className="text-right font-black text-amber-300">{standing.points}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'BRACKET' && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            {tournament.currentPhase === 'FINISHED' && championTeam && (
              <div className="mb-6 flex items-center gap-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-5">
                <TeamLogo team={championTeam} size="lg" />
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase text-amber-300">Campeão continental</div>
                  <div className="mt-1 truncate text-xl font-black sm:text-2xl">{championTeam.name}</div>
                </div>
                <Trophy className="ml-auto shrink-0 text-amber-300" size={32} />
              </div>
            )}

            <div className="mb-5 max-w-2xl">
              <h2 className="text-xl font-black">{PHASE_LABELS[tournament.currentPhase]}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {tournament.currentPhase === 'PLAYOFF'
                  ? 'Os vice-líderes enfrentam os terceiros colocados da Libertadores em jogos de ida e volta.'
                  : tournament.currentPhase === 'FINAL' || tournament.currentPhase === 'FINISHED'
                    ? 'A decisão é disputada em partida única, com pênaltis em caso de empate.'
                    : 'Os confrontos são disputados em ida e volta. O placar agregado define quem avança.'}
              </p>
            </div>

            {tournament.bracket.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {tournament.bracket.map(match => {
                  const team1 = getTeam(match.team1Id);
                  const team2 = getTeam(match.team2Id);
                  const total1 = (match.score1Leg1 ?? 0) + (match.score1Leg2 ?? 0);
                  const total2 = (match.score2Leg1 ?? 0) + (match.score2Leg2 ?? 0);
                  const hasScore = match.playedLeg1;
                  return (
                    <article key={match.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                      <div className="mb-3 text-[11px] font-bold uppercase text-slate-500">Confronto {match.matchNumber}</div>
                      <div className="space-y-2 text-sm font-semibold">
                        <div className={`flex min-w-0 items-center gap-2 rounded-md p-1.5 ${match.winnerId === match.team1Id ? 'bg-emerald-500/10 text-emerald-200' : ''}`}>
                          {team1 && <TeamLogo team={team1} size="sm" />}
                          <span className="truncate">{team1?.name || 'A definir'}</span>
                          <span className="ml-auto font-black tabular-nums">{hasScore ? total1 : '-'}</span>
                        </div>
                        <div className={`flex min-w-0 items-center gap-2 rounded-md p-1.5 ${match.winnerId === match.team2Id ? 'bg-emerald-500/10 text-emerald-200' : ''}`}>
                          {team2 && <TeamLogo team={team2} size="sm" />}
                          <span className="truncate">{team2?.name || 'A definir'}</span>
                          <span className="ml-auto font-black tabular-nums">{hasScore ? total2 : '-'}</span>
                        </div>
                      </div>
                      {hasScore && (
                        <div className="mt-3 border-t border-white/10 pt-2 text-[11px] text-slate-500">
                          Ida {match.score1Leg1}-{match.score2Leg1}
                          {match.playedLeg2 && match.phase !== 'FINAL' && ` · Volta ${match.score1Leg2}-${match.score2Leg2}`}
                          {match.penalties1 !== undefined && ` · Pênaltis ${match.penalties1}-${match.penalties2}`}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.025] px-5 py-12 text-center">
                <Trophy className="mx-auto text-amber-400" size={36} />
                <p className="mt-3 text-sm font-semibold text-slate-200">Confrontos definidos após a sexta rodada</p>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'PRIZES' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Fase de grupos', 'US$ 3.000.000', 'Cota fixa de participação.'],
              ['Oitavas e quartas', 'US$ 1,25 mi a 1,7 mi', 'Bônus cumulativo por avanço.'],
              ['Campeão', 'US$ 23.000.000', 'Premiação máxima do título.'],
            ].map(([label, value, detail], index) => (
              <section key={label} className={`rounded-lg border bg-white/[0.045] p-5 ${index === 2 ? 'border-amber-400/30' : 'border-white/10'}`}>
                <div className="text-xs font-bold uppercase text-slate-400">{label}</div>
                <div className={`mt-2 text-2xl font-black ${index === 2 ? 'text-amber-300' : 'text-emerald-300'}`}>{value}</div>
                <p className="mt-1 text-sm text-slate-400">{detail}</p>
              </section>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
