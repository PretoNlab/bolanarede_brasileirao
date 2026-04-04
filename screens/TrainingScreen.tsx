
import React from 'react';
import { Team, Player, TrainingFocus, TrainingIntensity, StaffMember, Infrastructure } from '../types';
import { 
  Target, Rocket, Shield, Zap, Dumbbell, 
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
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
      "flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group h-40 w-full shadow-2xl",
      active 
        ? "bg-primary border-primary shadow-[0_0_40px_rgba(31,177,133,0.3)] scale-[1.05] z-10" 
        : "bg-white/[0.03] border-white/5 opacity-40 hover:opacity-100 hover:border-white/10 hover:bg-white/[0.07]"
    )}
  >
    <div className={clsx("p-4 rounded-2xl transition-all duration-500 shadow-xl", active ? "bg-white/20" : "bg-white/5 group-hover:bg-primary/10")}>
      <Icon size={32} className={clsx(active ? "text-white" : "text-primary/60 group-hover:text-primary")} />
    </div>
    <span className={clsx("text-[10px] font-black uppercase tracking-[0.25em] transition-all", active ? "text-white" : "text-white/40 group-hover:text-white/80")}>{label}</span>
    {active && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />}
    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
    <div className="flex flex-col h-screen bg-background text-white selection:bg-primary/30 overflow-hidden">
      <Header 
        title="Centro de Alta Performance"
        subtitle={team.name}
        onBack={onBack}
        rightAction={
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <TrendingUp size={14} />
                <span className="font-black text-xs uppercase tracking-widest">{totalBonus.toFixed(0)}% Eficiência</span>
            </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
        
        {/* Potencial de Evolução */}
        <section className="ui-card-premium p-10 relative overflow-hidden group border-emerald-500/10 bg-emerald-500/[0.02]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
          <div className="flex items-center justify-between relative z-10">
             <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-4">Ganhos de Desenvolvimento</span>
                <div className="flex items-baseline gap-4">
                   <span className="text-6xl font-black tracking-tighter leading-none text-white italic">+{totalBonus.toFixed(0)}%</span>
                   <span className="text-xs font-black text-emerald-500 uppercase tracking-widest animate-pulse">Sinergia Ativa</span>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 justify-end">
                   <div className="text-right">
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Corpo Técnico</p>
                       <p className="text-sm font-black text-emerald-400 italic">+{ (coachingBonus*100).toFixed(0) }%</p>
                   </div>
                   <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <Activity size={18} className="text-emerald-500" />
                   </div>
                </div>
                <div className="flex items-center gap-4 justify-end">
                   <div className="text-right">
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Infraestrutura</p>
                       <p className="text-sm font-black text-emerald-400 italic">+{ (infraBonus*100).toFixed(0) }%</p>
                   </div>
                   <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <Rocket size={18} className="text-emerald-500" />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Foco Tático Coletivo */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/90">Foco Coletivo</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <FocusCard id="ATAQUE" label="Ataque" icon={Rocket} active={squadFocus === 'ATAQUE'} onClick={() => onSetSquadFocus('ATAQUE')} />
            <FocusCard id="DEFESA" label="Defesa" icon={Shield} active={squadFocus === 'DEFESA'} onClick={() => onSetSquadFocus('DEFESA')} />
            <FocusCard id="TATICO" label="Tático" icon={Target} active={squadFocus === 'TATICO'} onClick={() => onSetSquadFocus('TATICO')} />
            <FocusCard id="FISICO" label="Físico" icon={Zap} active={squadFocus === 'FISICO'} onClick={() => onSetSquadFocus('FISICO')} />
          </div>
        </section>

        {/* Intensidade */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-secondary rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/90">Intensidade</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
             {(['BAIXA', 'MEDIA', 'ALTA'] as TrainingIntensity[]).map(i => (
               <button
                 key={i}
                 onClick={() => onSetIntensity(i)}
                 className={clsx(
                   "p-6 rounded-[2rem] border-2 font-black uppercase tracking-[0.25em] text-[10px] transition-all duration-500 relative overflow-hidden group shadow-2xl",
                   intensity === i 
                     ? "bg-secondary border-secondary text-white shadow-secondary/30 scale-[1.05] z-10" 
                     : "bg-white/[0.03] border-white/5 text-secondary opacity-40 hover:opacity-100 hover:bg-white/[0.08]"
                 )}
               >
                 <span className="relative z-10">
                   {i === 'BAIXA' ? 'Recuperação' : i === 'MEDIA' ? 'Equilibrado' : 'Carga Total'}
                 </span>
                 <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               </button>
             ))}
          </div>
        </section>

        {/* Player Individual Progress */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-2">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(31,177,133,0.5)]" />
                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/90">Gestão de Atletas</h3>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.roster.map(player => (
              <div key={player.id} className="ui-card-premium p-6 flex items-center gap-6 group hover:bg-white/[0.08] transition-all duration-500 border-white/5">
                <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center font-black text-[12px] border border-white/5 text-primary shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        {player.position}
                    </div>
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-end mb-3">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{player.name}</h4>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{player.mainPosition}</p>
                      </div>
                      <span className="text-xs font-black text-primary italic bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">OVR {player.overall}</span>
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5 relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(player.overall % 1) * 100 || 50}%` }}
                           className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] relative z-10" 
                         />
                      </div>
                      <select 
                        value={player.individualFocus || 'GERAL'} 
                        onChange={(e) => onUpdatePlayerFocus(player.id, e.target.value as TrainingFocus)}
                        className="bg-transparent text-[9px] font-black uppercase tracking-[0.2em] text-white/30 outline-none cursor-pointer hover:text-primary focus:text-primary transition-all appearance-none text-right"
                      >
                         <option value="GERAL" className="bg-zinc-900 border-none">AUTO</option>
                         <option value="ATAQUE" className="bg-zinc-900 border-none">ATA</option>
                         <option value="DEFESA" className="bg-zinc-900 border-none">DEF</option>
                         <option value="TATICO" className="bg-zinc-900 border-none">TAT</option>
                         <option value="FISICO" className="bg-zinc-900 border-none">FIS</option>
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


