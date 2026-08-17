import React, { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, Gift, Mail, Play, Shield, Sparkles, Target, Users, Zap } from 'lucide-react';

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
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('bolanarede_user_email') || '';
    } catch {
      return '';
    }
  });
  const [isEmailSaved, setIsEmailSaved] = useState(() => {
    try {
      return !!localStorage.getItem('bolanarede_user_email');
    } catch {
      return false;
    }
  });

  const handleSaveEmail = () => {
    if (!email || !email.includes('@')) return;
    try {
      localStorage.setItem('bolanarede_user_email', email.trim());
      setIsEmailSaved(true);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'onboarding',
          event_label: 'onboarding_email_modal',
        });
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleNext = () => {
    if (slide === 2 && email.includes('@') && !isEmailSaved) {
      handleSaveEmail();
    }
    setSlide((s) => s + 1);
  };

  const slides = [
    {
      badge: 'Contrato Assinado',
      title: `Você é o novo técnico do ${teamName}!`,
      subtitle: 'BNR Manager — O Futebol sob a sua estratégia.',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            A diretoria e a torcida contam com a sua liderança para buscar títulos nesta temporada.
          </p>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles size={16} />
              <span>Objetivo Principal</span>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Consolidar o esquema tático, gerenciar o desgaste do elenco e manter as contas do clube no verde.
            </p>
          </div>
        </div>
      ),
    },
    {
      badge: 'Pilares da Gestão',
      title: 'Tática, Energia e Elenco',
      subtitle: 'O segredo da vitória está nos detalhes antes de entrar em campo.',
      icon: Zap,
      content: (
        <div className="grid gap-2.5 text-left">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <Shield className="mt-0.5 shrink-0 text-emerald-400" size={18} />
            <div>
              <p className="text-xs font-bold text-white">Formação &amp; Postura</p>
              <p className="text-[11px] text-slate-300">Ajuste o estilo de jogo (Ofensivo, Equilibrado ou Defensivo) de acordo com o adversário.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <Users className="mt-0.5 shrink-0 text-amber-400" size={18} />
            <div>
              <p className="text-xs font-bold text-white">Energia &amp; Rotação</p>
              <p className="text-[11px] text-slate-300">Evite escalações com jogadores exaustos para prevenir lesões e manter alto rendimento.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Progresso do Técnico',
      title: 'Salve sua Carreira & Notificações',
      subtitle: 'Preencha o formulário abaixo (opcional) para salvar seu progresso e receber novidades VIP.',
      icon: Mail,
      content: (
        <div className="space-y-3 text-left">
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-inner">
            <iframe
              src="https://formularios.ia.br/f/formulario-de-contato-ijfec7"
              width="100%"
              height="380"
              frameBorder="0"
              style={{ border: 0, borderRadius: '12px' }}
              title="Formulário BNR Manager"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <a
              href="https://formularios.ia.br/f/formulario-de-contato-ijfec7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-slate-300 hover:text-white hover:underline"
            >
              <span>Abrir em nova aba</span>
              <ExternalLink size={12} className="text-emerald-400" />
            </a>
            <button
              type="button"
              onClick={() => setSlide((s) => s + 1)}
              className="font-bold text-emerald-400 hover:underline"
            >
              Pular esta etapa &rarr;
            </button>
          </div>
        </div>
      ),
    },
    {
      badge: 'Sua Estreia',
      title: `Próximo jogo: contra o ${nextOpponentName}`,
      subtitle: 'Use o Guia de Primeiros Passos no painel para se preparar.',
      icon: Target,
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5">
            <Target className="shrink-0 text-amber-400" size={22} />
            <p className="text-xs leading-relaxed text-slate-300">
              Você pode ir direto para o vestiário preparar o time ou explorar o painel geral do clube antes do apito inicial.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[slide];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 p-4 sm:p-5 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="max-h-[90dvh] w-full max-w-md touch-pan-y overflow-y-auto overscroll-contain no-scrollbar rounded-[32px] border border-emerald-500/30 bg-gradient-to-b from-[#0F172A] to-[#090D16] p-6 sm:p-7 shadow-2xl">
        {/* Header Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Logo" className="h-10 w-10 shrink-0" />
            <div>
              <span className="block text-xs font-black italic tracking-wider text-white">
                BNR <span className="text-emerald-400">MANAGER</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400">Edição 2026</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-400 hover:text-white"
          >
            Pular
          </button>
        </div>

        {/* Slide Indicator */}
        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            {current.badge}
          </span>
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === slide ? 'w-6 bg-gradient-to-r from-emerald-400 to-amber-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Icon size={24} />
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl font-black leading-tight text-white">{current.title}</h2>
          <p className="mt-1.5 text-xs text-slate-400">{current.subtitle}</p>

          <div className="mt-4">{current.content}</div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          {slide < slides.length - 1 ? (
            <div className="flex items-center gap-2">
              {slide > 0 && (
                <button
                  onClick={() => setSlide((s) => s - 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 font-extrabold uppercase tracking-wider text-slate-950 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
              >
                <span className="text-xs">
                  {slide === 2 ? (email ? 'Salvar E-mail e Continuar' : 'Continuar sem E-mail') : 'Próximo Passo'}
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="grid gap-2.5">
              <button
                onClick={onPlay}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-emerald-500/25 active:scale-[0.98]"
              >
                <Play size={18} fill="currentColor" />
                <span className="text-xs sm:text-sm">Preparar Estreia</span>
              </button>
              <button
                onClick={onComplete}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-all active:scale-[0.98]"
              >
                <span className="text-xs font-bold uppercase tracking-wider">Ir ao Painel do Clube</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


