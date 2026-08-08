import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[250] flex touch-pan-y items-center justify-center overflow-y-auto overscroll-contain bg-black/90 p-4 backdrop-blur-3xl sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-[#0f172a] p-4 text-center text-white shadow-2xl sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2 text-left">
              <Sparkles size={20} className="text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-sm font-black italic uppercase tracking-tight text-white leading-none">
                  {title}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Comunidade BNR Manager</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all active:scale-90"
              title="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <div className="w-full overflow-hidden rounded-xl bg-slate-900 border border-white/5">
            <iframe
              src="https://formularios.ia.br/f/formulario-de-contato-ijfec7"
              width="100%"
              height="520"
              frameBorder="0"
              style={{ border: 0, borderRadius: '8px' }}
              title="Formulário BNR Manager"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white"
          >
            Fechar e Continuar Jogando
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
