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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 p-5 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-surface p-7 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Shirt size={28} />
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
            Carreira criada
          </span>
        </div>

        <div className="mt-7">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">Seu primeiro desafio</p>
          <h2 className="mt-3 text-[30px] font-black leading-[1.05] text-white">Você assumiu o {teamName}.</h2>
          <p className="mt-4 text-[14px] leading-7 text-white/68">
            A estreia será contra o {nextOpponentName}. Você pode entrar direto na preparação ou conhecer o clube antes.
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/8 bg-background/35 p-4">
          <Target className="mt-0.5 shrink-0 text-amber-300" size={18} />
          <p className="text-[13px] leading-6 text-white/72">
            Na pré-partida ainda é possível revisar elenco e tática antes de entrar em campo.
          </p>
        </div>

        <div className="mt-7 grid gap-3">
          <button
            onClick={onPlay}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Play size={18} fill="currentColor" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em]">Preparar primeira partida</span>
          </button>
          <button
            onClick={onComplete}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-white/72 transition-all active:scale-[0.98]"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.18em]">Ver painel do clube</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
