
import React, { useState } from 'react';
import { ArrowRight, User, Brain, Briefcase, Zap, Shield, Check, Trophy, Sparkles } from 'lucide-react';
import { Coach } from '../types';
import clsx from 'clsx';
import toast from 'react-hot-toast';

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
        color: 'bg-amber-500'
    },
    {
        id: 'Tático',
        label: 'Tático',
        emoji: '🧠',
        description: 'Bônus defensivo.',
        color: 'bg-blue-500'
    },
    {
        id: 'Negociador',
        label: 'Negociador',
        emoji: '💰',
        description: 'Melhores contratos.',
        color: 'bg-emerald-500'
    },
    {
        id: 'Disciplinador',
        label: 'Disciplinador',
        emoji: '🛡️',
        description: 'Menos cartões.',
        color: 'bg-rose-500'
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

            {/* Header: Progress Bar */}
            <div className="px-6 pt-12 pb-4">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center px-6 pt-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 key={step}">

                {/* STEP 0: INTRO */}
                {step === 0 && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center mb-4 relative">
                            <Sparkles size={80} className="text-yellow-400 animate-pulse" />
                            <div className="absolute bottom-0 right-0 text-6xl">⚽</div>
                        </div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Bem-vindo, Professor!</h1>
                        <div className="bg-surface p-6 rounded-3xl border-2 border-white/10 relative mt-4">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-surface rotate-45 border-t-2 border-l-2 border-white/10"></div>
                            <p className="text-lg font-medium text-secondary">
                                "O clube precisa de um novo líder. Alguém com visão, coragem e estilo. É você que estamos procurando?"
                            </p>
                        </div>
                    </div>
                )}

                {/* STEP 1: NAME */}
                {step === 1 && (
                    <div className="w-full max-w-sm space-y-8">
                        <h2 className="text-2xl font-black uppercase text-center">Como a imprensa deve te chamar?</h2>

                        <div className="relative">
                            <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center mb-6 border-4 border-white/5">
                                <User size={40} className="text-emerald-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu Nome"
                                className="w-full bg-transparent border-b-2 border-white/20 p-4 text-center text-3xl font-black outline-none focus:border-emerald-500 transition-all placeholder:text-white/10"
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: STYLE (Cards) */}
                {step === 2 && (
                    <div className="w-full max-w-xs space-y-6">
                        <h2 className="text-xl font-black uppercase text-center mb-2">Qual seu estilo de jogo?</h2>

                        <div className="grid grid-cols-1 gap-3">
                            {STYLES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStyle(s.id)}
                                    className={clsx(
                                        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-95 group",
                                        selectedStyle === s.id
                                            ? `bg-surface ${s.color} border-transparent text-white shadow-xl scale-105`
                                            : "bg-surface border-white/5 hover:border-white/20 text-secondary"
                                    )}
                                >
                                    <span className="text-3xl">{s.emoji}</span>
                                    <div className="text-left flex-1">
                                        <h3 className="font-black uppercase text-sm">{s.label}</h3>
                                        <p className={clsx("text-xs opacity-80", selectedStyle === s.id ? "text-white" : "text-secondary")}>{s.description}</p>
                                    </div>
                                    {selectedStyle === s.id && <Check size={20} className="ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS */}
                {step === 3 && (
                    <div className="flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
                            <Trophy size={100} className="text-yellow-400 relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black italic uppercase text-emerald-400 mb-2">Tudo Pronto!</h1>
                            <p className="text-xl text-white">Contrato assinado, <span className="text-emerald-400 font-bold">{name}</span>.</p>
                        </div>
                        <div className="bg-surface/50 p-6 rounded-3xl border border-white/5 max-w-xs">
                            <p className="text-sm text-secondary">A diretoria e a torcida estão ansiosas. Escolha seu time e mostre serviço!</p>
                        </div>
                    </div>
                )}

            </main>

            {/* Footer: Action Button */}
            <footer className="fixed bottom-0 inset-x-0 p-6 bg-background/90 backdrop-blur-lg border-t border-white/5 z-50">
                <button
                    onClick={handleNext}
                    className={clsx(
                        "w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                        step === 3
                            ? "bg-yellow-400 text-black shadow-yellow-400/20 hover:bg-yellow-300"
                            : "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-400"
                    )}
                >
                    {step === 3 ? "COMEÇAR CARREIRA" : step === 0 ? "VAMOS LÁ" : "CONTINUAR"}
                    {step !== 3 && <ArrowRight size={20} />}
                </button>
            </footer>

        </div>
    );
}
