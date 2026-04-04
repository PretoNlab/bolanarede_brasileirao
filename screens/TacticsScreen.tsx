
import React, { useState, useMemo } from 'react';
import { Team, Player, FormationType, PlayingStyle, DetailedPosition, TacticalInstructions } from '../types';
import { Save, Shield, Compass, Target, Info, AlertCircle, Zap, Activity, ChevronRight } from 'lucide-react';
import { FORMATIONS_SLOTS, calculatePlayerFitForPosition, generateTacticalFeedback } from '../engine/tacticsEngine';
import PlayerSelectorDrawer from '../components/PlayerSelectorDrawer';
import { Header } from '../components/Header';
import clsx from 'clsx';

interface Props {
  team: Team;
  onBack: () => void;
  onSave: (formation: FormationType, style: PlayingStyle, lineup: string[], instructions: TacticalInstructions) => void;
}

const STYLES: PlayingStyle[] = ['Ultra-Defensivo', 'Defensivo', 'Equilibrado', 'Ofensivo', 'Tudo-ou-Nada'];
const FORMATIONS: FormationType[] = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '4-5-1', '5-3-2', '5-4-1', '3-4-3', '4-1-4-1', '4-1-2-1-2', '4-2-4'];

export default function TacticsScreen({ team, onBack, onSave }: Props) {
  const [tempFormation, setTempFormation] = useState<FormationType>(team.formation);
  const [tempStyle, setTempStyle] = useState<PlayingStyle>(team.style);
  const [tempInstructions, setTempInstructions] = useState<TacticalInstructions>(
    team.instructions || { pressing: 'MEDIA', passing: 'MISTO', tempo: 'PADRAO' }
  );
  
  const [tempLineup, setTempLineup] = useState<string[]>(() => {
    const base = [...team.lineup];
    while (base.length < 11) base.push('');
    return base.slice(0, 11);
  });

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const currentSlots = useMemo(() => FORMATIONS_SLOTS[tempFormation], [tempFormation]);

  const handlePlayerSelect = (playerId: string) => {
    if (selectedSlotIndex === null) return;
    setTempLineup(prev => {
      const newLineup = [...prev];
      const existingIndex = newLineup.findIndex(id => id === playerId);
      if (existingIndex !== -1) newLineup[existingIndex] = newLineup[selectedSlotIndex];
      newLineup[selectedSlotIndex] = playerId;
      return newLineup;
    });
    setSelectedSlotIndex(null);
  };

  const getPlayerById = (id: string) => team.roster.find(p => p.id === id);

  const powers = useMemo(() => {
    const starters = tempLineup.map(id => getPlayerById(id)).filter(Boolean) as Player[];
    if (starters.length === 0) return { def: 0, mid: 0, att: 0 };
    const def = starters.filter(p => ['GK', 'CB', 'RB', 'LB'].includes(p.mainPosition));
    const mid = starters.filter(p => ['DM', 'CM', 'AM'].includes(p.mainPosition));
    const att = starters.filter(p => ['RW', 'LW', 'ST'].includes(p.mainPosition));
    const avg = (list: Player[]) => list.length ? Math.round(list.reduce((s, p) => s + p.overall, 0) / list.length) : 0;
    return {
      def: avg(def) || team.defense,
      mid: avg(mid) || Math.round((team.attack + team.defense) / 2),
      att: avg(att) || team.attack
    };
  }, [tempLineup, team]);

  const isComplete = tempLineup.filter(Boolean).length === 11;

  const tacticalAnalysis = useMemo(() => 
    generateTacticalFeedback({ 
      ...team, 
      lineup: tempLineup, 
      formation: tempFormation, 
      style: tempStyle,
      instructions: tempInstructions 
    }), 
    [tempLineup, tempFormation, tempStyle, tempInstructions, team]
  );

  const powerCards = [
    { label: 'Defesa', value: powers.def, icon: <Shield size={14} />, color: 'text-blue-400' },
    { label: 'Meio', value: powers.mid, icon: <Compass size={14} />, color: 'text-amber-400' },
    { label: 'Ataque', value: powers.att, icon: <Target size={14} />, color: 'text-rose-400' }
  ];

  const instructionsConfig = [
    { key: 'pressing', label: 'Pressão', options: ['BAIXA', 'MEDIA', 'ALTA'] },
    { key: 'passing', label: 'Passagem', options: ['CURTO', 'MISTO', 'LONGO'] },
    { key: 'tempo', label: 'Ritmo', options: ['LENTO', 'PADRAO', 'VELOZ'] }
  ] as const;

  const renderControlPanel = (panelClassName: string) => (
    <div className={panelClassName}>
      <div className="grid grid-cols-3 gap-3">
        {powerCards.map(p => (
          <div key={p.label} className="ui-card-premium p-4 flex flex-col items-center gap-1 border-white/5 bg-white/5">
            <div className={clsx("p-2 rounded-xl bg-white/5 mb-1", p.color)}>{p.icon}</div>
            <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">{p.label}</span>
            <span className="text-xl font-black italic">{p.value}</span>
          </div>
        ))}
      </div>

      <div className="ui-card-premium p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Esquema Tático</label>
            <select 
              value={tempFormation}
              onChange={(e) => setTempFormation(e.target.value as FormationType)}
              className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-[11px] font-black text-center uppercase outline-none focus:border-primary transition-all appearance-none"
            >
              {FORMATIONS.map(f => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Mentalidade</label>
            <select 
              value={tempStyle}
              onChange={(e) => setTempStyle(e.target.value as PlayingStyle)}
              className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-[11px] font-black text-center uppercase outline-none focus:border-primary transition-all appearance-none"
            >
              {STYLES.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="ui-card-premium p-6 border-emerald-500/10 bg-emerald-500/[0.02]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-widest leading-none">Feedback Tático</h3>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Análise Assistida</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-5">
          {tacticalAnalysis.strengths.slice(0, 2).map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-emerald-400">
              <Zap size={12} className="shrink-0" />
              <span>{s}</span>
            </div>
          ))}
          {tacticalAnalysis.weaknesses.slice(0, 2).map((w, i) => (
            <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-rose-400">
              <AlertCircle size={12} className="shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-white/40 font-medium leading-relaxed italic border-t border-white/5 pt-4">
          "{tacticalAnalysis.summary}"
        </p>
      </div>

      <div className="ui-card-premium p-6 space-y-6">
        {instructionsConfig.map((instr) => (
          <div key={instr.key} className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{instr.label}</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{(tempInstructions as any)[instr.key]}</span>
            </div>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {instr.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setTempInstructions(prev => ({ ...prev, [instr.key]: opt }))}
                  className={clsx(
                    "flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all",
                    (tempInstructions as any)[instr.key] === opt ? "bg-primary text-white shadow-lg" : "text-white/30 hover:text-white/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isComplete && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-[2rem] flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-600/20">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-rose-400">Escalação Incompleta</span>
            <p className="text-[12px] font-bold text-rose-200/50 leading-relaxed mt-0.5">Seu time precisa de 11 jogadores titulares.</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-white/90 selection:bg-primary/30 overflow-hidden">
      <Header 
        title="Tática & Estratégia" 
        subtitle={team.name}
        onBack={onBack}
        rightAction={
          <button 
            onClick={() => onSave(tempFormation, tempStyle, tempLineup, tempInstructions)}
            className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 border shadow-lg",
                isComplete ? "bg-emerald-600 border-emerald-500/50 text-white shadow-emerald-600/20" : "bg-white/5 border-white/5 text-white/20 opacity-50 cursor-not-allowed"
            )}
            disabled={!isComplete}
          >
            <Save size={20} />
          </button>
        }
      />

      <main className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Lado Esquerdo: Campo (Pitch) */}
        <div className="relative flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,rgba(31,177,133,0.05),transparent_70%)] md:flex-1 md:min-h-0">
           <div className="relative aspect-[3/4] w-full max-w-[480px] select-none">
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-[#020617]">
                 <div className="absolute inset-0 bg-gradient-to-b from-[#1e5231]/10 to-[#123620]/20" />
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 20%)' }} />
                 <div className="absolute inset-0 border-[1.5px] border-white/5 rounded-[3rem] m-3" />
                 <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-[1px] border-white/5 rounded-full" />
                 <div className="absolute top-6 left-1/2 -translate-x-1/2 w-64 h-24 border-[1px] border-white/5 border-t-0 rounded-b-2xl" />
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 h-24 border-[1px] border-white/5 border-b-0 rounded-t-2xl" />
              </div>

              {currentSlots.map((slot, index) => {
                const playerId = tempLineup[index];
                const player = getPlayerById(playerId);
                const fit = player ? calculatePlayerFitForPosition(player, slot.position) : null;
                
                return (
                  <div 
                    key={slot.id}
                    onClick={() => setSelectedSlotIndex(index)}
                    style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
                    className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div className={clsx(
                      "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-2xl group-active:scale-90",
                      !player ? "bg-white/5 border-dashed border-white/10" : 
                      fit?.level === 'PRIMARY' ? "bg-emerald-500 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110" :
                      fit?.level === 'SECONDARY' ? "bg-amber-500 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]" :
                      "bg-rose-600 border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                    )}>
                      {player ? (
                        <div className="flex flex-col items-center">
                            <span className="text-white font-black text-sm drop-shadow-md leading-none">
                              {Math.round(player.overall * (fit?.multiplier || 1))}
                            </span>
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                      )}
                    </div>

                    <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 max-w-[90px] shadow-lg">
                        <p className={clsx(
                            "text-[8px] font-black uppercase text-center truncate tracking-[0.14em]",
                            player ? "text-white" : "text-white/40"
                        )}>
                            {player ? player.name.split(' ').pop() : slot.label}
                        </p>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {renderControlPanel(
          "hidden md:flex md:w-[420px] bg-white/[0.02] border-l border-white/5 backdrop-blur-3xl overflow-y-auto no-scrollbar pb-safe flex-col gap-6 p-6"
        )}
      </main>

      {renderControlPanel(
        "md:hidden border-t border-white/5 bg-[#020617]/95 backdrop-blur-3xl px-4 pt-4 pb-safe max-h-[42vh] overflow-y-auto no-scrollbar flex flex-col gap-4"
      )}

      {selectedSlotIndex !== null && (
        <PlayerSelectorDrawer
          players={team.roster}
          targetPosition={currentSlots[selectedSlotIndex].position}
          currentLineup={tempLineup}
          onSelect={handlePlayerSelect}
          onClose={() => setSelectedSlotIndex(null)}
        />
      )}
    </div>
  );
}

