import React, { useState, useMemo } from 'react';
import { Team, Player, FormationType, PlayingStyle, DetailedPosition, TacticalInstructions } from '../types';
import { ArrowLeft, Save, Shield, Compass, Target, Info, AlertCircle, Zap, Activity } from 'lucide-react';
import { FORMATIONS_SLOTS, calculatePlayerFitForPosition, generateTacticalFeedback } from '../engine/tacticsEngine';
import PlayerSelectorDrawer from '../components/PlayerSelectorDrawer';
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
  
  // Ensure lineup has exactly 11 slots
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
      
      // Check if player is already in another slot, if so, swap them
      const existingIndex = newLineup.findIndex(id => id === playerId);
      if (existingIndex !== -1) {
        newLineup[existingIndex] = newLineup[selectedSlotIndex];
      }
      
      newLineup[selectedSlotIndex] = playerId;
      return newLineup;
    });
    
    setSelectedSlotIndex(null);
  };

  const getPlayerById = (id: string) => team.roster.find(p => p.id === id);

  const calculateTeamPower = () => {
    const starters = tempLineup.map(id => getPlayerById(id)).filter(Boolean) as Player[];
    if (starters.length === 0) return { def: 0, mid: 0, att: 0 };

    // Simple grouping for power display
    const def = starters.filter(p => ['GK', 'CB', 'RB', 'LB'].includes(p.mainPosition));
    const mid = starters.filter(p => ['DM', 'CM', 'AM'].includes(p.mainPosition));
    const att = starters.filter(p => ['RW', 'LW', 'ST'].includes(p.mainPosition));

    const avg = (list: Player[]) => list.length ? Math.round(list.reduce((s, p) => s + p.overall, 0) / list.length) : 0;

    return {
      def: avg(def) || team.defense,
      mid: avg(mid) || Math.round((team.attack + team.defense) / 2),
      att: avg(att) || team.attack
    };
  };

  const powers = calculateTeamPower();
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

  return (
    <div className="flex flex-col h-screen bg-background text-white overflow-hidden font-sans">
      {/* Header Premium */}
      <header className="flex items-center justify-between p-6 pt-safe border-b border-white/5 bg-surface/40 backdrop-blur-xl z-50">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center active:scale-95 transition-all border border-white/5">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-sm font-black italic tracking-tighter uppercase text-white/90">Estratégia e Campo</h1>
            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{team.name}</span>
        </div>
        <button 
          onClick={() => onSave(tempFormation, tempStyle, tempLineup, tempInstructions)}
          className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center active:scale-95 transition-all border border-primary/20 shadow-lg shadow-primary/10"
        >
          <Save size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Campo de Jogo (Pitch) */}
        <div className="relative aspect-[3/4] w-full max-w-lg mx-auto p-4 select-none">
          {/* Pitch Background */}
          <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
             {/* Grass Pattern */}
             <div className="absolute inset-0 bg-[#1a472a] bg-gradient-to-b from-[#1e5231] to-[#123620]" />
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 20%)' }} />
             
             {/* Pitch Lines */}
             <div className="absolute inset-0 border-[1.5px] border-white/20 rounded-3xl m-2" />
             <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/20" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-[1.5px] border-white/20 rounded-full" />
             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-20 border-[1.5px] border-white/20 border-t-0 rounded-b-xl" />
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-20 border-[1.5px] border-white/20 border-b-0 rounded-t-xl" />
          </div>

          {/* Player Slots */}
          {currentSlots.map((slot, index) => {
            const playerId = tempLineup[index];
            const player = getPlayerById(playerId);
            const fit = player ? calculatePlayerFitForPosition(player, slot.position) : null;
            
            return (
              <div 
                key={slot.id}
                onClick={() => setSelectedSlotIndex(index)}
                style={{ 
                  left: `${slot.x}%`, 
                  top: `${slot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                {/* Visual Marker */}
                <div className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-xl group-active:scale-90",
                  !player ? "bg-black/40 border-dashed border-white/20" : 
                  fit?.level === 'PRIMARY' ? "bg-emerald-500 border-emerald-300 shadow-emerald-500/20" :
                  fit?.level === 'SECONDARY' ? "bg-amber-500 border-amber-300 shadow-amber-500/20" :
                  "bg-rose-500 border-rose-300 shadow-rose-500/20"
                )}>
                  {player ? (
                    <span className="text-white font-black text-xs drop-shadow-md">
                      {Math.round(player.overall * (fit?.multiplier || 1))}
                    </span>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                  )}
                </div>

                {/* Sub-label (Position or Name) */}
                <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 max-w-[80px] overflow-hidden">
                    <p className="text-[9px] font-black uppercase text-center text-white/90 truncate tracking-[0.12em]">
                        {player ? player.name.split(' ').pop() : slot.label}
                    </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tactical Controls & Info */}
        <div className="w-96 border-l border-white/5 bg-surface/30 backdrop-blur-xl p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar">
            
            {/* Tactical Analysis Card */}
            <div className="bg-white/5 rounded-[32px] border border-white/5 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-secondary" />
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Análise do Treinador</h3>
              </div>
              
              {tacticalAnalysis.strengths.length > 0 && (
                <div className="space-y-2">
                  {tacticalAnalysis.strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                      <Zap size={12} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {tacticalAnalysis.weaknesses.length > 0 && (
                <div className="space-y-2">
                  {tacticalAnalysis.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-rose-400">
                      <AlertCircle size={12} />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[12px] text-white/58 font-medium leading-6 italic border-t border-white/5 pt-3">
                "{tacticalAnalysis.summary}"
              </p>
            </div>

            {/* Formation Selection */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface/60 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1">
                    <Shield size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.12em]">Defesa</span>
                    <span className="text-lg font-black">{powers.def}</span>
                </div>
                <div className="bg-surface/60 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1">
                    <Compass size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.12em]">Meio</span>
                    <span className="text-lg font-black">{powers.mid}</span>
                </div>
                <div className="bg-surface/60 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1">
                    <Target size={14} className="text-rose-400" />
                    <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.12em]">Ataque</span>
                    <span className="text-lg font-black">{powers.att}</span>
                </div>
            </div>

            {/* Quick Settings */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/60 uppercase px-2 flex items-center gap-1.5 tracking-[0.12em]">
                        <Zap size={10} fill="currentColor" /> Formação
                    </label>
                    <select 
                        value={tempFormation}
                        onChange={(e) => setTempFormation(e.target.value as FormationType)}
                        className="w-full bg-surface/80 border border-white/5 p-4 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-primary transition-all appearance-none text-center"
                    >
                        {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/60 uppercase px-2 flex items-center gap-1.5 tracking-[0.12em]">
                        <Info size={10} /> Mentalidade
                    </label>
                    <select 
                        value={tempStyle}
                        onChange={(e) => setTempStyle(e.target.value as PlayingStyle)}
                        className="w-full bg-surface/80 border border-white/5 p-4 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-primary transition-all appearance-none text-center"
                    >
                        {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Tactical Instructions */}
            <div className="space-y-6 bg-white/5 p-6 rounded-[32px] border border-white/5">
                <h3 className="text-[11px] font-black uppercase text-white/60 tracking-[0.14em] text-center">Instruções de Campo</h3>
                
                {/* Pressing */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.12em]">Pressão</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.12em]">{tempInstructions.pressing}</span>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                        {(['BAIXA', 'MEDIA', 'ALTA'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setTempInstructions(prev => ({ ...prev, pressing: p }))}
                                className={clsx(
                                    "flex-1 py-2 rounded-xl text-[10px] font-black tracking-[0.12em] transition-all",
                                    tempInstructions.pressing === p ? "bg-white/10 text-white shadow-lg" : "text-white/35 hover:text-white/60"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Passing */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.12em]">Estilo de Passe</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.12em]">{tempInstructions.passing}</span>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                        {(['CURTO', 'MISTO', 'LONGO'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setTempInstructions(prev => ({ ...prev, passing: p }))}
                                className={clsx(
                                    "flex-1 py-2 rounded-xl text-[10px] font-black tracking-[0.12em] transition-all",
                                    tempInstructions.passing === p ? "bg-white/10 text-white shadow-lg" : "text-white/35 hover:text-white/60"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tempo */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.12em]">Ritmo de Jogo</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.12em]">{tempInstructions.tempo}</span>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                        {(['LENTO', 'PADRAO', 'VELOZ'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTempInstructions(prev => ({ ...prev, tempo: t }))}
                                className={clsx(
                                    "flex-1 py-2 rounded-xl text-[10px] font-black tracking-[0.12em] transition-all",
                                    tempInstructions.tempo === t ? "bg-white/10 text-white shadow-lg" : "text-white/35 hover:text-white/60"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {!isComplete && (
               <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-3xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0">
                     <AlertCircle size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[11px] font-black uppercase tracking-[0.12em] text-rose-400">Escalação Incompleta</span>
                     <p className="text-[12px] font-bold text-rose-200/70 leading-5">Você precisa de 11 titulares para salvar a estratégia.</p>
                  </div>
               </div>
            )}
        </div>
      </main>

      {/* Selector Drawer */}
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
