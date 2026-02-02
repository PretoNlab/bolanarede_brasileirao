
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Team, MatchEvent, PlayingStyle, FormationType } from '../types';
import { Play, Pause, ArrowRightLeft, Settings2, X, Activity, MessageSquare, Zap, Target, Shield, Info, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// --- DYNAMIC PITCH COMPONENT (JUICE v2) ---
interface PitchProps {
   isDanger: boolean;
   attackingTeamId: string | null;
   homeTeamId: string;
   momentum: number; // 0-100
   isGoalAnimation: boolean;
   shoutActive: string | null;
}

const Pitch2D = ({ isDanger, attackingTeamId, homeTeamId, momentum, isGoalAnimation, shoutActive }: PitchProps) => {
   const isHomeAttacking = attackingTeamId === homeTeamId;

   // Calculate ball position: 5% padding on each side, momentum mapped to 5-95%
   const ballPosition = 5 + (momentum * 0.9);

   return (
      <div className={clsx(
         "relative w-full h-32 bg-emerald-900/40 rounded-2xl border border-emerald-500/30 overflow-hidden backdrop-blur-md mb-4 transition-all duration-500",
         isGoalAnimation && "ring-4 ring-yellow-400 animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.5)]"
      )}>
         {/* Field Grass Texture / Scanning */}
         <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] w-[200%] h-full animate-[scan_4s_linear_infinite]" />

         {/* Pressure Zones (Glow) */}
         <div
            className="absolute inset-y-0 left-0 bg-primary/20 blur-3xl transition-all duration-1000"
            style={{ width: `${momentum}%` }}
         />
         <div
            className="absolute inset-y-0 right-0 bg-secondary/10 blur-3xl transition-all duration-1000"
            style={{ width: `${100 - momentum}%` }}
         />

         {/* Center Line & Circle */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[1px] h-full bg-white/10" />
            <div className="w-16 h-16 rounded-full border border-white/10" />
         </div>

         {/* Goal Areas */}
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-16 border-y border-r border-white/20 bg-white/5" />
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-16 border-y border-l border-white/20 bg-white/5" />

         {/* BALL (The Lead Actor) */}
         <div
            className={clsx(
               "absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-700 ease-in-out z-10",
               isDanger ? "scale-150" : "scale-100"
            )}
            style={{ left: `${ballPosition}%` }}
         >
            {/* Motion Trail (only visible when moving fast or danger) */}
            {isDanger && (
               <div className="absolute inset-0 bg-white/30 rounded-full animate-ping scale-150" />
            )}

            <div className={clsx(
               "w-full h-full rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.8)]",
               isDanger ? "bg-white" : "bg-white/80"
            )}>
               <div className="w-2 h-2 bg-emerald-900 rounded-full opacity-20" />
            </div>
         </div>

         {/* Tactical Shout Indicator */}
         {shoutActive && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full border border-white/20 animate-bounce">
               <span className="text-[8px] font-black uppercase tracking-tighter text-primary flex items-center gap-1">
                  <Zap size={8} /> {shoutActive}
               </span>
            </div>
         )}

         {/* Goal Text Overlay */}
         <div className={clsx(
            "absolute inset-0 flex items-center justify-center bg-yellow-400/20 transition-opacity duration-300 pointer-events-none",
            isGoalAnimation ? "opacity-100" : "opacity-0"
         )}>
            <span className="text-4xl font-black italic text-yellow-400 drop-shadow-2xl translate-y-[-10px] scale-110 animate-bounce">
               GOL!!!
            </span>
         </div>
      </div>
   );
};

interface Props {
   homeTeam: Team;
   awayTeam: Team;
   round: number;
   ddaFactor: number;
   onFinish: (homeScore: number, awayScore: number, events: MatchEvent[]) => void;
}

interface Narration {
   minute: number;
   text: string;
   type: 'neutral' | 'danger' | 'goal' | 'event';
   teamId?: string;
}

export default function MatchScreen({ homeTeam: initialHomeTeam, awayTeam: initialAwayTeam, round, ddaFactor, onFinish }: Props) {
   const [minute, setMinute] = useState(0);
   const [homeScore, setHomeScore] = useState(0);
   const [awayScore, setAwayScore] = useState(0);
   const [isFinished, setIsFinished] = useState(false);
   const [isPaused, setIsPaused] = useState(true);
   const [speed, setSpeed] = useState<1 | 10 | 100>(10);
   const [gameState, setGameState] = useState<'1H' | 'HT' | '2H' | 'FT'>('1H');
   const [stoppageTime, setStoppageTime] = useState(Math.floor(Math.random() * 3) + 1);

   const [homeTeam, setHomeTeam] = useState<Team>({ ...initialHomeTeam });
   const [currentStyle, setCurrentStyle] = useState<PlayingStyle>(initialHomeTeam.style);
   const [currentFormation, setCurrentFormation] = useState<FormationType>(initialHomeTeam.formation);
   const [shoutActive, setShoutActive] = useState<string | null>(null);

   const [feed, setFeed] = useState<Narration[]>([]);
   const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
   const [stats, setStats] = useState({
      homeShots: 0,
      awayShots: 0,
      possession: 50,
      momentum: 50 // 0-100 (50 é meio campo)
   });

   const [isDanger, setIsDanger] = useState(false);
   const [dangerTeamId, setDangerTeamId] = useState<string | null>(null);
   const [isGoalAnimation, setIsGoalAnimation] = useState(false);

   const [showTacticsModal, setShowTacticsModal] = useState(false);
   const [showSubModal, setShowSubModal] = useState(false);
   const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);

   const feedRef = useRef<HTMLDivElement>(null);

   // Auto-scroll para o final do feed
   useEffect(() => {
      if (feedRef.current) {
         feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
   }, [feed]);

   const addNarration = (text: string, type: Narration['type'] = 'neutral', teamId?: string) => {
      setFeed(prev => [...prev, { minute, text, type, teamId }]);
   };

   const pickRandomLineupPlayer = (team: Team) => {
      const lineupPlayers = team.roster.filter(p => team.lineup.includes(p.id));
      const pool = lineupPlayers.length ? lineupPlayers : team.roster;
      return pool[Math.floor(Math.random() * Math.max(1, pool.length))];
   };

   const maybePickAssistant = (team: Team, scorerName?: string) => {
      const lineupPlayers = team.roster.filter(p => team.lineup.includes(p.id));
      const pool = (lineupPlayers.length ? lineupPlayers : team.roster).filter(p => p.name !== scorerName);
      if (!pool.length) return undefined;
      return pool[Math.floor(Math.random() * pool.length)];
   };

   const pickRandomFromLineup = (team: Team) => {
      const lineupPlayers = team.roster.filter(p => team.lineup.includes(p.id) && p.status === 'fit');
      const pool = lineupPlayers.length ? lineupPlayers : team.roster;
      return pool[Math.floor(Math.random() * pool.length)];
   };

   const getStochasticEvent = (momentum: number) => {
      const isHomeAttacking = Math.random() < (momentum / 100);
      const attackingTeam = isHomeAttacking ? homeTeam : initialAwayTeam;
      const defendingTeam = isHomeAttacking ? initialAwayTeam : homeTeam;

      const scenarios = [
         `O ${attackingTeam.shortName} trabalha a bola no meio de campo.`,
         `Troca de passes paciente do ${attackingTeam.shortName}.`,
         `${defendingTeam.shortName} se defende como pode!`,
         `Jogo muito truncado nesta fase da partida.`,
         `O técnico do ${attackingTeam.shortName} pede mais velocidade!`
      ];

      const dangerScenarios = [
         `OLHA O PERIGO! ${attackingTeam.shortName} chega forte pela ala!`,
         `Lançamento longo para o ataque do ${attackingTeam.shortName}...`,
         `QUE CHANCE! O goleiro do ${defendingTeam.shortName} faz uma defesa espetacular!`,
         `SUBIU A BANDEIRA! Impedimento do ${attackingTeam.shortName}.`,
         `A bola sobra na entrada da área...`
      ];

      if (Math.random() < 0.15) {
         // Chance Real de Gol
         addNarration(dangerScenarios[Math.floor(Math.random() * dangerScenarios.length)], 'danger', attackingTeam.id);
         setStats(s => ({
            ...s,
            homeShots: isHomeAttacking ? s.homeShots + 1 : s.homeShots,
            awayShots: !isHomeAttacking ? s.awayShots + 1 : s.awayShots
         }));

         // Probabilidade de Gol baseada em mentalidade
         let goalProb = 0.2;
         if (isHomeAttacking && currentStyle === 'Ofensivo') goalProb = 0.3;
         if (isHomeAttacking && currentStyle === 'Tudo-ou-Nada') goalProb = 0.45;

         if (Math.random() < goalProb) {
            const scorer = pickRandomLineupPlayer(attackingTeam);
            const assister = maybePickAssistant(attackingTeam, scorer?.name);

            if (isHomeAttacking) setHomeScore(s => s + 1);
            else setAwayScore(s => s + 1);

            const goalText = assister
               ? `GOOOOOOOOOL DO ${attackingTeam.shortName}! ${scorer.name} (assist. ${assister.name})`
               : `GOOOOOOOOOL DO ${attackingTeam.shortName}! ${scorer.name}`;

            addNarration(goalText, 'goal', attackingTeam.id);
            setMatchEvents(prev => [
               ...prev,
               {
                  minute,
                  type: 'goal',
                  teamId: attackingTeam.id,
                  playerName: scorer.name,
                  assistName: assister?.name,
                  description: goalText,
               },
            ]);
            toast.success(`GOL DO ${attackingTeam.shortName}!`, { icon: '⚽' });
            setStats(s => ({ ...s, momentum: 50 })); // Reinicia momentum

            // Trigger Goal Animation
            setIsGoalAnimation(true);
            setTimeout(() => setIsGoalAnimation(false), 3000);

            // HAPTIC: Goal
            try { Haptics.notification({ type: NotificationType.Success }); } catch { }
         }
      } else {
         // Narração comum
         if (Math.random() < 0.4) {
            addNarration(scenarios[Math.floor(Math.random() * scenarios.length)], 'neutral');
         }
      }

      // Trigger Visual Danger
      if (Math.random() < 0.15) {
         setIsDanger(true);
         setDangerTeamId(attackingTeam.id);
         try { Haptics.impact({ style: ImpactStyle.Light }); } catch { }
         setTimeout(() => setIsDanger(false), 3000);
      }
   };

   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      // Só roda se não estiver pausado e nem finalizado/intervalo
      if (!isPaused && (gameState === '1H' || gameState === '2H')) {
         const intervalTime = speed === 1 ? 1500 : (speed === 10 ? 300 : 80);
         interval = setInterval(() => {
            setMinute(m => {
               const nextMinute = m + 1;

               // Verificar Fim de Tempo
               if (gameState === '1H' && nextMinute > 45 + stoppageTime) {
                  setGameState('HT');
                  setIsPaused(true);
                  addNarration("FIM DO PRIMEIRO TEMPO! Intervalo.", 'event');
                  return 45;
               }
               if (gameState === '2H' && nextMinute > 90 + stoppageTime) {
                  setGameState('FT');
                  setIsFinished(true);
                  setIsPaused(true);
                  addNarration("APITA O ÁRBITRO! FINAL DE PARTIDA.", 'event');
                  try { Haptics.notification({ type: NotificationType.Warning }); } catch { }
                  return 90;
               }

               // Lógica de Momentum (Simula o domínio de campo)
               let bias = 0;
               if (currentStyle === 'Ofensivo') bias = 5;
               if (currentStyle === 'Defensivo') bias = -5;
               if (shoutActive === 'Pressionar') bias += 10;

               // DDA BIAS: Positive ddaFactor (>1.0) means player is winning too much.
               // We reduce their momentum bias. 1.20 factor = -5 bias.
               bias -= (ddaFactor - 1.0) * 25;

               const shift = (Math.random() * 20 - 10) + bias;
               const newMomentum = Math.min(95, Math.max(5, stats.momentum + shift));

               setStats(prev => ({
                  ...prev,
                  momentum: newMomentum,
                  possession: Math.round(prev.possession * 0.95 + (newMomentum * 0.05))
               }));

               // Gera narração a cada minuto ou a cada 2 minutos
               getStochasticEvent(newMomentum);

               return nextMinute;
            });
         }, intervalTime);
      }
      return () => clearInterval(interval);
   }, [gameState, isPaused, speed, stats.momentum, currentStyle, shoutActive, stoppageTime]);

   const handleSubstitution = (outId: string, inId: string) => {
      setHomeTeam(prev => ({ ...prev, lineup: prev.lineup.map(id => id === outId ? inId : id) }));
      setShowSubModal(false);
      setSelectedSubOut(null);
      const pIn = homeTeam.roster.find(p => p.id === inId);
      const pOut = homeTeam.roster.find(p => p.id === outId);
      addNarration(`SUBSTITUIÇÃO: Sai ${pOut?.name}, entra ${pIn?.name}.`, 'event', homeTeam.id);
      toast.success("Substituição confirmada!");
   };

   const TeamLogo = ({ team, size = "w-12 h-12" }: { team: Team, size?: string }) => {
      return (
         <div className={`${size} rounded-2xl bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center font-black shadow-lg border border-white/10 text-white`}>
            {team.shortName}
         </div>
      );
   };

   return (
      <div className="flex flex-col h-screen bg-background text-white relative font-sans overflow-hidden">

         {/* 1. RETRO INFO HEADER */}
         {!showSubModal && !showTacticsModal && (
            <header className="bg-black/95 backdrop-blur-xl py-4 px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.25em] border-b border-white/5 z-30 pt-safe">
               <div className="text-white/40 flex items-center gap-4">
                  <span className="text-white/60">Brasileiro • D1</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span>Rodada {round}</span>
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-primary italic text-lg tracking-tighter drop-shadow-[0_0_10px_rgba(255,100,255,0.4)]">{minute}'</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-white/40">{gameState === '1H' ? '1ºT' : gameState === 'HT' ? 'INT' : '2ºT'}</span>
               </div>
            </header>
         )}

         {/* 2. COMPACT TEAM STRIPS */}
         {!showSubModal && !showTacticsModal && (
            <div className="flex flex-col flex-none">
               <div className={clsx(
                  "py-1.5 flex justify-center items-center font-black italic text-sm uppercase tracking-tighter border-b border-white/5 transition-all duration-700",
                  homeTeam.logoColor1 || "bg-primary"
               )}>
                  <span className="drop-shadow-lg">{homeTeam.name}</span>
               </div>
               <div className={clsx(
                  "py-1.5 flex justify-center items-center font-black italic text-sm uppercase tracking-tighter border-b border-white/5 transition-all duration-700",
                  initialAwayTeam.logoColor1 || "bg-secondary"
               )}>
                  <span className="drop-shadow-lg">{initialAwayTeam.name}</span>
               </div>
            </div>
         )}

         {/* 3. DIGITAL LED SCOREBOARD (COMPACT) */}
         {!showSubModal && !showTacticsModal && (
            <div className="bg-[#050505] relative overflow-hidden py-3 px-6 flex justify-around items-center border-b border-white/5 shadow-inner flex-none">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '4px 4px' }} />

               <div className="flex flex-col items-center">
                  <span className="text-[7px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">CASA</span>
                  <div className="bg-black/40 rounded-lg px-3 py-1 border border-white/5">
                     <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)] tabular-nums" style={{ fontFamily: 'monospace' }}>
                        {homeScore}
                     </span>
                  </div>
               </div>

               <div className="text-xl font-black text-white/10">-</div>

               <div className="flex flex-col items-center">
                  <span className="text-[7px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">FORA</span>
                  <div className="bg-black/40 rounded-lg px-3 py-1 border border-white/5">
                     <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)] tabular-nums" style={{ fontFamily: 'monospace' }}>
                        {awayScore}
                     </span>
                  </div>
               </div>
            </div>
         )}

         {/* 4. LIVE HIGHLIGHT & EVENT SUMMARY (SCROLLABLE AREA) */}
         {!showSubModal && !showTacticsModal && (
            <div className="px-6 py-4 space-y-4 flex-none z-10 bg-black/20 border-b border-white/5">
               {/* Event Summary Grid - Ultra Compact */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <h4 className="text-[7px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" /> EVENTOS CASA
                     </h4>
                     <div className="bg-white/5 rounded-xl p-3 border border-white/5 min-h-[50px] max-h-[100px] overflow-y-auto no-scrollbar flex flex-col gap-1.5 shadow-inner">
                        {matchEvents.filter(e => e.teamId === homeTeam.id).length === 0 && (
                           <span className="text-[8px] text-white/5 font-black uppercase tracking-wider text-center py-2 italic">Nenhum evento</span>
                        )}
                        {matchEvents.filter(e => e.teamId === homeTeam.id).map((event, idx) => (
                           <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                              <span className="text-[10px]">{event.type === 'goal' ? '⚽' : event.type === 'card' ? (event.description.includes('vermelho') ? '🟥' : '🟨') : '🚑'}</span>
                              <span className="text-[10px] font-bold text-white/70 truncate tracking-tight">{event.description.split(' - ')[0].replace('GOOOOOOOOOOOL! ', 'GOL! ')}</span>
                              <span className="text-[9px] font-medium text-white/30 tabular-nums ml-auto">{event.minute}'</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <h4 className="text-[7px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-2 justify-end">
                        EVENTOS FORA <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                     </h4>
                     <div className="bg-white/5 rounded-xl p-3 border border-white/5 min-h-[50px] max-h-[100px] overflow-y-auto no-scrollbar flex flex-col gap-1.5 shadow-inner">
                        {matchEvents.filter(e => e.teamId === initialAwayTeam.id).length === 0 && (
                           <span className="text-[8px] text-white/5 font-black uppercase tracking-wider text-center py-2 italic">Nenhum evento</span>
                        )}
                        {matchEvents.filter(e => e.teamId === initialAwayTeam.id).map((event, idx) => (
                           <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                              <span className="text-[9px] font-medium text-white/30 tabular-nums">{event.minute}'</span>
                              <span className="text-[10px] font-bold text-white/70 truncate tracking-tight flex-1 text-right">{event.description.split(' - ')[0].replace('GOOOOOOOOOOOL! ', 'GOL! ')}</span>
                              <span className="text-[10px] ml-1">{event.type === 'goal' ? '⚽' : event.type === 'card' ? (event.description.includes('vermelho') ? '🟥' : '🟨') : '🚑'}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
         {/* Main Container - Narração e Stats */}
         {!showSubModal && !showTacticsModal && (
            <main className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">

               {/* Barra de Momentum (O "Mini-Campo" de dados) */}
               <div className="bg-surface/40 backdrop-blur-md rounded-[32px] p-6 border border-white/5 shadow-2xl">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase text-secondary mb-4 tracking-[0.2em] px-2 opacity-60">
                     <span className="text-primary">Pressão {homeTeam.shortName}</span>
                     <span className="bg-white/5 px-2 py-0.5 rounded text-white/30">EQUILÍBRIO</span>
                     <span className="text-emerald-400">Pressão {initialAwayTeam.shortName}</span>
                  </div>
                  <div className="h-2.5 bg-black/60 rounded-full overflow-hidden relative shadow-inner">
                     <div
                        className="absolute inset-y-0 bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(255,100,255,0.3)]"
                        style={{ left: '0', width: `${stats.momentum}%` }}
                     ></div>
                     <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                        <div className="w-0.5 h-full bg-white/20" />
                     </div>
                  </div>
                  <div className="grid grid-cols-3 mt-6 text-center">
                     <div className="flex flex-col gap-1">
                        <span className="text-base font-black tabular-nums">{stats.possession}%</span>
                        <span className="text-[8px] text-secondary uppercase font-black tracking-widest opacity-60">Posse</span>
                     </div>
                     <div className="flex flex-col gap-1 border-x border-white/5">
                        <span className="text-sm font-black uppercase tracking-tighter italic text-primary">{currentStyle}</span>
                        <span className="text-[8px] text-secondary uppercase font-black tracking-widest opacity-60">Mentalidade</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-base font-black tabular-nums">{stats.homeShots} - {stats.awayShots}</span>
                        <span className="text-[8px] text-secondary uppercase font-black tracking-widest opacity-60">Chutes</span>
                     </div>
                  </div>
               </div>

               {/* Feed de Narração (A Alma do Elifoot) */}
               <div
                  ref={feedRef}
                  className="flex-1 bg-black/30 rounded-[40px] border border-white/5 overflow-y-auto p-8 space-y-5 no-scrollbar shadow-inner relative"
               >
                  {feed.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-secondary/20 gap-6">
                        <MessageSquare size={56} strokeWidth={1} />
                        <p className="text-xs font-black uppercase tracking-[0.3em] italic text-center px-10 leading-relaxed shadow-sm">
                           O gramado está impecável... <br />O árbitro consulta o cronômetro...
                        </p>
                     </div>
                  )}
                  {feed.map((msg, i) => (
                     <div
                        key={i}
                        className={clsx(
                           "animate-in fade-in slide-in-from-bottom-4 duration-500",
                           msg.type === 'goal' ? "bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl shadow-xl shadow-emerald-500/5" :
                              msg.type === 'danger' ? "bg-rose-500/5 border-l-4 border-rose-500 px-6 py-2" : "px-2"
                        )}
                     >
                        <div className="flex items-start gap-4">
                           <span className="text-xs font-black text-secondary/40 mt-1.5 tabular-nums tracking-tighter shadow-sm">{msg.minute}'</span>
                           <p className={clsx(
                              "text-[15px] leading-relaxed font-medium tracking-tight",
                              msg.type === 'goal' ? "text-emerald-400 font-black italic text-xl" :
                                 msg.type === 'danger' ? "text-rose-400 font-bold" :
                                    msg.type === 'event' ? "text-primary font-bold" : "text-gray-200"
                           )}>
                              {msg.text}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </main>
         )}

         {/* Controle de Velocidade e Pausa Flutuante */}
         {!showSubModal && !showTacticsModal && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 z-10">
               <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                  {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
               </button>
               <button onClick={() => setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1))} className="w-12 h-12 bg-surface border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black shadow-xl">
                  {speed}x
               </button>
            </div>
         )}

         {/* Rodapé de Gestão em Tempo Real */}
         {!isFinished && !showSubModal && !showTacticsModal && (
            <div className="p-6 bg-surface/60 backdrop-blur-3xl border-t border-white/5 space-y-4 pb-safe z-40">
               <div className="flex gap-2.5">
                  {['Pressionar', 'Acalmar', 'Explorar Alas'].map(shout => (
                     <button
                        key={shout}
                        onClick={() => {
                           setShoutActive(shout === shoutActive ? null : shout);
                           if (shout !== shoutActive) toast(`Gritando: ${shout.toUpperCase()}!`, { icon: '📣' });
                        }}
                        className={clsx(
                           "flex-1 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
                           shoutActive === shout ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white/5 text-secondary border-white/5"
                        )}
                     >
                        {shout}
                     </button>
                  ))}
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setIsPaused(true); setShowTacticsModal(true); }} className="bg-surface/40 py-4.5 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 border border-white/5 active:bg-white/5 transition-all">
                     <Settings2 size={16} className="text-primary" /> MUDAR TÁTICA
                  </button>
                  <button onClick={() => { setIsPaused(true); setShowSubModal(true); }} className="bg-emerald-500/10 text-emerald-500 py-4.5 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 border border-emerald-500/20 active:bg-emerald-500/20 transition-all">
                     <ArrowRightLeft size={16} /> SUBSTITUIR
                  </button>
               </div>
            </div>
         )}

         {/* MODAL: INTERVALO (HT) */}
         {gameState === 'HT' && !showTacticsModal && !showSubModal && (
            <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-2xl animate-in fade-in duration-300 flex items-center justify-center p-8">
               <div className="w-full max-w-sm bg-surface border border-white/10 rounded-[40px] p-8 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                  <div className="flex flex-col items-center gap-2">
                     <h4 className="text-3xl font-black italic tracking-tighter text-yellow-500 uppercase leading-none">Intervalo</h4>
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Instruções no Vestiário</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                     <button
                        onClick={() => setShowTacticsModal(true)}
                        className="bg-white/5 py-5 rounded-3xl text-[11px] font-black uppercase flex flex-col items-center gap-3 border border-white/5 active:bg-white/10 transition-all group"
                     >
                        <Settings2 size={24} className="text-primary group-active:scale-90 transition-transform" />
                        <span>Tática</span>
                     </button>
                     <button
                        onClick={() => setShowSubModal(true)}
                        className="bg-white/5 py-5 rounded-3xl text-[11px] font-black uppercase flex flex-col items-center gap-3 border border-white/5 active:bg-white/10 transition-all group"
                     >
                        <ArrowRightLeft size={24} className="text-emerald-500 group-active:scale-90 transition-transform" />
                        <span>Trocas</span>
                     </button>
                  </div>

                  <button
                     onClick={() => {
                        setGameState('2H');
                        setMinute(45);
                        setStoppageTime(Math.floor(Math.random() * 5) + 2);
                        setIsPaused(false);
                        addNarration("Começa o Segundo Tempo!", 'event');
                     }}
                     className="w-full py-5 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-xs"
                  >
                     Iniciar 2º Tempo
                  </button>
               </div>
            </div>
         )}

         {/* MODAL: FIM DE PARTIDA (FT) */}
         {isFinished && !showTacticsModal && !showSubModal && (
            <div className="fixed inset-0 z-[160] bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500 flex items-center justify-center p-8">
               <div className="w-full max-w-sm flex flex-col items-center gap-10">
                  <div className="flex flex-col items-center gap-6 text-center">
                     <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20 animate-pulse">
                        <Activity size={40} className="text-white" />
                     </div>
                     <h4 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Partida Encerrada</h4>

                     <div className="flex items-center gap-6 mt-4 bg-white/5 p-6 rounded-[40px] border border-white/5">
                        <div className="flex flex-col items-center gap-3">
                           <TeamLogo team={homeTeam} size="w-16 h-16" />
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{homeTeam.shortName}</span>
                           <span className="text-5xl font-black text-white tabular-nums">{homeScore}</span>
                        </div>

                        <span className="text-3xl font-black text-white/10 mt-10">-</span>

                        <div className="flex flex-col items-center gap-3">
                           <TeamLogo team={initialAwayTeam} size="w-16 h-16" />
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{initialAwayTeam.shortName}</span>
                           <span className="text-5xl font-black text-white tabular-nums">{awayScore}</span>
                        </div>
                     </div>
                  </div>

                  <button
                     onClick={() => {
                        const commentary: MatchEvent[] = feed
                           .filter(f => f.type !== 'goal')
                           .slice(-12)
                           .map(f => ({ minute: f.minute, type: 'commentary', description: f.text }));
                        onFinish(homeScore, awayScore, [...matchEvents, ...commentary]);
                     }}
                     className="w-full py-5 bg-white text-slate-900 rounded-[32px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-xs"
                  >
                     Sair para o CT
                  </button>
               </div>
            </div>
         )}

         {/* Modal Tática */}
         {showTacticsModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
               <div className="w-full max-w-sm bg-surface border border-white/10 rounded-[48px] p-10 space-y-8 animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-black italic tracking-tighter">PRANCHETA</h3>
                     <button onClick={() => setShowTacticsModal(false)}><X size={20} /></button>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Mentalidade</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['Defensivo', 'Equilibrado', 'Ofensivo', 'Tudo-ou-Nada'].map(s => (
                              <button key={s} onClick={() => setCurrentStyle(s as any)}
                                 className={clsx("py-3 rounded-xl text-[11px] font-black border transition-all", currentStyle === s ? "bg-primary border-primary text-white" : "bg-background border-white/5 text-secondary")}
                              >
                                 {s}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <button onClick={() => { setShowTacticsModal(false); setIsPaused(false); }} className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Confirmar</button>
               </div>
            </div>
         )}

         {/* Modal Substituição */}
         {showSubModal && (
            <div className="fixed inset-0 z-[200] bg-slate-950 pt-safe flex flex-col">
               <header className="p-6 border-b border-white/10 flex items-center justify-between">
                  <button onClick={() => { setShowSubModal(false); setIsPaused(false); }} className="p-2"><X size={24} /></button>
                  <h3 className="text-xl font-black italic tracking-tighter">SUBSTITUIÇÕES</h3>
                  <div className="w-10"></div>
               </header>
               <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                  <div className="space-y-2">
                     <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest px-2">Quem sai?</h4>
                     {homeTeam.roster.filter(p => homeTeam.lineup.includes(p.id)).map(player => (
                        <button key={player.id} onClick={() => setSelectedSubOut(player.id)}
                           className={clsx("w-full p-4 rounded-2xl border flex items-center justify-between transition-all", selectedSubOut === player.id ? "bg-rose-500/10 border-rose-500" : "bg-surface border-white/5")}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-black text-[10px] border border-white/10">{player.position}</div>
                              <div className="text-left">
                                 <p className="text-sm font-bold">{player.name}</p>
                                 <span className="text-[10px] text-secondary">OVR {player.overall} • ⚡ {Math.round(player.energy)}%</span>
                              </div>
                           </div>
                        </button>
                     ))}
                  </div>
                  {selectedSubOut && (
                     <div className="space-y-2 animate-in slide-in-from-bottom">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2">Quem entra?</h4>
                        {homeTeam.roster.filter(p => !homeTeam.lineup.includes(p.id)).map(player => (
                           <button key={player.id} onClick={() => handleSubstitution(selectedSubOut, player.id)}
                              className="w-full p-4 bg-surface rounded-2xl border border-emerald-500/20 flex items-center justify-between active:scale-95 transition-all"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-[10px] border border-emerald-500/20">{player.position}</div>
                                 <div className="text-left">
                                    <p className="text-sm font-bold">{player.name}</p>
                                    <span className="text-[10px] text-secondary">OVR {player.overall}</span>
                                 </div>
                              </div>
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

