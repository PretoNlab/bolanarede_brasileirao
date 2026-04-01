import React from 'react';
import { Team, Player, TrainingFocus, TrainingIntensity, StaffMember, Infrastructure } from '../types';
import { 
  ArrowLeft, Target, Rocket, Shield, Zap, Dumbbell, 
  Info, Users, Activity, CheckCircle2, UserCheck, 
  Stethoscope, GraduationCap, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  team: Team;
  hiredStaff: StaffMember[];
  infrastructure: Infrastructure;
  squadFocus: TrainingFocus;
  intensity: TrainingIntensity;
  onSetSquadFocus: (focus: TrainingFocus) => void;
  onSetIntensity: (intensity: TrainingIntensity) => void;
  onUpdatePlayerFocus: (playerId: string, focus: TrainingFocus) => void;
  onBack: () => void;
}

const FocusCard: React.FC<{ id: TrainingFocus, label: string, icon: any, active: boolean, onClick: () => void }> = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] border transition-all relative overflow-hidden group h-32 w-full",
      active 
        ? "bg-primary text-secondary border-primary shadow-[0_0_30px_rgba(31,177,133,0.3)] scale-[1.02]" 
        : "glass-panel border-white/5 opacity-60 hover:opacity-100 hover:border-white/10 hover:bg-white/5"
    )}
  >
    <div className={clsx("p-3 rounded-2xl transition-all", active ? "bg-secondary/20 shadow-inner" : "bg-white/5")}>
      <Icon size={24} className={clsx(active ? "text-secondary" : "text-on-surface-variant")} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default function TrainingScreen({ 
  team, hiredStaff, infrastructure, squadFocus, intensity, 
  onSetSquadFocus, onSetIntensity, onUpdatePlayerFocus, onBack 
}: Props) {
  
  const coachingBonus = hiredStaff.filter(s => s.type === 'COACH').length * 0.25;
  const infraBonus = (infrastructure.ct || 1) * 0.1;
  const totalBonus = (coachingBonus + infraBonus) * 100;

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      <header className="p-6 flex items-center justify-between bg-background/60 backdrop-blur-2xl border-b border-white/5 pt-safe shrink-0">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-10 h-10 rounded-xl bg-surface-low/80 flex items-center justify-center border border-white/10">
          <ArrowLeft size={18} />
        </motion.button>
        <div className="flex flex-col items-center">
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-0.5 glow-text">CENTRO DE TREINAMENTO</h1>
          <span className="text-sm font-black uppercase tracking-tight font-display italic text-on-surface-variant">PREPARAÇÃO DE ATLETAS</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center border border-white/5 text-primary shadow-lg shadow-primary/5">
          <Dumbbell size={18} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-8 no-scrollbar pb-32">
        
        {/* Development Summary */}
        <div className="glass-vibrant rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
             <div className="flex-1">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2 block">EFICIÊNCIA DE DESENVOLVIMENTO</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black font-display italic leading-none text-primary">+{totalBonus.toFixed(0)}%</span>
                   <span className="text-xs font-bold text-secondary uppercase italic">BÔNUS ATIVO</span>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 justify-end">
                   <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase">Comissão</span>
                   <span className="text-[10px] font-black text-primary">+{ (coachingBonus*100).toFixed(0) }%</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                   <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase">CT</span>
                   <span className="text-[10px] font-black text-primary">+{ (infraBonus*100).toFixed(0) }%</span>
                </div>
             </div>
          </div>
        </div>

        {/* Squad Focus */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">FOCO DO ELENCO</h3>
            <span className="text-[10px] font-bold text-primary font-display uppercase tracking-widest italic">{squadFocus}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FocusCard id="ATAQUE" label="Finalização" icon={Rocket} active={squadFocus === 'ATAQUE'} onClick={() => onSetSquadFocus('ATAQUE')} />
            <FocusCard id="DEFESA" label="Bloqueios" icon={Shield} active={squadFocus === 'DEFESA'} onClick={() => onSetSquadFocus('DEFESA')} />
            <FocusCard id="TATICO" label="Posicional" icon={Target} active={squadFocus === 'TATICO'} onClick={() => onSetSquadFocus('TATICO')} />
            <FocusCard id="FISICO" label="Intensidade" icon={Zap} active={squadFocus === 'FISICO'} onClick={() => onSetSquadFocus('FISICO')} />
          </div>
        </section>

        {/* Intensity Selection */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant px-2">INTENSIDADE DA SEMANA</h3>
          <div className="grid grid-cols-3 gap-3">
             {(['BAIXA', 'MEDIA', 'ALTA'] as TrainingIntensity[]).map(i => (
               <button
                 key={i}
                 onClick={() => onSetIntensity(i)}
                 className={clsx(
                   "p-5 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all",
                   intensity === i 
                     ? "bg-secondary text-background border-secondary shadow-lg shadow-secondary/20" 
                     : "glass-panel border-white/5 text-on-surface-variant opacity-60 hover:opacity-100"
                 )}
               >
                 {i === 'BAIXA' ? 'Moderado' : i === 'MEDIA' ? 'Padrão' : 'Insano'}
               </button>
             ))}
          </div>
        </section>

        {/* Player Individual Progress */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant px-2">DESENVOLVIMENTO INDIVIDUAL</h3>
          <div className="space-y-3">
            {team.roster.map(player => (
              <div key={player.id} className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-black text-[10px] font-display border border-white/5 opacity-60">
                   {player.position}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-end mb-1.5">
                      <h4 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{player.name}</h4>
                      <span className="text-[10px] font-black tabular font-display italic text-primary">OVR {player.overall}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-background/50 rounded-full overflow-hidden p-[1px]">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(player.overall % 1) * 100 || 50}%` }}
                           className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(31,177,133,0.5)]" 
                         />
                      </div>
                      <select 
                        value={player.individualFocus || 'GERAL'} 
                        onChange={(e) => onUpdatePlayerFocus(player.id, e.target.value as TrainingFocus)}
                        className="bg-transparent text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant outline-none cursor-pointer"
                      >
                         <option value="GERAL">AUTO</option>
                         <option value="ATAQUE">ATA</option>
                         <option value="DEFESA">DEF</option>
                         <option value="TATICO">TAT</option>
                         <option value="FISICO">FIS</option>
                      </select>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
