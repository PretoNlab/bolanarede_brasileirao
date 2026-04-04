import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Team, MatchEvent, PlayingStyle, FormationType, TacticalInstructions } from '../types';
import { 
  Play, Pause, ArrowRightLeft, Settings2, X, Activity, MessageSquare, 
  Zap, Target, Shield, Info, ChevronDown, Globe, Trophy, Timer, 
  ChevronRight, Sparkles, BarChart3, TrendingUp, TrendingDown 
} from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { impactLight, impactMedium, impactHeavy, hapticNotificationSuccess, hapticNotificationError, hapticSelection } from '../haptics';



interface Props {
   homeTeam: Team;
   awayTeam: Team;
   round: number;
   ddaFactor: number;
   onFinish: (homeScore: number, awayScore: number, matchEvents: MatchEvent[], pkHome?: number, pkAway?: number) => void;
   mode?: 'league' | 'worldcup';
   wcPhase?: string;
}

interface Narration {
   minute: number;
   text: string;
   type: 'neutral' | 'danger' | 'goal' | 'event';
   teamId?: string;
}

const MATCH_FORMATIONS: FormationType[] = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '4-5-1', '5-3-2', '5-4-1', '3-4-3', '4-1-4-1', '4-1-2-1-2', '4-2-4'];

function getFormationBias(formation: FormationType) {
   switch (formation) {
      case '3-5-2': return { attack: 5, defense: -2, control: 4 };
      case '4-3-3': return { attack: 6, defense: -1, control: 2 };
      case '4-2-3-1': return { attack: 4, defense: 1, control: 4 };
      case '3-4-3': return { attack: 7, defense: -3, control: 1 };
      case '4-1-4-1': return { attack: 1, defense: 4, control: 5 };
      case '4-1-2-1-2': return { attack: 5, defense: 0, control: 3 };
      case '4-2-4': return { attack: 8, defense: -5, control: -2 };
      case '4-5-1': return { attack: -3, defense: 4, control: 3 };
      case '5-3-2': return { attack: -2, defense: 5, control: 1 };
      case '5-4-1': return { attack: -5, defense: 7, control: -1 };
      default: return { attack: 1, defense: 1, control: 1 };
   }
}

export default function MatchScreen({ homeTeam: initialHomeTeam, awayTeam: initialAwayTeam, round, ddaFactor, onFinish, mode = 'league', wcPhase }: Props) {
   const [minute, setMinute] = useState(0);
   const [homeScore, setHomeScore] = useState(0);
   const [awayScore, setAwayScore] = useState(0);
   const [isFinished, setIsFinished] = useState(false);
   const [isPaused, setIsPaused] = useState(true);
   const [speed, setSpeed] = useState<1 | 10 | 100>(10);
   const [gameState, setGameState] = useState<'1H' | 'HT' | '2H' | 'ET1' | 'ET_INT' | 'ET2' | 'PK' | 'FT'>('1H');
   const [stoppageTime, setStoppageTime] = useState(Math.floor(Math.random() * 3) + 1);

   const isKnockout = useMemo(() => {
      if (mode !== 'worldcup') return false;
      if (!wcPhase) return false;
      return !wcPhase.includes('Grupo');
   }, [mode, wcPhase]);

   const [pkResults, setPkResults] = useState<{ home: (0 | 1 | 2)[], away: (0 | 1 | 2)[] }>({ home: [], away: [] });
   const [pkTurn, setPkTurn] = useState<'HOME' | 'AWAY'>('HOME');
   const [pkIndex, setPkIndex] = useState(0);
   const [pkMessage, setPkMessage] = useState('Disputa de pênaltis iniciada!');

   const [homeTeam, setHomeTeam] = useState<Team>(() => {
      const t = { ...initialHomeTeam };
      // HEAL: Se a lineup estiver vazia (bug da Copa), inicializa com os 11 melhores
      if (!t.lineup || t.lineup.length === 0) {
         t.lineup = [...t.roster]
            .sort((a, b) => b.overall - a.overall)
            .slice(0, 11)
            .map(p => p.id);
      }
      return t;
   });
   const [currentStyle, setCurrentStyle] = useState<PlayingStyle>(initialHomeTeam.style);
   const [currentFormation, setCurrentFormation] = useState<FormationType>(initialHomeTeam.formation);
   const [currentInstructions, setCurrentInstructions] = useState<TacticalInstructions>(
      initialHomeTeam.instructions || { pressing: 'MEDIA', passing: 'MISTO', tempo: 'PADRAO' }
   );
   const [shoutActive, setShoutActive] = useState<string | null>(null);

   const [feed, setFeed] = useState<Narration[]>([]);
   const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
   const [stats, setStats] = useState({ homeShots: 0, awayShots: 0, possession: 50, momentum: 50 });

   const [isDanger, setIsDanger] = useState(false);
   const [dangerTeamId, setDangerTeamId] = useState<string | null>(null);
   const [isGoalAnimation, setIsGoalAnimation] = useState(false);

   const [showTacticsModal, setShowTacticsModal] = useState(false);
   const [showSubModal, setShowSubModal] = useState(false);
   const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);

   const feedRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
   }, [feed]);

   const addNarration = (text: string, type: Narration['type'] = 'neutral', teamId?: string, overrideMinute?: number) => {
      setFeed(prev => [...prev, { minute: overrideMinute ?? minute, text, type, teamId }]);
   };

   const matchPulse = useMemo(() => {
      if (isDanger && dangerTeamId === homeTeam.id) {
         return { title: 'Mandante Ataca', copy: `Volume ofensivo crítico do ${homeTeam.shortName}.`, tone: 'primary' } as const;
      }
      if (isDanger && dangerTeamId === initialAwayTeam.id) {
         return { title: 'Pressão Visitante', copy: `O ${initialAwayTeam.shortName} está por cima agora.`, tone: 'danger' } as const;
      }
      return { title: 'Equilíbrio Tático', copy: 'A partida segue em disputa territorial intensa.', tone: 'neutral' } as const;
   }, [dangerTeamId, homeTeam.id, homeTeam.shortName, initialAwayTeam.id, initialAwayTeam.shortName, isDanger]);

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

   const penaltyScore = useMemo(() => ({
      home: pkResults.home.filter(r => r === 1).length,
      away: pkResults.away.filter(r => r === 1).length,
   }), [pkResults]);

   const formationBias = useMemo(() => getFormationBias(currentFormation), [currentFormation]);

   const getStochasticEvent = (momentum: number) => {
      const isHomeAttacking = Math.random() < (momentum / 100);
      const attackingTeam = isHomeAttacking ? homeTeam : initialAwayTeam;
      const defendingTeam = isHomeAttacking ? initialAwayTeam : homeTeam;

      const dangerScenarios = [
         `OLHA O PERIGO! ${attackingTeam.shortName} chega forte!`,
         `Lançamento longo para o ataque do ${attackingTeam.shortName}...`,
         `QUE CHANCE! O goleiro do ${defendingTeam.shortName} salva!`,
         `A bola sobra na entrada da área...`
      ];

      if (Math.random() < 0.15) {
         addNarration(dangerScenarios[Math.floor(Math.random() * dangerScenarios.length)], 'danger', attackingTeam.id);
         setStats(s => ({
            ...s,
            homeShots: isHomeAttacking ? s.homeShots + 1 : s.homeShots,
            awayShots: !isHomeAttacking ? s.awayShots + 1 : s.awayShots
         }));

         let goalProb = 0.2;
         if (isHomeAttacking && currentStyle === 'Ultra-Defensivo') goalProb -= 0.08;
         if (isHomeAttacking && currentStyle === 'Defensivo') goalProb -= 0.03;
         if (isHomeAttacking && currentStyle === 'Ofensivo') goalProb += 0.07;
         if (isHomeAttacking && currentStyle === 'Tudo-ou-Nada') goalProb += 0.15;
         if (isHomeAttacking) {
            goalProb += formationBias.attack * 0.01;
            goalProb -= Math.max(0, formationBias.defense) * 0.003;
            if (currentInstructions.passing === 'CURTO') goalProb += 0.015;
            if (currentInstructions.passing === 'LONGO') goalProb += 0.025;
            if (currentInstructions.tempo === 'VELOZ') goalProb += 0.03;
            if (currentInstructions.tempo === 'LENTO') goalProb -= 0.015;
            if (currentInstructions.pressing === 'ALTA') goalProb += 0.02;
            if (currentInstructions.pressing === 'BAIXA') goalProb -= 0.01;
         }
         goalProb = Math.min(0.55, Math.max(0.08, goalProb));
         
         if (Math.random() < goalProb) {
            const scorer = pickRandomLineupPlayer(attackingTeam);
            if (!scorer) return;
            const assister = maybePickAssistant(attackingTeam, scorer?.name);

            if (isHomeAttacking) setHomeScore(s => s + 1);
            else setAwayScore(s => s + 1);

            const goalText = assister
               ? `GOOOL! ${scorer.name} marcou com assistência de ${assister.name}!`
               : `GOOOL! ${scorer.name} balança as redes!`;

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
            toast.success(`GOL DO ${attackingTeam.shortName.toUpperCase()}!`, { icon: '⚽' });
            setStats(s => ({ ...s, momentum: 50 })); 
            setIsGoalAnimation(true);
            setTimeout(() => setIsGoalAnimation(false), 3000);
            impactHeavy();
         }
      }

      if (Math.random() < 0.2) {
         setIsDanger(true);
         setDangerTeamId(attackingTeam.id);
         impactLight();
         setTimeout(() => setIsDanger(false), 3000);
      }
   };

   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      const isActiveGame = ['1H', '2H', 'ET1', 'ET2'].includes(gameState);

      if (!isPaused && isActiveGame) {
         const intervalTime = speed === 1 ? 1200 : (speed === 10 ? 250 : 60);
         interval = setInterval(() => {
            setMinute(m => {
               const nextMinute = m + 1;

               if (gameState === '1H' && nextMinute > 45 + stoppageTime) {
                  setGameState('HT');
                  setIsPaused(true);
                  addNarration("INTERVALO DE PARTIDA", 'event');
                  return 45;
               }

               if (gameState === '2H' && nextMinute > 90 + stoppageTime) {
                  if (isKnockout && homeScore === awayScore) {
                     setGameState('ET_INT');
                     setIsPaused(true);
                     addNarration("PRORROGAÇÃO CONFIRMADA!", 'event');
                     return 90;
                  } else {
                     setGameState('FT');
                     setIsFinished(true);
                     setIsPaused(true);
                     addNarration("FIM DE JOGO!", 'event');
                     hapticNotificationSuccess();
                     return 90;
                  }
               }

               if (gameState === 'ET1' && nextMinute > 105) {
                  setGameState('ET2');
                  setIsPaused(true);
                  addNarration("INTERVALO DA PRORROGAÇÃO", 'event');
                  return 105;
               }

               if (gameState === 'ET2' && nextMinute > 120) {
                  if (homeScore === awayScore) {
                     setGameState('PK');
                     setIsPaused(true);
                     addNarration("DECISÃO NOS PÊNALTIS!", 'event');
                     return 120;
                  }
                  setGameState('FT');
                  setIsFinished(true);
                  setIsPaused(true);
                  addNarration("FIM DE JOGO!", 'event');
                  hapticNotificationSuccess();
                  return 120;
               }

               let shift = (Math.random() * 22 - 11);
               shift += formationBias.attack * 0.18;
               shift += formationBias.control * 0.2;
               shift -= Math.max(0, formationBias.defense) * 0.08;
               if (currentStyle === 'Ultra-Defensivo') shift -= 4;
               if (currentStyle === 'Defensivo') shift -= 2;
               if (currentStyle === 'Ofensivo') shift += 3;
               if (currentStyle === 'Tudo-ou-Nada') shift += 6;
               if (currentInstructions.pressing === 'ALTA') shift += 3;
               if (currentInstructions.pressing === 'BAIXA') shift -= 2;
               if (currentInstructions.tempo === 'VELOZ') shift += 2;
               if (currentInstructions.tempo === 'LENTO') shift -= 2;
               if (currentInstructions.passing === 'CURTO') shift += 1;
               if (currentInstructions.passing === 'LONGO') shift += 1.5;
               const newMomentum = Math.min(95, Math.max(5, stats.momentum + shift));

               setStats(prev => ({
                  ...prev,
                  momentum: newMomentum,
                  possession: Math.round(prev.possession * 0.96 + (newMomentum * 0.04))
               }));

               getStochasticEvent(newMomentum);
               return nextMinute;
            });
         }, intervalTime);
      }
      return () => clearInterval(interval);
   }, [gameState, isPaused, speed, stats.momentum, currentStyle, currentFormation, currentInstructions, formationBias, isKnockout, homeScore, awayScore]);

   useEffect(() => {
      if (gameState !== 'PK' || isFinished || pkResults.home.length + pkResults.away.length > 0) return;
      const timeout = setTimeout(() => handlePenaltyKick('center'), 900);
      return () => clearTimeout(timeout);
   }, [gameState, isFinished, pkResults.home.length, pkResults.away.length]);

   const handleSubstitution = (outId: string, inId: string) => {
      setHomeTeam(prev => ({ ...prev, lineup: prev.lineup.map(id => id === outId ? inId : id) }));
      setShowSubModal(false);
      setSelectedSubOut(null);
      const pIn = homeTeam.roster.find(p => p.id === inId);
      const pOut = homeTeam.roster.find(p => p.id === outId);
      addNarration(`TROCA: Entra ${pIn?.name}, sai ${pOut?.name}`, 'event', homeTeam.id);
   };

   const handlePenaltyKick = (corner: 'left' | 'center' | 'right') => {
      const isHomeTurn = pkTurn === 'HOME';
      const keeperCorner = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
      let scored = Math.random() < 0.75;
      if (corner === keeperCorner && scored) { if (Math.random() < 0.65) scored = false; }

      const result = scored ? 1 : 2;
      const nextHome = isHomeTurn ? [...pkResults.home, result] : pkResults.home;
      const nextAway = isHomeTurn ? pkResults.away : [...pkResults.away, result];
      setPkResults({ home: nextHome, away: nextAway });
      
      const msg = scored ? "GOL!" : "DEFENDEU!";
      setPkMessage(msg);
      addNarration(`PÊNALTI ${isHomeTurn ? homeTeam.shortName : initialAwayTeam.shortName}: ${msg}`, scored ? 'goal' : 'event', isHomeTurn ? homeTeam.id : initialAwayTeam.id, 120);

      const hGoals = nextHome.filter(r => r === 1).length;
      const aGoals = nextAway.filter(r => r === 1).length;
      const hTaken = nextHome.length;
      const aTaken = nextAway.length;
      const hRemaining = Math.max(0, 5 - hTaken);
      const aRemaining = Math.max(0, 5 - aTaken);
      const shootoutComplete =
         hGoals > aGoals + aRemaining ||
         aGoals > hGoals + hRemaining ||
         (hTaken >= 5 && aTaken >= 5 && hGoals !== aGoals);

      if (shootoutComplete) {
         setGameState('FT');
         setIsFinished(true);
         setIsPaused(true);
         addNarration(`FIM NOS PÊNALTIS! ${homeTeam.shortName} ${hGoals} x ${aGoals} ${initialAwayTeam.shortName}`, 'event', undefined, 120);
         hapticNotificationSuccess();
         return;
      }

      if (isHomeTurn) {
         setPkTurn('AWAY');
         setTimeout(() => handlePenaltyKick('center'), 1000);
      } else {
         setPkTurn('HOME');
         setPkIndex(prev => prev + 1);
      }
   };

   const handleResumeMatch = () => {
      impactMedium();
      if (gameState === 'HT') {
         setGameState('2H');
         addNarration("COMEÇA O SEGUNDO TEMPO", 'event');
         setIsPaused(false);
         return;
      }
      if (gameState === 'ET_INT') {
         setGameState('ET1');
         addNarration("COMEÇA A PRORROGAÇÃO", 'event');
         setIsPaused(false);
         return;
      }
      if (gameState === 'ET2' || gameState === 'PK' || gameState === 'FT') return;
      setIsPaused(!isPaused);
   };

   return (
      <div className="flex flex-col h-screen bg-[#020617] text-white relative font-sans overflow-hidden">
         
         {/* TV STYLE HEADER (PHASE 3) */}
         <header className="px-6 py-4 pt-12 flex justify-between items-center z-50">
            <div className="flex items-center gap-3">
               <div className={clsx(
                  "h-2 w-2 rounded-full",
                  isPaused ? "bg-white/20" : "bg-primary animate-pulse shadow-[0_0_8px_rgba(31,177,133,0.8)]"
               )} />
               <span className="ui-label-caps text-[9px] text-white opacity-60 tracking-[0.2em]">{wcPhase || `Rodada ${round}`}</span>
            </div>
            
            {/* CENTRAL SCOREBOARD (GLASS-PREMIUM) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/[0.03] backdrop-blur-3xl px-1.5 py-1 rounded-[1.5rem] border border-white/10 shadow-2xl">
               <div className="flex items-center gap-4 px-4 py-2.5 border-r border-white/5">
                  <TeamLogo team={homeTeam} size="xs" />
                  <span className="text-2xl font-black tabular-nums tracking-tighter">{homeScore}</span>
               </div>
               <div className="px-5 py-2 flex flex-col items-center min-w-[85px] bg-white/[0.02] mx-1 rounded-xl">
                  <span className={clsx(
                     "text-sm font-black italic tracking-tighter leading-none transition-colors",
                     isPaused ? "text-white/40" : "text-primary"
                  )}>
                     {minute === 45 || minute === 90 || minute === 105 || minute === 120 ? `${minute}'+${stoppageTime}` : `${minute}'`}
                  </span>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{gameState}</span>
               </div>
               <div className="flex items-center gap-4 px-4 py-2.5 border-l border-white/5">
                  <span className="text-2xl font-black tabular-nums tracking-tighter">{awayScore}</span>
                  <TeamLogo team={initialAwayTeam} size="xs" />
               </div>
            </div>

            <div className="flex gap-3">
               <button 
                  onClick={() => { hapticSelection(); setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1)); }} 
                  className="ui-label-caps text-[9px] bg-white/5 px-4 py-2 rounded-full border border-white/10 active:scale-90 transition-all"
               >
                  {speed}X
               </button>
            </div>
         </header>

         <main className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
            
            {/* CRITICAL PULSE CARD (STANDARDIZED) */}
            <section className={clsx(
               "ui-card-premium p-6 border transition-all duration-700 relative overflow-hidden",
               matchPulse.tone === 'primary' ? "border-primary/20 bg-primary/5" :
               matchPulse.tone === 'danger' ? "border-rose-500/20 bg-rose-500/5 shadow-[0_0_30px_rgba(244,63,94,0.05)]" : "border-white/5"
            )}>
               {/* Ambient Glow */}
               <div className={clsx(
                  "absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-20",
                  matchPulse.tone === 'primary' ? "bg-primary" :
                  matchPulse.tone === 'danger' ? "bg-rose-500" : "bg-white/5"
               )} />

               <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="ui-label-caps text-[9px]">Status em Tempo Real</span>
                  <div className="flex gap-1.5">
                     {[0, 1, 2].map(i => (
                        <div key={i} className={clsx(
                           "h-1 w-5 rounded-full transition-all duration-500", 
                           matchPulse.tone === 'primary' ? (i === 0 ? "bg-primary w-8" : "bg-primary/20") : 
                           matchPulse.tone === 'danger' ? (i === 2 ? "bg-rose-500 w-8" : "bg-rose-500/20") : "bg-white/10"
                        )} />
                     ))}
                  </div>
               </div>
               <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2 relative z-10">{matchPulse.title}</h3>
               <p className="text-[12px] text-secondary font-medium leading-relaxed opacity-80 relative z-10">{matchPulse.copy}</p>
            </section>



            {/* LIVE COMMENTARY FEED (CINEMATIC FULL) */}
            <div 
               ref={feedRef}
               className="flex-1 ui-card-premium p-6 overflow-y-auto no-scrollbar space-y-5 border-white/5 bg-white/[0.01] shadow-[inset_0_20px_40px_rgba(0,0,0,0.4)] flex flex-col items-center"
            >
               {feed.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6">
                     <Timer size={64} className="animate-pulse" />
                     <span className="ui-label-caps text-xs tracking-[0.5em]">Escalando Times</span>
                  </div>
               )}
               <AnimatePresence>
                  {feed.map((msg, i) => (
                     <motion.div 
                        key={`${i}-${msg.minute}`}
                        initial={{ opacity: 0, x: -10, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        className={clsx(
                           "relative overflow-hidden transition-all duration-500",
                           msg.type === 'goal' ? "ui-card-premium bg-emerald-500/10 border-emerald-500/20 p-8 shadow-[0_0_50px_rgba(31,177,133,0.15)] text-center my-8" :
                           msg.type === 'danger' ? "bg-rose-500/5 border border-rose-500/10 px-6 py-4 rounded-[2rem]" : "px-3"
                        )}
                     >
                        <div className={clsx(
                           "flex w-full max-w-lg mx-auto",
                           msg.type === 'goal' ? "flex-col items-center gap-5 text-center" : "gap-6 items-start"
                        )}>
                           {msg.type === 'goal' && <div className="ui-label-caps bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20">GOL</div>}
                           
                           <span className={clsx(
                              "text-[10px] font-black text-white/30 tabular-nums uppercase tracking-widest",
                              msg.type === 'goal' ? "order-2" : "mt-1.5"
                           )}>
                              {msg.minute}'
                           </span>
                           
                           <p className={clsx(
                              "leading-relaxed tracking-tight",
                              msg.type === 'goal' ? "text-3xl font-black italic uppercase leading-none text-white drop-shadow-2xl" :
                              msg.type === 'danger' ? "text-rose-200 font-bold text-sm" : "text-secondary font-medium text-[13.5px]"
                           )}>
                              {msg.text}
                           </p>

                           {msg.type === 'event' && <div className="h-1.5 w-1.5 rounded-full bg-white/20 mt-3" />}
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </main>

         {/* MATCH ACTION BAR (PHASE 3: MODERNA) */}
         <footer className="p-6 bg-slate-950/80 backdrop-blur-3xl border-t border-white/5 pb-12 relative z-40">
            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { hapticSelection(); setIsPaused(true); setShowTacticsModal(true); }} 
                  className="flex flex-col items-center justify-center gap-2 py-5 bg-white/[0.03] rounded-3xl border border-white/10 hover:bg-white/[0.08] transition-all group"
               >
                  <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <Target size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Estratégia</span>
               </motion.button>

               <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { hapticSelection(); setIsPaused(true); setShowSubModal(true); }} 
                  className="flex flex-col items-center justify-center gap-2 py-5 bg-white/[0.03] rounded-3xl border border-white/10 hover:bg-white/[0.08] transition-all group"
               >
                  <div className="h-10 w-10 bg-emerald-400/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                     <ArrowRightLeft size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Substituir</span>
               </motion.button>
            </div>

            {/* Main Play/Pause Button */}
            <motion.button 
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.97 }}
               onClick={handleResumeMatch}
               className={clsx(
                  "w-full h-18 rounded-[2.25rem] flex items-center justify-center gap-4 shadow-2xl transition-all relative overflow-hidden group",
                  isPaused ? "bg-white text-black" : "bg-white/5 text-white border border-white/10"
               )}
            >
               {isPaused && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent animate-shimmer" />}
               
               <div className={clsx(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                  isPaused ? "bg-black/10" : "bg-white/10 text-white"
               )}>
                  {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
               </div>
               
               <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">
                  {gameState === 'HT' ? 'Iniciar 2º Tempo' : 
                   gameState === 'ET_INT' ? 'Iniciar Prorrogação' : 
                   isPaused ? 'Retomar Combate' : 'Pausar Simulação'}
               </span>
            </motion.button>
         </footer>

         {/* PENALTY SHOOTOUT OVERLAY (CINEMATIC) */}
         <AnimatePresence>
            {gameState === 'PK' && !isFinished && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
               >
                  <div className="w-full max-w-sm flex flex-col items-center gap-12">
                     <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-rose-500/10 rounded-full border border-rose-500/20 flex items-center justify-center text-rose-500 mb-2 animate-pulse">
                           <Target size={32} />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Pênaltis</h2>
                        <span className="ui-label-caps text-secondary opacity-60 text-center px-4">{pkMessage}</span>
                     </div>

                     <div className="w-full flex justify-between items-center px-4">
                        <div className="flex flex-col items-center gap-3">
                           <TeamLogo team={homeTeam} size="lg" />
                           <div className="flex gap-1.5">
                              {Array.from({ length: Math.max(5, pkResults.home.length) }).map((_, i) => (
                                 <div key={i} className={clsx(
                                    "h-2.5 w-2.5 rounded-full border border-white/10",
                                    pkResults.home[i] === 1 ? "bg-primary border-primary shadow-[0_0_8px_rgba(31,177,133,0.5)]" :
                                    pkResults.home[i] === 2 ? "bg-rose-500 border-rose-500" : "bg-white/5"
                                 )} />
                              ))}
                           </div>
                           <span className="text-4xl font-black italic mt-2">{penaltyScore.home}</span>
                        </div>

                        <div className="text-white/10 font-black text-3xl">VS</div>

                        <div className="flex flex-col items-center gap-3">
                           <TeamLogo team={initialAwayTeam} size="lg" />
                           <div className="flex gap-1.5">
                              {Array.from({ length: Math.max(5, pkResults.away.length) }).map((_, i) => (
                                 <div key={i} className={clsx(
                                    "h-2.5 w-2.5 rounded-full border border-white/10",
                                    pkResults.away[i] === 1 ? "bg-primary border-primary shadow-[0_0_8px_rgba(31,177,133,0.5)]" :
                                    pkResults.away[i] === 2 ? "bg-rose-500 border-rose-500" : "bg-white/5"
                                 )} />
                              ))}
                           </div>
                           <span className="text-4xl font-black italic mt-2">{penaltyScore.away}</span>
                        </div>
                     </div>

                     <div className="w-full space-y-4">
                        <span className="ui-label-caps text-[9px] block text-center opacity-40">Escolha o canto do chute</span>
                        <div className="grid grid-cols-3 gap-3">
                           {['left', 'center', 'right'].map((corner) => (
                              <button
                                 key={corner}
                                 onClick={() => { hapticSelection(); handlePenaltyKick(corner as any); }}
                                 disabled={pkTurn !== 'HOME'}
                                 className={clsx(
                                    "py-6 rounded-3xl border transition-all flex items-center justify-center bg-white/5 border-white/10 active:scale-95",
                                    pkTurn !== 'HOME' && "opacity-20 pointer-events-none"
                                 )}
                              >
                                 <div className={clsx(
                                    "h-3 w-3 rounded-full bg-white/40",
                                    corner === 'left' ? "mr-auto ml-4" : corner === 'right' ? "ml-auto mr-4" : ""
                                 )} />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* POST-MATCH MODAL (CINEMATIC) */}
         <AnimatePresence>
            {isFinished && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-4xl flex items-center justify-center p-8 overflow-y-auto"
               >
                  <motion.div 
                     initial={{ scale: 0.9, y: 30 }}
                     animate={{ scale: 1, y: 0 }}
                     className="w-full max-w-sm flex flex-col items-center gap-12 py-12"
                  >
                     <div className="flex flex-col items-center gap-4 text-center">
                        <div className="h-20 w-20 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary mb-2 shadow-[0_0_40px_rgba(31,177,133,0.1)]">
                           <Trophy size={40} className="animate-float" />
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Placar Final</h2>
                        <span className="ui-label-caps text-secondary opacity-40">O apito final soou</span>
                     </div>

                     <div className="w-full ui-card-premium p-10 border-white/10 bg-white/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        
                        <div className="flex items-center justify-between relative z-10">
                           <div className="flex flex-col items-center gap-6 flex-1">
                              <div className="relative">
                                 <div className={clsx(
                                    "absolute inset-0 blur-2xl rounded-full opacity-60",
                                    homeScore >= awayScore ? "bg-primary/20" : "bg-transparent"
                                 )} />
                                 <TeamLogo team={homeTeam} size="xl" className="relative z-10" />
                              </div>
                              <span className="text-6xl font-black italic tracking-tighter tabular-nums">{homeScore}</span>
                           </div>
                           
                           <div className="flex flex-col items-center gap-2 px-4">
                              <span className="text-white/10 font-black text-3xl italic">VS</span>
                              <div className="h-10 w-[1px] bg-white/5" />
                           </div>

                           <div className="flex flex-col items-center gap-6 flex-1">
                              <div className="relative">
                                 <div className={clsx(
                                    "absolute inset-0 blur-2xl rounded-full opacity-60",
                                    awayScore >= homeScore ? "bg-primary/20" : "bg-transparent"
                                 )} />
                                 <TeamLogo team={initialAwayTeam} size="xl" className="relative z-10" />
                              </div>
                              <span className="text-6xl font-black italic tracking-tighter tabular-nums">{awayScore}</span>
                           </div>
                        </div>

                        {/* Penalty Sub-score (Standardized) */}
                        {(penaltyScore.home > 0 || penaltyScore.away > 0) && (
                           <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
                              <span className="ui-label-caps text-[9px] opacity-40 tracking-[0.5em]">Disputa por Pênaltis</span>
                              <div className="text-3xl font-black italic flex items-center gap-6">
                                 <span>{penaltyScore.home}</span>
                                 <div className="h-1 w-1 rounded-full bg-white/10" />
                                 <span>{penaltyScore.away}</span>
                              </div>
                           </div>
                        )}
                        
                        {/* Match Stats Mini-Summary */}
                        <div className="mt-10 grid grid-cols-2 gap-4">
                           <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                              <span className="ui-label-caps text-[8px] block mb-1 opacity-30">Chutes</span>
                              <span className="text-lg font-black italic tabular-nums">{stats.homeShots} - {stats.awayShots}</span>
                           </div>
                           <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                              <span className="ui-label-caps text-[8px] block mb-1 opacity-30">Posse</span>
                              <span className="text-lg font-black italic tabular-nums">{stats.possession}% - {100 - stats.possession}%</span>
                           </div>
                        </div>
                     </div>

                     <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                           hapticSelection();
                           const commentary = feed.map(f => ({ minute: f.minute, type: 'commentary', description: f.text }));
                           onFinish(homeScore, awayScore, [...matchEvents, ...commentary.slice(-5)], penaltyScore.home || undefined, penaltyScore.away || undefined);
                        }}
                        className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
                     >
                        Prosseguir
                     </motion.button>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* TACTICS OVERLAY (CINEMATIC) */}
         <AnimatePresence>
            {showTacticsModal && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
               >
                  <motion.div 
                     initial={{ scale: 0.95, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="w-full max-w-sm space-y-12"
                  >
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-1">Estratégia</h3>
                           <span className="ui-label-caps text-[9px]">Comando do Vestiário</span>
                        </div>
                        <button 
                           onClick={() => setShowTacticsModal(false)} 
                           className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all"
                        >
                           <X size={20} />
                        </button>
                     </div>
                     
                     <div className="space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar pr-1 px-1">
                        <section className="space-y-4">
                           <span className="ui-label-caps text-[9px] opacity-40">Mentalidade</span>
                           <div className="grid grid-cols-2 gap-3">
                              {['Ultra-Defensivo', 'Defensivo', 'Equilibrado', 'Ofensivo', 'Tudo-ou-Nada'].map(s => (
                                 <button 
                                    key={s} 
                                    onClick={() => { hapticSelection(); setCurrentStyle(s as any); }}
                                    className={clsx(
                                       "py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                       currentStyle === s ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white/5 border-white/5 text-secondary"
                                    )}
                                 >
                                    {s}
                                 </button>
                              ))}
                           </div>
                        </section>

                        <section className="space-y-4">
                           <span className="ui-label-caps text-[9px] opacity-40">Estrutura (Formação)</span>
                           <div className="grid grid-cols-3 gap-3">
                              {MATCH_FORMATIONS.map(formation => (
                                 <button
                                    key={formation}
                                    onClick={() => { hapticSelection(); setCurrentFormation(formation); }}
                                    className={clsx(
                                       "py-4 rounded-xl text-[9px] font-black uppercase border transition-all",
                                       currentFormation === formation ? "bg-white text-black border-white shadow-xl" : "bg-white/5 border-white/5 text-secondary"
                                    )}
                                 >
                                    {formation}
                                 </button>
                              ))}
                           </div>
                        </section>

                        <section className="space-y-5">
                           <span className="ui-label-caps text-[9px] opacity-40">Instruções Pragmáticas</span>
                           <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-2">
                                 {(['BAIXA', 'MEDIA', 'ALTA'] as const).map(pressing => (
                                    <button
                                       key={pressing}
                                       onClick={() => { hapticSelection(); setCurrentInstructions(prev => ({ ...prev, pressing })); }}
                                       className={clsx(
                                          "py-3.5 rounded-2xl text-[9px] font-black uppercase border transition-all",
                                          currentInstructions.pressing === pressing ? "bg-sky-500 border-sky-400 text-white" : "bg-white/5 border-white/5 text-secondary"
                                       )}
                                    >
                                       {pressing}
                                    </button>
                                 ))}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                 {(['CURTO', 'MISTO', 'LONGO'] as const).map(passing => (
                                    <button
                                       key={passing}
                                       onClick={() => { hapticSelection(); setCurrentInstructions(prev => ({ ...prev, passing })); }}
                                       className={clsx(
                                          "py-3.5 rounded-2xl text-[9px] font-black uppercase border transition-all",
                                          currentInstructions.passing === passing ? "bg-violet-500 border-violet-400 text-white" : "bg-white/5 border-white/5 text-secondary"
                                       )}
                                    >
                                       {passing}
                                    </button>
                                 ))}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                 {(['LENTO', 'PADRAO', 'VELOZ'] as const).map(tempo => (
                                    <button
                                       key={tempo}
                                       onClick={() => { hapticSelection(); setCurrentInstructions(prev => ({ ...prev, tempo })); }}
                                       className={clsx(
                                          "py-3.5 rounded-2xl text-[9px] font-black uppercase border transition-all",
                                          currentInstructions.tempo === tempo ? "bg-amber-500 border-amber-400 text-white" : "bg-white/5 border-white/5 text-secondary"
                                       )}
                                    >
                                       {tempo}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </section>
                     </div>

                     <button 
                        onClick={() => {
                           impactMedium();
                           setHomeTeam(prev => ({ ...prev, style: currentStyle, formation: currentFormation, instructions: currentInstructions }));
                           addNarration(`AJUSTE TÁTICO: ${currentFormation} • ${currentStyle}`, 'event', homeTeam.id);
                           setShowTacticsModal(false);
                           setIsPaused(false);
                        }}
                        className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-primary/20 active:scale-95 transition-all"
                     >
                        Confirmar Plano
                     </button>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* SUBSTITUTIONS OVERLAY (CINEMATIC) */}
         <AnimatePresence>
            {showSubModal && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
               >
                  <motion.div 
                     initial={{ scale: 0.95, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="w-full max-w-sm space-y-10"
                  >
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-1">Substituições</h3>
                           <span className="ui-label-caps text-[9px]">Oxigênio para o Time</span>
                        </div>
                        <button 
                           onClick={() => { setShowSubModal(false); setSelectedSubOut(null); }} 
                           className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all"
                        >
                           <X size={20} />
                        </button>
                     </div>

                     <div className="space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar px-1">
                        {!selectedSubOut ? (
                           <section className="space-y-4">
                              <span className="ui-label-caps text-[9px] opacity-40">Quem sai da partida?</span>
                              <div className="grid grid-cols-1 gap-2">
                                 {homeTeam.roster.filter(p => homeTeam.lineup.includes(p.id)).map(player => (
                                    <button
                                       key={player.id}
                                       onClick={() => { hapticSelection(); setSelectedSubOut(player.id); }}
                                       className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                                    >
                                       <div className="flex flex-col items-start">
                                          <span className="text-[12px] font-black uppercase tracking-tight text-white">{player.name}</span>
                                          <span className="text-[9px] font-bold text-secondary flex items-center gap-2 mt-0.5">
                                             <Sparkles size={10} className="text-amber-400" />
                                             OVR {player.overall} • {player.position}
                                          </span>
                                       </div>
                                       <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                          <TrendingDown size={14} />
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </section>
                        ) : (
                           <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                              <div className="flex items-center gap-3 mb-6">
                                 <button onClick={() => setSelectedSubOut(null)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center"><ArrowRightLeft size={14} className="rotate-180" /></button>
                                 <span className="ui-label-caps text-[9px] opacity-40">Quem entra no lugar?</span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                 {homeTeam.roster.filter(p => !homeTeam.lineup.includes(p.id)).map(player => (
                                    <button
                                       key={player.id}
                                       onClick={() => { hapticSelection(); handleSubstitution(selectedSubOut, player.id); }}
                                       className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl hover:bg-primary/20 transition-all group"
                                    >
                                       <div className="flex flex-col items-start">
                                          <span className="text-[12px] font-black uppercase tracking-tight text-white">{player.name}</span>
                                          <span className="text-[9px] font-bold text-secondary flex items-center gap-2 mt-0.5">
                                             <Zap size={10} className="text-primary" />
                                             OVR {player.overall} • {player.position}
                                          </span>
                                       </div>
                                       <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-primary group-hover:text-white transition-all">
                                          <TrendingUp size={14} />
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </section>
                        )}
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
