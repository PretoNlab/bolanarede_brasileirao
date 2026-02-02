
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Briefcase, Users, Play, ChevronRight, Trophy, TrendingUp } from 'lucide-react';

interface OnboardingModalProps {
    onComplete: () => void;
}

const SLIDES = [
    {
        title: "Seja Bem-Vindo, Treinador!",
        description: "O conselho de administração confiou a você o destino do clube. O objetivo é simples: vencer, evoluir e evitar a demissão.",
        icon: <Briefcase className="text-primary" size={48} />,
        color: "from-blue-500/20 to-transparent"
    },
    {
        title: "Gerencie seu Elenco",
        description: "Fique de olho na energia e moral dos jogadores. Renove contratos e busque reforços no mercado para manter a competitividade.",
        icon: <Users className="text-emerald-400" size={48} />,
        color: "from-emerald-500/20 to-transparent"
    },
    {
        title: "Domine a Tática",
        description: "Durante a partida, use o 'Momentum' a seu favor. Grite com o time, mude a mentalidade e faça substituições no momento certo.",
        icon: <TrendingUp className="text-yellow-400" size={48} />,
        color: "from-yellow-500/20 to-transparent"
    },
    {
        title: "Rumo à Glória",
        description: "Vença copas, suba de divisão e torne-se uma lenda no Bola na Rede Manager. O vestiário está esperando por você!",
        icon: <Trophy className="text-amber-500" size={48} />,
        color: "from-amber-500/20 to-transparent"
    }
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const next = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const slide = SLIDES[currentSlide];

    return (
        <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className={clsx(
                "w-full max-w-sm bg-surface border border-white/5 rounded-[48px] p-8 flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden transition-all duration-700 bg-gradient-to-b",
                slide.color
            )}>
                {/* Progress dots */}
                <div className="flex gap-2">
                    {SLIDES.map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "h-1.5 rounded-full transition-all duration-300",
                                i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 animate-in zoom-in duration-500">
                    {slide.icon}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">
                        {slide.title}
                    </h2>
                    <p className="text-sm font-medium text-white/50 leading-relaxed px-4">
                        {slide.description}
                    </p>
                </div>

                <button
                    onClick={next}
                    className="w-full h-18 bg-white text-slate-900 rounded-[32px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all text-xs shadow-xl"
                >
                    {currentSlide === SLIDES.length - 1 ? (
                        <>VAMOS AO JOGO <Play size={18} fill="currentColor" /></>
                    ) : (
                        <>PRÓXIMO <ChevronRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
    );
}
