import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Check, Zap, ArrowRight } from 'lucide-react';
import { Team } from '../types';
import clsx from 'clsx';

interface Props {
  teams: Team[];
  onSelect: (teamId: string) => void;
  onBack: () => void;
}

const TeamLogo = ({ team, size = "w-12 h-12" }: { team: Team, size?: string }) => {
  return (
    <div className={`${size} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} shadow-lg`}>
      <span className="text-white font-black text-lg tracking-wider drop-shadow-md">{team.shortName}</span>
    </div>
  );
};

export default function TeamSelectionScreen({ teams, onSelect, onBack }: Props) {
  const [activeDiv, setActiveDiv] = useState<1 | 2>(1);
  const [selectedId, setSelectedId] = useState<string>(teams.find(t => t.division === 1)?.id || teams[0].id);

  const selectedTeam = teams.find(t => t.id === selectedId);
  const filteredTeams = teams.filter(t => t.division === activeDiv);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold italic tracking-tighter">Bolanarede</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 scroll-smooth no-scrollbar">
        <div className="py-2">
          <p className="text-primary text-[10px] font-black tracking-widest uppercase mb-1">Temporada 2026</p>
          <h1 className="text-3xl font-black text-white mb-2 leading-tight">Clubes da Bahia</h1>

          <div className="flex bg-surface p-1 rounded-2xl border border-white/5 mb-6">
            <button
              onClick={() => { setActiveDiv(1); setSelectedId(teams.find(t => t.division === 1)?.id || ''); }}
              className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all", activeDiv === 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-secondary")}
            >
              SÉRIE A
            </button>
            <button
              onClick={() => { setActiveDiv(2); setSelectedId(teams.find(t => t.division === 2)?.id || ''); }}
              className={clsx("flex-1 py-3 rounded-xl text-xs font-black transition-all", activeDiv === 2 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-secondary")}
            >
              SÉRIE B
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {filteredTeams.map((team) => {
              const isSelected = selectedId === team.id;
              const overall = Math.round((team.attack + team.defense) / 2);

              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedId(team.id)}
                  className={clsx(
                    "relative flex flex-col gap-3 rounded-2xl p-4 cursor-pointer transition-all duration-300",
                    isSelected
                      ? "bg-surface border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                      : "bg-surface border border-transparent hover:bg-surface/80"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <TeamLogo team={team} size="w-14 h-14" />

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
                        <div className={clsx("flex items-center gap-1 px-2 py-0.5 rounded-md", isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-secondary")}>
                          <Zap className="w-3 h-3" />
                          <span className="text-xs font-bold">{overall}</span>
                        </div>
                      </div>
                      <p className="text-secondary text-xs font-medium">{team.city}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-20 bg-gradient-to-t from-background via-background to-transparent pt-12 pb-6 px-4">
        <button
          onClick={() => onSelect(selectedId)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 px-6 text-white shadow-xl shadow-primary/25 transition-transform active:scale-[0.98] hover:bg-primary/90"
        >
          <span className="text-base font-black uppercase tracking-widest">Treinar o {selectedTeam?.name}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}