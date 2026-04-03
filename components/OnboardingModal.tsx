import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  ArrowRight,
  Briefcase,
  ChevronRight,
  Flag,
  Play,
  Sparkles,
  ShieldAlert,
  Target,
  Wallet
} from 'lucide-react';

interface OnboardingModalProps {
  teamName: string;
  nextOpponentName: string;
  onComplete: () => void;
}

export default function OnboardingModal({ teamName, nextOpponentName, onComplete }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: `Você assumiu o ${teamName}.`,
      eyebrow: 'Bola na Rede Manager',
      description: 'Aqui o jogo gira em torno de pressão, contexto e decisão. Você não precisa abrir tudo. Precisa ler o momento certo.',
      bullets: ['Comece pelo centro de comando', 'Olhe a próxima partida antes de agir', 'Pense em campanha, não em clique isolado'],
      icon: <Sparkles className="text-primary" size={44} />,
      color: 'from-primary/20 to-transparent',
      accent: 'Você é o técnico. O clube já está andando.'
    },
    {
      title: 'Leia primeiro o que está pegando.',
      eyebrow: 'Centro de comando',
      description: `O dashboard te mostra o que importa agora: jogo contra o ${nextOpponentName}, confiança, caixa e alertas do clube.`,
      bullets: ['Se a moral caiu, ajuste antes de jogar', 'Se o caixa apertou, evite impulso no mercado', 'Se houver alerta, resolva isso antes da rodada'],
      icon: <Briefcase className="text-blue-300" size={44} />,
      color: 'from-blue-500/20 to-transparent',
      accent: 'Prioridade boa economiza rodada ruim.'
    },
    {
      title: 'Mercado e tática servem à rodada.',
      eyebrow: 'Decisão com consequência',
      description: 'Mercado corrige elenco. Tática prepara o jogo. Caixa sustenta a campanha. Cada módulo existe para melhorar sua próxima decisão.',
      bullets: ['Use mercado para ajuste, não ansiedade', 'Mude a tática com motivo', 'Preserve caixa para reagir quando precisar'],
      icon: <Wallet className="text-emerald-400" size={44} />,
      color: 'from-emerald-500/20 to-transparent',
      accent: 'Não é manager de planilha. É leitura de momento.'
    },
    {
      title: 'A primeira meta é simples: chegar bem ao próximo jogo.',
      eyebrow: 'Primeiro passo',
      description: `Seu próximo ponto de pressão é contra o ${nextOpponentName}. Veja elenco, ajuste a ideia de jogo e entre em campo quando a leitura estiver pronta.`,
      bullets: ['Cheque energia e opções do elenco', 'Acerte o plano de jogo', 'Entre na partida com uma decisão clara'],
      icon: <Target className="text-yellow-400" size={44} />,
      color: 'from-yellow-500/20 to-transparent',
      accent: 'Campanhas fortes começam em decisões pequenas, mas certas.'
    }
  ];

  const next = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      return;
    }

    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 p-8 backdrop-blur-2xl animate-in fade-in duration-500">
      <div
        className={clsx(
          'relative flex w-full max-w-sm flex-col gap-7 overflow-hidden rounded-[40px] border border-white/8 bg-gradient-to-b bg-surface p-8 shadow-2xl transition-all duration-700',
          slide.color
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/10'
                )}
              />
            ))}
          </div>

          <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
          {slide.icon}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">{slide.eyebrow}</p>
          <h2 className="mt-3 text-[30px] font-black leading-[1.02] tracking-tight text-white">{slide.title}</h2>
          <p className="mt-4 text-[14px] leading-7 text-white/68">{slide.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
            <Flag size={12} />
            {slide.accent}
          </div>
        </div>

        <div className="space-y-3 rounded-[28px] border border-white/8 bg-background/35 p-5">
          <div className="flex items-center gap-2 text-amber-200">
            <ShieldAlert size={16} />
            <p className="text-[10px] font-black uppercase tracking-[0.16em]">Leitura prática</p>
          </div>

          {slide.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/45" />
              <p className="text-[13px] leading-6 text-white/74">{bullet}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            onClick={next}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-[28px] bg-white text-slate-900 shadow-xl transition-all active:scale-95"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Entrar no jogo</span>
                <Play size={18} fill="currentColor" />
              </>
            ) : (
              <>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Próximo passo</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
          <button
            onClick={onComplete}
            className="flex h-16 items-center justify-center gap-2 rounded-[28px] border border-white/10 bg-white/5 px-5 text-[11px] font-black uppercase tracking-[0.2em] text-white/72 transition-all active:scale-95"
          >
            Pular
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
