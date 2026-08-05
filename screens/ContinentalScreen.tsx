import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { Team, ContinentalSeasonState, ContinentalTournamentType } from '../types';
import { SOUTH_AMERICAN_FOREIGN_CLUBS } from '../southAmericaData';
import { calculateContinentalGroupStandings } from '../engine/continentalEngine';

interface ContinentalScreenProps {
  continentalState: ContinentalSeasonState;
  teams: Team[];
  userTeamId: string | null;
  onBackToDashboard: () => void;
}

export default function ContinentalScreen({
  continentalState,
  teams,
  userTeamId,
  onBackToDashboard
}: ContinentalScreenProps) {
  const [selectedTournament, setSelectedTournament] = useState<ContinentalTournamentType>('LIBERTADORES');
  const [activeTab, setActiveTab] = useState<'GROUPS' | 'BRACKET' | 'PRIZES'>('GROUPS');

  const tournament = selectedTournament === 'LIBERTADORES' 
    ? continentalState.libertadores 
    : continentalState.sudamericana;

  const allKnownTeams = [...teams, ...SOUTH_AMERICAN_FOREIGN_CLUBS];
  const getTeam = (id: string) => {
    const exactMatch = allKnownTeams.find(t => t.id === id);
    if (exactMatch) return exactMatch;

    const baseId = id.replace(/-(lib|sud)-\d+$/, '');
    return allKnownTeams.find(t => t.id === baseId) || { name: 'Time Desconhecido', shortName: 'TIM' };
  };

  const userQual = continentalState.userQualification;
  const isUserInCurrent = userQual?.tournament === selectedTournament;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#020617] text-white p-4 pb-24 md:p-8 pt-safe">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Trophy className="w-4 h-4" /> Torneios Continentais CONMEBOL
          </div>
          <h1 className="text-2xl md:text-4xl font-black italic tracking-tight mt-1">
            {tournament.name}
          </h1>
        </div>

        {/* Tournament Switcher */}
        <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setSelectedTournament('LIBERTADORES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTournament === 'LIBERTADORES'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏆 Copa Libertadores
          </button>
          <button
            onClick={() => setSelectedTournament('SUDAMERICANA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTournament === 'SUDAMERICANA'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🛡️ Copa Sul-Americana
          </button>
        </div>
      </div>

      {/* Qualification Badge */}
      {isUserInCurrent && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-emerald-400">Seu clube está nesta competição!</span>
            <p className="text-gray-300">Classificado para o Grupo {userQual?.groupName}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('GROUPS')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'GROUPS' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Fase de Grupos
        </button>
        <button
          onClick={() => setActiveTab('BRACKET')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'BRACKET' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Mata-Mata (Bracket)
        </button>
        <button
          onClick={() => setActiveTab('PRIZES')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'PRIZES' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Premiações
        </button>
      </div>

      {/* Tab 1: Groups */}
      {activeTab === 'GROUPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tournament.groups.map(group => {
            const standings = calculateContinentalGroupStandings(group, tournament.groupFixtures);
            return (
              <div key={group.name} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                <div className="text-xs font-black uppercase text-amber-400 tracking-wider mb-3">
                  Grupo {group.name}
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-6 text-[10px] font-bold text-gray-400 border-b border-white/10 pb-1">
                    <span className="col-span-3">Clube</span>
                    <span className="text-center">J</span>
                    <span className="text-center">SG</span>
                    <span className="text-right">Pts</span>
                  </div>
                  {standings.map((st, idx) => {
                    const tm = getTeam(st.teamId);
                    const isUser = st.teamId === userTeamId;
                    return (
                      <div
                        key={st.teamId}
                        className={`grid grid-cols-6 text-xs p-1.5 rounded-xl items-center ${
                          isUser ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold' : idx < 2 ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className="col-span-3 truncate flex items-center gap-1.5">
                          <span className={`text-[10px] w-4 text-center ${idx < 2 ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                            {idx + 1}
                          </span>
                          <span className="truncate">{tm.name}</span>
                        </div>
                        <span className="text-center text-gray-300">{st.played}</span>
                        <span className="text-center text-gray-300">{st.gd > 0 ? `+${st.gd}` : st.gd}</span>
                        <span className="text-right font-black text-amber-400">{st.points}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Bracket */}
      {activeTab === 'BRACKET' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl text-center">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-pulse" />
          <h2 className="text-lg font-bold">Fase Mata-Mata (Oitavas de Final até a Decisão)</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Os 2 melhores colocados de cada grupo avançam para o chaveamento em jogos de ida e volta, culminando na grande Final Única!
          </p>
          <div className="mt-6 p-4 rounded-xl bg-white/5 text-xs text-emerald-400 font-mono">
            Chaveamento sendo gerado após a conclusão da 6ª Rodada da Fase de Grupos.
          </div>
        </div>
      )}

      {/* Tab 3: Prizes */}
      {activeTab === 'PRIZES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-xs text-gray-400 font-bold uppercase">Fase de Grupos</div>
            <div className="text-xl font-black text-emerald-400 mt-1">$ 3.000.000</div>
            <p className="text-[11px] text-gray-400 mt-1">Cota fixa para todos os participantes.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-xs text-gray-400 font-bold uppercase">Oitavas & Quartas</div>
            <div className="text-xl font-black text-emerald-400 mt-1">+ $ 1.250.000 a $ 1.700.000</div>
            <p className="text-[11px] text-gray-400 mt-1">Bônus cumulativo por avanço de fase.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 border-amber-500/30">
            <div className="text-xs text-amber-400 font-bold uppercase">Grande Campeão</div>
            <div className="text-xl font-black text-amber-400 mt-1">$ 23.000.000</div>
            <p className="text-[11px] text-gray-400 mt-1">Premiação máxima para o vencedor do título continental.</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition-all"
        >
          Voltar para o Dashboard
        </button>
      </div>
    </div>
  );
}
