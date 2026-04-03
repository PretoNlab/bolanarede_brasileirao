import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  Briefcase,
  ChevronRight,
  Play,
  ShieldAlert,
  Target,
  Trophy,
  Wallet
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    title: 'Primeiro: leia o momento do clube',
    eyebrow: 'Centro de comando',
    description: 'Antes de mexer em tudo, veja próxima partida, moral, caixa e alertas. O jogo sempre te mostra onde está a pressão real.',
    bullets: ['Olhe o dashboard antes de abrir módulos', 'Resolva o que ameaça resultado ou caixa', 'Evite decisões sem contexto'],
    icon: <Briefcase className="text-primary" size={44} />,
    color: 'from-blue-500/20 to-transparent'
  },
  {
    title: 'Mercado é ajuste, não impulso',
    eyebrow: 'Janela inteligente',
    description: 'Contrate quando houver encaixe e caixa. Se a margem estiver curta, agentes livres, empréstimos e vendas valem mais do que disputa cara.',
    bullets: ['Use mercado para corrigir elenco', 'Não compre acima do caixa sem plano', 'Venda quando precisar abrir espaço ou receita'],
    icon: <Wallet className="text-emerald-400" size={44} />,
    color: 'from-emerald-500/20 to-transparent'
  },
  {
    title: 'Partida se vence na hora certa',
    eyebrow: 'Leitura de jogo',
    description: 'Durante o jogo, momentum, energia e moral importam. Ajuste tática e substituições quando a partida pedir, não por reflexo.',
    bullets: ['Observe queda de energia', 'Mude mentalidade com critério', 'Use o momentum para acelerar ou segurar'],
    icon: <Target className="text-yellow-400" size={44} />,
    color: 'from-yellow-500/20 to-transparent'
  },
  {
    title: 'Seu objetivo é sustentar desempenho',
    eyebrow: 'Pressão de temporada',
    description: 'Ganhar importa, mas sobreviver à temporada exige equilíbrio entre resultado, ambiente e dinheiro. É isso que mantém o cargo.',
    bullets: ['Resultado ruim derruba confiança', 'Caixa ruim limita reação', 'Clube estável rende mais no longo prazo'],
    icon: <Trophy className="text-amber-500" size={44} />,
    color: 'from-amber-500/20 to-transparent'
  }
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      return;
    }

    onComplete();
  };

  const slide = SLIDES[currentSlide];

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
            {SLIDES.map((_, index) => (
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
            {currentSlide + 1} / {SLIDES.length}
          </div>
        </div>

        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
          {slide.icon}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">{slide.eyebrow}</p>
          <h2 className="mt-3 text-[30px] font-black leading-[1.02] tracking-tight text-white">{slide.title}</h2>
          <p className="mt-4 text-[14px] leading-7 text-white/68">{slide.description}</p>
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

        <button
          onClick={next}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-[28px] bg-white text-slate-900 shadow-xl transition-all active:scale-95"
        >
          {currentSlide === SLIDES.length - 1 ? (
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
      </div>
    </div>
  );
}
