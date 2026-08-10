import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, Sparkles, X, Shield, Users, DollarSign, Play } from 'lucide-react';

interface FirstStepsChecklistProps {
  completedSteps: string[];
  onNavigateScreen: (screen: 'tactics' | 'squad' | 'finances' | 'match') => void;
  onDismiss: () => void;
}

export default function FirstStepsChecklist({
  completedSteps,
  onNavigateScreen,
  onDismiss,
}: FirstStepsChecklistProps) {
  const [minimized, setMinimized] = useState(false);

  const steps = [
    {
      id: 'tactics',
      title: 'Definir Formação & Tática',
      desc: 'Ajuste a postura do time e os cobradores de falta.',
      icon: Shield,
      actionLabel: 'Ir para Tática',
    },
    {
      id: 'squad',
      title: 'Avaliar Energia do Elenco',
      desc: 'Verifique a condição física e moral dos titulares.',
      icon: Users,
      actionLabel: 'Ver Elenco',
    },
    {
      id: 'finances',
      title: 'Ajustar Ingressos e Finanças',
      desc: 'Defina o valor dos bilhetes para lotar seu estádio.',
      icon: DollarSign,
      actionLabel: 'Ver Finanças',
    },
    {
      id: 'match',
      title: 'Preparar Partida de Estreia',
      desc: 'Entre no vestiário e comande seu time em campo.',
      icon: Play,
      actionLabel: 'Ir para o Jogo',
    },
  ];

  const completedCount = steps.filter((s) => completedSteps.includes(s.id)).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  if (minimized) {
    return (
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs backdrop-blur-xl animate-in fade-in">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <span className="font-bold text-white">Guia do Treinador</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold">
            {completedCount}/{steps.length} concluídos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(false)}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            Expandir
          </button>
          <button onClick={onDismiss} className="text-slate-400 hover:text-white" title="Fechar guia">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-[#0B132B]/90 to-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Guia do Treinador <span className="text-emerald-400">• Primeiros Passos</span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">Complete as tarefas para dominar o clube</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(true)}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
            title="Minimizar"
          >
            <span className="text-xs font-bold text-slate-400">Minimizar</span>
          </button>
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
            title="Ocultar guia"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300">Progresso de Onboarding</span>
          <span className="text-emerald-400 font-mono">{progressPercent}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`group flex items-center justify-between rounded-2xl border p-3 transition-all ${
                isDone
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-400'
                  : 'border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {isDone ? (
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                ) : (
                  <Circle size={20} className="shrink-0 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
                </div>
              </div>

              {!isDone && (
                <button
                  onClick={() => onNavigateScreen(step.id as any)}
                  className="ml-2 flex shrink-0 items-center gap-1 rounded-xl bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                >
                  <span>Ir</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
