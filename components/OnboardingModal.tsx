import React from 'react';
import { ArrowRight, Play, Shirt, Target } from 'lucide-react';

interface OnboardingModalProps {
  teamName: string;
  nextOpponentName: string;
  onComplete: () => void;
  onPlay: () => void;
}

export default function OnboardingModal({
  teamName,
  nextOpponentName,
  onComplete,
  onPlay,
}: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 p-4 sm:p-5 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar rounded-[32px] border border-white/10 bg-surface p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Shirt size={28} />
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            Carreira criada
          </span>
        </div>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Seu primeiro desafio</p>
          <h2 className="mt-2 text-2xl sm:text-[30px] font-black leading-tight text-white">Você assumiu o {teamName}.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            A estreia será contra o {nextOpponentName}. Você pode entrar direto na preparação ou conhecer o clube antes.
          </p>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-background/50 p-4">
          <Target className="mt-0.5 shrink-0 text-amber-300" size={20} />
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Na pré-partida ainda é possível revisar elenco e tática antes de entrar em campo.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            onClick={onPlay}
            className="flex h-14 sm:h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Play size={18} fill="currentColor" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Preparar primeira partida</span>
          </button>
          <button
            onClick={onComplete}
            className="flex h-12 sm:h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-all active:scale-[0.98]"
          >
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Ver painel do clube</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
