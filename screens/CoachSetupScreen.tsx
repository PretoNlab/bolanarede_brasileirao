
import React, { useState } from 'react';
import { ArrowRight, User, Brain, Briefcase, Zap, Shield, Check, Trophy, Sparkles, UserCircle } from 'lucide-react';
import { Coach } from '../types';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onComplete: (coach: Coach) => void;
    onBack: () => void;
}

const STYLES = [
    {
        id: 'Motivador',
        label: 'Motivador',
        emoji: '🔥',
        description: 'Recupera moral rápido.',
        color: 'bg-amber-500',
        text: 'text-amber-500'
    },
    {
        id: 'Tático',
        label: 'Tático',
        emoji: '🧠',
        description: 'Bônus defensivo.',
        color: 'bg-blue-500',
        text: 'text-blue-500'
    },
    {
        id: 'Negociador',
        label: 'Negociador',
        emoji: '💰',
        description: 'Melhores contratos.',
        color: 'bg-emerald-500',
        text: 'text-emerald-500'
    },
    {
        id: 'Disciplinador',
        label: 'Disciplinador',
        emoji: '🛡️',
        description: 'Menos cartões.',
        color: 'bg-rose-500',
        text: 'text-rose-500'
    }
];

export default function CoachSetupScreen({ onComplete, onBack }: Props) {
    const [step, setStep] = useState(0); // 0: Intro, 1: Name, 2: Style, 3: Success
    const [name, setName] = useState('');
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

    const totalSteps = 4;
    const progress = ((step + 1) / totalSteps) * 100;

    const handleNext = () => {
        if (step === 1 && !name.trim()) return toast.error("Como devemos te chamar?");
        if (step === 2 && !selectedStyle) return toast.error("Escolha um estilo!");

        if (step === 3) {
            const styleObj = STYLES.find(s => s.id === selectedStyle)!;
            onComplete({
                name,
                style: selectedStyle as any,
                bonusDescription: styleObj.description,
                personalFunds: 5000,
                items: []
            });
        } else {
            setStep(s => s + 1);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
            
            {/* Tactical Header Progress */}
            <div className="px-8 pt-16 pb-6">
                <div className="flex justify-between items-end mb-3 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary font-display">SISTEMA DE ONBOARDING</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-40 font-display">PASSO {step + 1} DE {totalSteps}</span>
                </div>
                <div className="h-1.5 bg-surface-low rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="h-full bg-primary rounded-full relative shadow-[0_0_12px_rgba(33,150,243,0.4)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </motion.div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 no-scrollbar relative">
                <AnimatePresence mode="wait">
                    {/* STEP 0: INTRO */}
                    {step === 0 && (
                        <motion.div 
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center text-center space-y-8 mt-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full"></div>
                                <div className="w-48 h-48 bg-surface-low rounded-full flex items-center justify-center border-2 border-primary/20 relative z-10 backdrop-blur-sm">
                                    <Sparkles size={80} className="text-secondary opacity-80" />
                                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl rotate-12">
                                        <span className="text-3xl">⚽</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-4xl font-bold tracking-tighter uppercase italic font-display leading-none">Bem-vindo,<br/>Professor</h1>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary font-display opacity-80">COMANDO TÁTICO HABILITADO</p>
                            </div>

                            <div className="bg-surface-low p-8 rounded-[2.5rem] border border-white/5 relative mt-6 shadow-xl max-w-sm">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-surface-low rotate-45 border-t border-l border-white/5"></div>
                                <p className="text-lg font-medium text-on-surface leading-snug italic font-display">
                                    "O clube exige um novo arquiteto para o sucesso. Alguém com visão absoluta. O terminal aguenta suas ordens?"
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: NAME */}
                    {step === 1 && (
                        <motion.div 
                            key="name"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-sm mx-auto space-y-12 mt-12"
                        >
                            <div className="space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant opacity-40 font-display block text-center">IDENTIFICAÇÃO DE COMANDO</span>
                                <h2 className="text-2xl font-bold uppercase tracking-tighter font-display text-center italic">Como a imprensa deve te invocar?</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="w-32 h-32 mx-auto bg-surface-low rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                    <UserCircle size={64} className="text-primary opacity-60 group-focus-within:scale-110 transition-transform" />
                                </div>
                                
                                <div className="relative border-b-2 border-white/10 focus-within:border-primary transition-all pb-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="INSIRA SEU NOME"
                                        className="w-full bg-transparent p-4 text-center text-3xl font-bold font-display uppercase tracking-widest outline-none transition-all placeholder:opacity-10"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: STYLE (Cards) */}
                    {step === 2 && (
                        <motion.div 
                            key="style"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-sm mx-auto space-y-8 mt-4"
                        >
                            <div className="space-y-3 text-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant opacity-40 font-display block">PROTOCOLO FILOSÓFICO</span>
                                <h2 className="text-2xl font-bold uppercase tracking-tighter font-display italic leading-none px-4">Defina o DNA da sua Liderança</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {STYLES.map(s => (
                                    <motion.button
                                        key={s.id}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedStyle(s.id)}
                                        className={clsx(
                                            "flex items-center gap-5 p-6 rounded-[2rem] border transition-all relative overflow-hidden group",
                                            selectedStyle === s.id
                                                ? `bg-surface-highest border-white/20 shadow-2xl`
                                                : "bg-surface-low border-white/5 text-on-surface-variant"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-sm transition-all",
                                            selectedStyle === s.id ? `${s.color}/20 border-${s.color}/30 scale-110` : "bg-surface-container border-white/5 opacity-60"
                                        )}>
                                            {s.emoji}
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className={clsx(
                                                "font-bold uppercase text-xs font-display tracking-widest mb-1 transition-colors",
                                                selectedStyle === s.id ? s.text : "text-white"
                                            )}>{s.label}</h3>
                                            <p className={clsx(
                                                "text-[10px] font-bold uppercase tracking-tight opacity-40 italic",
                                                selectedStyle === s.id ? "opacity-100" : "opacity-40"
                                            )}>{s.description}</p>
                                        </div>
                                        {selectedStyle === s.id && (
                                            <div className="p-1 bg-primary/20 rounded-lg border border-primary/30">
                                                <Check size={16} className="text-primary" />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 3 && (
                        <motion.div 
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center text-center space-y-10 mt-16"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ 
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-secondary/30 blur-[4rem] opacity-40 rounded-full"
                                ></motion.div>
                                <Trophy size={120} className="text-secondary relative z-10 drop-shadow-[0_0_30px_rgba(105,246,184,0.4)]" />
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-5xl font-bold italic uppercase text-secondary font-display leading-none tracking-tighter">CONTRATO<br/>ASSINADO</h1>
                                <p className="text-base text-on-surface uppercase font-display tracking-widest font-bold">Líder Habilitado:<br/><span className="text-secondary text-2xl tracking-tighter">{name}</span></p>
                            </div>
                            
                            <div className="bg-surface-low p-6 rounded-[2rem] border border-white/5 max-w-xs shadow-xl">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant leading-relaxed italic opacity-60">A diretoria e a massa torcedora exigem resultados imediatos. O mercado está aberto. Prepare-se para o combate.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer: Action Button */}
            <footer className="fixed bottom-0 inset-x-0 p-8 pt-12 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-50">
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className={clsx(
                        "w-full h-16 rounded-[2rem] font-bold uppercase tracking-[0.3em] font-display shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group",
                        step === 3
                            ? "bg-[#1FB185] text-black shadow-[#1FB185]/20 hover:bg-[#1FB185]/90"
                            : "bg-white text-black hover:bg-white/90"
                    )}
                >
                    <span className="relative z-10">{step === 3 ? "INICIAR CARREIRA" : step === 0 ? "VAMOS LÁ" : "CONFIRMAR"}</span>
                    {step !== 3 && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </footer>

        </div>
    );
}
