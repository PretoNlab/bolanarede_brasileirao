import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { impactMedium } from '../haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  title = 'Receba Atualizações & Novidades VIP',
  subtitle = 'Seja notificado quando lançarmos as Ligas Europeias (Champions League), novos elencos e atualizações de mercado!',
}: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Digite um e-mail válido.');
      return;
    }

    impactMedium();

    // 1. Save locally
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bolanarede_user_email', email);
    }

    // 2. Track event in GA4 / Custom Event
    const win = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof win.gtag === 'function') {
      try {
        win.gtag('event', 'lead_captured', { email, page: window.location.pathname });
      } catch {
        // Ignore analytics failures
      }
    }

    setSubmitted(true);
    toast.success('Inscrição confirmada com sucesso!', { icon: '⚽' });
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[250] flex touch-pan-y items-center justify-center overflow-y-auto overscroll-contain bg-black/90 p-6 backdrop-blur-3xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-[#0f172a] p-6 text-center text-white shadow-2xl sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
                <Sparkles size={32} className="animate-float" />
              </div>

              <div>
                <span className="ui-label-caps text-emerald-400">Comunidade VIP BNR</span>
                <h3 className="mt-1 text-2xl font-black italic tracking-tight uppercase leading-tight text-white">
                  {title}
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
                  {subtitle}
                </p>
              </div>

              <div className="relative text-left">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-xs font-bold text-white placeholder-slate-400 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-500 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95"
              >
                Quero Receber Novidades
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white"
              >
                Agora Não, Continuar Jogando
              </button>
            </form>
          ) : (
            <div className="py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-black italic uppercase text-white">Inscrição Confirmada!</h3>
              <p className="text-xs font-medium text-slate-300">
                Obrigado! Você receberá em primeira mão os avisos de novas temporadas e atualizações.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
